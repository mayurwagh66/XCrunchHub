import React, { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    AiOutlineSearch, 
    AiOutlineFilter,
    AiOutlineWallet,
    AiOutlineBarChart
} from 'react-icons/ai';
import { 
    FaCoins,
    FaNetworkWired,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaEye,
    FaChartLine,
    FaRocket
} from 'react-icons/fa';

const Portfolio = () => {
  const account = useActiveAccount();
  const address = account?.address || '';
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBalance = async () => {
    if (!address) {
      setError('No wallet address connected');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/wallet-balance/${address}`);
      
      console.log('Portfolio API response:', response.data);
      console.log('API URL:', `${import.meta.env.VITE_API_URL}/api/wallet-balance/${address}`);
      console.log('Wallet address:', address);
      
      // Detect wallet type based on address format
      const isSolanaAddress = address.length === 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(address);
      console.log('Wallet type detected:', isSolanaAddress ? 'Solana' : 'Ethereum-based');
      
      // Ensure we have a valid array of data
      let portfolioData = [];
      if (response.data && response.data.data) {
        // Handle case where data.data is a string like 'no_data_found'
        if (typeof response.data.data === 'string') {
          portfolioData = [];
        } else if (Array.isArray(response.data.data)) {
          portfolioData = response.data.data;
        } else {
          portfolioData = [];
        }
      } else if (Array.isArray(response.data)) {
        portfolioData = response.data;
      } else {
        portfolioData = [];
      }
      
      console.log('Processed portfolio data:', portfolioData);
      console.log('Number of tokens found:', portfolioData.length);
      
      // Log each token for debugging
      portfolioData.forEach((token, index) => {
        console.log(`Token ${index + 1}:`, {
          name: token?.token_name,
          symbol: token?.token_symbol,
          address: token?.token_address,
          quantity: token?.quantity,
          blockchain: token?.blockchain
        });
      });
      
      setData(portfolioData);
      
      // Show appropriate message when no data is found
      if (portfolioData.length === 0) {
        const isSolanaAddress = address.length === 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(address);
        const isEthereumAddress = address.startsWith('0x') && address.length === 42;
        
        if (isSolanaAddress) {
          setError('No Solana tokens found in this wallet. The API is trying to support Solana but may have limited data. Please ensure your Solana wallet has tokens and try again.');
        } else if (isEthereumAddress) {
          setError('No Ethereum tokens found in this wallet. The API is trying to support Ethereum but may have limited data. Please ensure your Ethereum wallet has tokens and try again.');
        } else {
          setError('No tokens found in this wallet. Try connecting a different wallet or check if the wallet has any tokens.');
        }
      } else {
        setError(''); // Clear any previous errors
      }
    } catch (err) {
      console.error('Portfolio fetch error:', err);
      
      // Handle different types of errors
      if (err.code === 4001) {
        setError('Wallet connection was rejected. Please try connecting again.');
      } else if (err.response?.data?.data === 'no_data_found') {
        setError('No portfolio data found for this wallet address.');
      } else {
        setError('Failed to fetch wallet balance. Please try again.');
      }
      
      setData([]); // Ensure data is always an array even on error
    }
    setLoading(false);
  };

  useEffect(() => {
    if (address && address.length > 0) {
      fetchBalance();
    } else {
      setData([]);
      setError('Please connect your wallet to view your portfolio.');
    }
  }, [address]);

  const handleRowClick = (tokenAddress, blockchain) => {
    if (tokenAddress && blockchain) {
      navigate(`/Token/${blockchain}/${tokenAddress}`);
    }
  };

  // Ensure `data` is always an array before applying `filter` and `sort`
  const filteredData = Array.isArray(data) ? data.filter(item =>
    item && item.token_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item && item.token_symbol?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const sortedData = [...filteredData].sort((a, b) => {
    const valueA = parseFloat(a?.quantity || 0);
    const valueB = parseFloat(b?.quantity || 0);
    return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
  });

  const getTotalValue = () => {
    return sortedData.reduce((total, token) => {
      return total + parseFloat(token?.quantity || 0);
    }, 0);
  };

  const getSortIcon = () => {
    if (sortOrder === 'asc') return <FaSortUp className="text-blue-400" />;
    if (sortOrder === 'desc') return <FaSortDown className="text-blue-400" />;
    return <FaSort className="text-gray-400" />;
  };

  const SkeletonCard = () => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="text-right">
          <div className="h-4 bg-slate-700 rounded w-20 mb-2"></div>
          <div className="h-3 bg-slate-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-6 py-3 mb-6">
              <AiOutlineWallet className="text-blue-400 text-xl" />
              <span className="text-blue-400 font-medium">Portfolio Management</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              Crypto
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Portfolio</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Track and manage your cryptocurrency holdings across multiple blockchains with real-time data and analytics
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar - Stats */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                {/* Portfolio Stats */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <AiOutlineBarChart className="text-blue-400" />
                    <span>Portfolio Stats</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">{sortedData.length}</div>
                      <p className="text-slate-400 text-sm">Total Tokens</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-1">{getTotalValue().toFixed(2)}</div>
                      <p className="text-slate-400 text-sm">Total Value</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A'}
                      </div>
                      <p className="text-slate-400 text-sm">Wallet Address</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <FaRocket className="text-blue-400" />
                    <span>Quick Actions</span>
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 p-3 rounded-xl transition-all flex items-center justify-center space-x-2">
                      <FaEye />
                      <span>View Analytics</span>
                    </button>
                    <button className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 p-3 rounded-xl transition-all flex items-center justify-center space-x-2">
                      <FaChartLine />
                      <span>Performance</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Portfolio */}
          <div className="xl:col-span-3">
            <div className="space-y-8">
              {/* Search and Filter Controls */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Search Tokens</label>
                    <div className="relative">
                      <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by token name or symbol..."
                        className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="lg:w-48">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Sort by Quantity</label>
                    <div className="relative">
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white hover:bg-slate-700/70 transition-all flex items-center justify-between"
                      >
                        <span>{sortOrder === 'asc' ? 'Low to High' : 'High to Low'}</span>
                        {getSortIcon()}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <div className="text-center">
                    <div className="text-yellow-400 font-medium mb-2 flex items-center justify-center space-x-2">
                      <AiOutlineFilter className="text-yellow-400" />
                      <span>Notice</span>
                    </div>
                    <div className="text-gray-300">{error}</div>
                    {error.includes('No tokens found') && (
                      <div className="mt-2 text-sm text-gray-400">
                        This wallet might be empty or not contain any supported tokens.
                      </div>
                    )}
                    {error.includes('rejected') && (
                      <button
                        onClick={fetchBalance}
                        className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center space-x-2 mx-auto"
                      >
                        <FaRocket />
                        <span>Try Again</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Portfolio Tokens */}
              <div className="space-y-4">
                {loading ? (
                  // Loading skeleton
                  [...Array(3)].map((_, index) => <SkeletonCard key={index} />)
                ) : sortedData.length > 0 ? (
                  // Token cards
                  sortedData.map((token, index) => (
                    <div
                      key={index}
                      onClick={() => handleRowClick(token?.token_address || '', token?.blockchain || '')}
                      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:bg-slate-700/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <FaCoins className="text-white text-xl" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                              {token?.token_name || 'Unknown Token'}
                            </h3>
                            <p className="text-slate-400 text-sm">{token?.token_symbol || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-400 mb-1">
                            {parseFloat(token?.quantity || 0).toFixed(6)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaNetworkWired className="text-blue-400" />
                            <span className="text-slate-400 text-sm capitalize">
                              {token?.blockchain || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Empty state
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50 text-center">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCoins className="text-slate-400 text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No tokens in portfolio</h3>
                    <p className="text-slate-400">Connect your wallet to view your cryptocurrency holdings.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm">Portfolio data is for informational purposes only. Always verify your holdings.</p>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
