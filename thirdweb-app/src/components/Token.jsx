import React, { useState, useContext } from "react";
import { FaSortUp, FaSortDown, FaSearch, FaFilter, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../App";

const formatVolume = (number) => {
  if (!number) return "0";
  const num = parseFloat(number);
  if (num >= 1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(2) + "T";
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(2) + "K";
  return num.toFixed(2);
};

const getSafetyScoreStyles = (score) => {
  if (score >= 90) return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
  if (score >= 80) return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
  if (score >= 70) return "bg-gradient-to-r from-orange-500 to-red-500 text-white";
  return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
};

const getScoreIcon = (score) => {
  if (score >= 80) return <FaShieldAlt className="text-green-400" />;
  if (score >= 60) return <FaChartLine className="text-yellow-400" />;
  return <FaChartLine className="text-red-400" />;
};

const Token = () => {
  const { tokens, loading } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChain, setSelectedChain] = useState("All Chains");
  const [sortConfig, setSortConfig] = useState({ key: "ranking", direction: "asc" });
  const navigate = useNavigate();

  const headers = [
    { text: "#", key: "ranking", icon: null },
    { text: "Asset", key: "asset", icon: null },
    { text: "Chain", key: "chain", icon: null },
    { text: "DeFi Score", key: "safetyScore", icon: <FaShieldAlt /> },
    { text: "Price", key: "price", icon: <FaChartLine /> },
    { text: "24hr Volume", key: "tradingVolume", icon: <FaChartLine /> }
  ];

  const processedTokens = tokens.map((token) => ({
    id: token.token_address,
    ranking: token.ranking,
    asset: token.token_name,
    chain: token.blockchain,
    safetyScore: token.token_score ? parseFloat(token.token_score) : 0,
    price: token.current_price ? parseFloat(token.current_price).toFixed(4) : "0.0000",
    tradingVolume: formatVolume(token.trading_volume),
    tradingVolumeValue: parseFloat(token.trading_volume) || 0,
  }));

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSortUp size={12} className="text-gray-400 opacity-50" />;
    return sortConfig.direction === "asc" ? 
      <FaSortUp size={12} className="text-blue-400" /> : 
      <FaSortDown size={12} className="text-blue-400" />;
  };

  const handleRowClick = (tokenId, blockchain) => {
    navigate(`/Token/${blockchain}/${tokenId}`);
  };

  const filteredTokens = processedTokens.filter((token) =>
    token.asset.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedChain === "All Chains" || token.chain.toLowerCase() === selectedChain.toLowerCase())
  );
  
  const sortedAndFilteredTokens = [...filteredTokens].sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
  });

  const SkeletonRow = () => (
    <tr className="animate-pulse hover:bg-slate-800/50 transition-all duration-300">
      {headers.map((_, i) => (
        <td key={i} className={`py-6 px-6 border-b border-slate-700/50 ${i < headers.length - 1 ? 'border-r border-slate-700/30' : ''}`}>
          <div className="h-4 bg-slate-700 rounded-lg w-3/4 mx-auto"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto pt-24 pb-32">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Token Analytics</h1>
              <p className="text-slate-400 text-sm">Discover and analyze the best DeFi tokens</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700/50">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tokens..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 text-sm rounded-xl border border-slate-600/50 bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-sm" 
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <select 
                value={selectedChain} 
                onChange={(e) => setSelectedChain(e.target.value)} 
                className="pl-12 pr-8 py-4 text-sm rounded-xl border border-slate-600/50 bg-slate-700/50 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-sm appearance-none"
              >
                <option value="All Chains">All Chains</option>
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="Avalanche">Avalanche</option>
                <option value="Linea">Linea</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10">
                <tr>
                  {headers.map((header, index) => (
                    <th key={header.key} className={`py-6 px-6 text-sm font-semibold text-slate-300 text-left border-b border-slate-700/50 ${index < headers.length - 1 ? 'border-r border-slate-700/30' : ''}`}>
                      <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => handleSort(header.key)}>
                        {header.icon && <span className="text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity">{header.icon}</span>}
                        <span className="group-hover:text-blue-300 transition-colors">{header.text}</span>
                        {getSortIcon(header.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {loading ? (
                  [...Array(10)].map((_, i) => <SkeletonRow key={i} />)
                ) : sortedAndFilteredTokens.length > 0 ? (
                  sortedAndFilteredTokens.map((token, index) => (
                    <tr 
                      key={token.id} 
                      onClick={() => handleRowClick(token.id, token.chain)} 
                      className="cursor-pointer transition-all duration-300 hover:bg-slate-700/30 group border-b border-slate-700/20"
                    >
                      <td className="py-6 px-6 text-sm text-slate-400 border-r border-slate-700/30">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono">#{token.ranking}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 border-r border-slate-700/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{token.asset.charAt(0)}</span>
                          </div>
                          <span className="text-white font-medium group-hover:text-blue-300 transition-colors">{token.asset}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-sm text-slate-400 border-r border-slate-700/30">
                        <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs">{token.chain}</span>
                      </td>
                      <td className="py-6 px-6 border-r border-slate-700/30">
                        <div className="flex items-center space-x-2">
                          {getScoreIcon(Math.ceil(token.safetyScore))}
                          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getSafetyScoreStyles(Math.ceil(token.safetyScore))}`}>
                            {Math.ceil(token.safetyScore)}/100
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-sm text-green-400 font-mono border-r border-slate-700/30">
                        ${token.price}
                      </td>
                      <td className="py-6 px-6 text-sm text-cyan-400 font-mono">
                        ${token.tradingVolume}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center space-y-3">
                        <FaSearch className="text-4xl text-slate-600" />
                        <p className="text-lg">No tokens found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Tokens</p>
                <p className="text-white text-xl font-bold">{sortedAndFilteredTokens.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FaShieldAlt className="text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">High Score Tokens</p>
                <p className="text-white text-xl font-bold">
                  {sortedAndFilteredTokens.filter(t => t.safetyScore >= 80).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-cyan-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Active Chains</p>
                <p className="text-white text-xl font-bold">
                  {new Set(sortedAndFilteredTokens.map(t => t.chain)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Token;
