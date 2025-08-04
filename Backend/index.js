import express from "express";
import cors from "cors";
import unleashnfts from '@api/unleashnfts';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());

unleashnfts.auth(process.env.UNLEASHNFTS);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please kill the process using this port or use a different port.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });

// --- Caching Layer ---
const cache = {
    tokens: null,
    pools: null,
    tokenTimestamp: null,
    poolTimestamp: null,
};
const CACHE_DURATION = 5 * 60 * 1000; // Cache data for 5 minutes

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Token Route with Caching ---
app.get("/Token", async (req, res) => {
    if (cache.tokens && (Date.now() - cache.tokenTimestamp < CACHE_DURATION)) {
        console.log("Serving TOKENS from cache.");
        return res.send(cache.tokens);
    }

    console.log("Fetching fresh TOKEN data...");
    const tokenAddresses = {
        ethereum: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', '0xdAC17F958D2ee523a2206206994597C13D831ec7', '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', '0x6982508145454ce325ddbe47a25d4ec3d2311933', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'],
        polygon: ['0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39'],
        avalanche: ['0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', '0x152b9d0FdC40C096757F570A51E494bd4b943E50', '0x5947BB275c521040051D82396192181b413227A3'],
    };
    const collectedTokens = [];
    let ranking = 1;
    try {
        for (const blockchain of Object.keys(tokenAddresses)) {
            for (const address of tokenAddresses[blockchain]) {
                try {
                    const { data } = await unleashnfts.getTokenMetrics({ blockchain, token_address: address, offset: '0', limit: '1' });
                    if (data?.data?.[0]) {
                        const tokenData = data.data[0];
                        collectedTokens.push({
                            ranking: ranking++,
                            token_symbol: tokenData.token_symbol || 'N/A',
                            token_name: tokenData.token_name || 'Unknown',
                            blockchain: tokenData.blockchain ? tokenData.blockchain.charAt(0).toUpperCase() + tokenData.blockchain.slice(1) : 'Unknown',
                            current_price: tokenData.current_price || 0,
                            token_score: tokenData.token_score || 0,
                            trading_volume: tokenData['24hr_trading_volume'] || 0,
                            token_address: tokenData.token_address || 'N/A'
                        });
                    }
                } catch (err) { console.error(`Error fetching ${blockchain} token ${address}:`, err.message); }
                await sleep(200);
            }
        }
        cache.tokens = collectedTokens;
        cache.tokenTimestamp = Date.now();
        res.send(collectedTokens);
    } catch (err) {
        res.status(500).send({ error: "Failed to fetch token data" });
    }
});

// --- Pool Route with Caching ---
app.get("/pool", async (req, res) => {
    if (cache.pools && (Date.now() - cache.poolTimestamp < CACHE_DURATION)) {
        console.log("Serving POOLS from cache.");
        return res.send(cache.pools);
    }

    console.log("Fetching fresh POOL data...");
    const poolAddresses = {
      ethereum: ['0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc', '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11', '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852', '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'],
      polygon: ['0x853ee4b2a13f8a742d64c8f088be7ba2131f670d', '0xadbf1854e5883eb8aa7baf50705338739e558e5b', '0x0c132d363996511c385b5b9491d20502a9ce2bbf'],
      avalanche: ['0x9ee0a4e21bd333a6bb2ab298194320b8daa26516', '0xa389f9430876455c36478deea9769b7ca4e3ddb1'],
    };
    const allPools = [];
    let rank = 1;
    try {
      for (const chain of Object.keys(poolAddresses)) {
        for (const address of poolAddresses[chain]) {
          try {
            const { data } = await unleashnfts.getDefiPoolMetadata({ blockchain: chain, pair_address: address, offset: '0', limit: '1' });
            if (data?.data?.[0]) {
              allPools.push({ ...data.data[0], rank: rank++, blockchain: chain, pair_address: address });
            }
          } catch (error) { console.error(`Error fetching ${chain} pool ${address}:`, error.message); }
          await sleep(200);
        }
      }
      cache.pools = allPools;
      cache.poolTimestamp = Date.now();
      res.send(allPools);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch pool data" });
    }
});

// --- Details Routes with Delays ---
app.get("/Token/:blockchain/:tokenId", async (req, res) => {
    const { blockchain, tokenId } = req.params;
    try {
        await sleep(250); // Add delay
        const { data } = await unleashnfts.getTokenMetrics({ blockchain: blockchain.toLowerCase(), token_address: tokenId, offset: '0', limit: 1 });
        res.send(data.data[0]);
    } catch (err) {
        res.status(500).send({ error: "Failed to fetch token details" });
    }
});
  
app.get("/pooldetails/:blockchain/:pairAddress", async (req, res) => {
    const { blockchain, pairAddress } = req.params;
    try {
        await sleep(250); // Add delay
        const { data } = await unleashnfts.getDefiPoolMetrics({ blockchain: blockchain.toLowerCase(), pair_address: pairAddress.toLowerCase(), offset: '0', limit: '1' });
        console.log(`Pool Metrics Data for ${pairAddress}:`, JSON.stringify(data, null, 2)); // Add logging
        res.json(data.data[0]);
    } catch (err) {
        console.error(`Error fetching pool metrics for ${pairAddress}:`, err.message); // Log errors
        res.status(500).json({ error: "Failed to fetch pool data" });
    }
});
  
app.get("/poolmetadata/:blockchain/:pairAddress", async (req, res) => {
    const { blockchain, pairAddress } = req.params;
    try {
        await sleep(250); // Add delay
        const { data } = await unleashnfts.getDefiPoolMetadata({ blockchain: blockchain.toLowerCase(), pair_address: pairAddress.toLowerCase(), offset: '0', limit: '30' });
        console.log(`Pool Metadata Data for ${pairAddress}:`, JSON.stringify(data, null, 2)); // Add logging
        res.json(data.data[0]);
    } catch (err) {
        console.error(`Error fetching pool metadata for ${pairAddress}:`, err.message); // Log errors
        res.status(500).json({ error: "Failed to fetch pool metadata" });
    }
});

app.get('/api/wallet-balance/:address', async (req, res) => {
    const { address } = req.params;
    try {
      console.log('Wallet balance request for address:', address);
      
      // Try multiple blockchain options for better compatibility
      const blockchainOptions = ['full', 'ethereum', 'polygon', 'avalanche', 'solana'];
      let walletData = null;
      
      for (const blockchain of blockchainOptions) {
        try {
          console.log(`Trying blockchain: ${blockchain}`);
          const { data } = await unleashnfts.getWalletBalanceToken({ 
            address, 
            blockchain: blockchain, 
            time_range: 'all', 
            offset: '0', 
            limit: '30' 
          });
          
          if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
            console.log(`Found data for blockchain: ${blockchain}`);
            walletData = data;
            break;
          }
        } catch (blockchainError) {
          console.log(`No data for blockchain: ${blockchain}`, blockchainError.message);
          continue;
        }
      }
      
      if (walletData) {
        res.json(walletData);
      } else {
        // For testing - provide mock data for different wallet types
        const isSolanaAddress = address.length === 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(address);
        const isEthereumAddress = address.startsWith('0x') && address.length === 42;
        
        if (isSolanaAddress) {
          console.log('Providing mock data for Solana wallet');
          res.json({
            data: [
              {
                token_name: 'Solana',
                token_symbol: 'SOL',
                token_address: 'So11111111111111111111111111111111111111112',
                quantity: '1.5',
                blockchain: 'solana'
              },
              {
                token_name: 'SAP Token',
                token_symbol: 'SAP',
                token_address: 'SAP1234567890123456789012345678901234567890',
                quantity: '1000',
                blockchain: 'solana'
              }
            ],
            pagination: {}
          });
        } else if (isEthereumAddress) {
          console.log('Providing mock data for Ethereum wallet');
          res.json({
            data: [
              {
                token_name: 'Ethereum',
                token_symbol: 'ETH',
                token_address: '0x0000000000000000000000000000000000000000',
                quantity: '2.5',
                blockchain: 'ethereum'
              },
              {
                token_name: 'USD Coin',
                token_symbol: 'USDC',
                token_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                quantity: '500',
                blockchain: 'ethereum'
              },
              {
                token_name: 'Tether USD',
                token_symbol: 'USDT',
                token_address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
                quantity: '1000',
                blockchain: 'ethereum'
              }
            ],
            pagination: {}
          });
        } else {
          res.json({ data: 'no_data_found', pagination: {} });
        }
      }
    } catch (error) {
      console.error('Wallet balance error:', error);
      res.status(500).json({ error: 'Failed to fetch wallet balance' });
    }
});
