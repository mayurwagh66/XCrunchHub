import React, { useState, useEffect, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { useActiveAccount } from "thirdweb/react"; // Import useActiveAccount

// Import your actual components from their correct paths
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Token from "./components/Token";
import TokenDetails from "./components/TokenDetials";
import Pool from "./components/Pool";
import Subscription from "./components/Subscription";
import Footer from "./components/Footer";
import PoolDetails from "./components/PoolDetails";
import Portfolio from "./components/Portfolio";
import AiAnalyzer from "./components/AiAnalyzer"; // Import AiAnalyzer
import TelegramBotButton from "./components/TelegramBotButton"; // Import TelegramBotButton
import FraudDetection from "./components/FraudDetection"; // Import FraudDetection
import NftDashboards from "./components/NftDashboards";

// Create the context to share data
export const DataContext = createContext();

// Create the provider component that will fetch and cache the data
const DataProvider = ({ children }) => {
  const [tokens, setTokens] = useState([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const account = useActiveAccount(); // Get active account

  useEffect(() => {
    const fetchDataSequentially = async () => {
      try {
        // --- THIS IS THE FIX ---
        // Fetch tokens first, and wait for it to complete
        const tokenRes = await axios.get(`${import.meta.env.VITE_API_URL}/Token`);
        if (tokenRes.data && Array.isArray(tokenRes.data)) {
          setTokens(tokenRes.data);
        }
        
        // Then, fetch the pools
        const poolRes = await axios.get(`${import.meta.env.VITE_API_URL}/pool`);
        if (poolRes.data && Array.isArray(poolRes.data)) {
           const processedPools = poolRes.data
            .map((pool) => ({
              ...pool,
              id: pool.pair_address,
              blockchain: pool.blockchain?.charAt(0).toUpperCase() + pool.blockchain?.slice(1) || 'Unknown',
              pool: pool.pool || `${pool.token0_symbol || 'Token0'}/${pool.token1_symbol || 'Token1'}`,
              token0_symbol: pool.token0_symbol || 'Unknown',
              token1_symbol: pool.token1_symbol || 'Unknown',
              protocol: pool.protocol || 'Unknown',
              rank: pool.rank,
            }))
            .filter(pool => pool.pair_address);
          setPools(processedPools);
        }

      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataSequentially();
  }, []);

  return (
    <DataContext.Provider value={{ tokens, pools, loading, account }}>
      {children}
    </DataContext.Provider>
  );
};


export default function App() {
  return (
    <DataProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Token" element={<Token />} />
          <Route path="/Pool" element={<Pool />} />
          <Route path="/Subscription" element={<Subscription/>} />
          <Route path="/Token/:blockchain/:tokenId" element={<TokenDetails />} />
          <Route path="/PoolDetails/:blockchain/:pairAddress" element={<PoolDetails />} />
          <Route path="/Portfolio" element={<Portfolio/>}/>
          <Route path="/ai-analyzer" element={<AiAnalyzer />} /> {/* No longer passing account prop directly here */}
          <Route path="/fraud-detection" element={<FraudDetection />} />
          <Route path="/nft-dashboards" element={<NftDashboards />} />
        </Routes>
        <Footer/>
        <TelegramBotButton /> {/* Add the Telegram bot button here */}
      </div>
    </DataProvider>
  );
}
