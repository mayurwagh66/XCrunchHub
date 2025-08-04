import React, { useState, useContext } from "react";
import { FaSortUp, FaSortDown, FaSearch, FaFilter, FaChartLine, FaShieldAlt, FaNetworkWired, FaExchangeAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../App";

const Pool = () => {
  const { pools, loading } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChain, setSelectedChain] = useState("All Chains");
  const [sortConfig, setSortConfig] = useState({ key: "rank", direction: "asc" });
  const navigate = useNavigate();

  const headers = [
    { text: "#", key: "rank", icon: null },
    { text: "Pool", key: "pool", icon: <FaExchangeAlt /> },
    { text: "Chain", key: "blockchain", icon: <FaNetworkWired /> },
    { text: "Protocol", key: "protocol", icon: <FaShieldAlt /> },
    { text: "Token 0", key: "token0_symbol", icon: <FaChartLine /> },
    { text: "Token 1", key: "token1_symbol", icon: <FaChartLine /> }
  ];

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

  const handlePoolClick = (pool) => {
    navigate(`/pooldetails/${pool.blockchain.toLowerCase()}/${pool.pair_address}`);
  };

  const filteredPools = pools.filter((pool) =>
    (pool.pool.toLowerCase().includes(searchTerm.toLowerCase()) ||
     pool.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
     pool.token0_symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
     pool.token1_symbol.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedChain === "All Chains" || pool.blockchain.toLowerCase() === selectedChain.toLowerCase())
  );
  
  const sortedAndFilteredPools = [...filteredPools].sort((a, b) => {
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
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <FaNetworkWired className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">DeFi Pool Analytics</h1>
              <p className="text-slate-400 text-sm">Explore and analyze liquidity pools across multiple chains</p>
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
                placeholder="Search pools..." 
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
                ) : sortedAndFilteredPools.length > 0 ? (
                  sortedAndFilteredPools.map((pool, index) => (
                    <tr 
                      key={pool.id} 
                      onClick={() => handlePoolClick(pool)} 
                      className="cursor-pointer transition-all duration-300 hover:bg-slate-700/30 group border-b border-slate-700/20"
                    >
                      <td className="py-6 px-6 text-sm text-slate-400 border-r border-slate-700/30">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono">#{pool.rank}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 border-r border-slate-700/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <FaExchangeAlt className="text-white text-xs" />
                          </div>
                          <span className="text-white font-medium group-hover:text-blue-300 transition-colors">{pool.pool}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-sm text-slate-400 border-r border-slate-700/30">
                        <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs">{pool.blockchain}</span>
                      </td>
                      <td className="py-6 px-6 text-sm text-slate-300 border-r border-slate-700/30">
                        <div className="flex items-center space-x-2">
                          <FaShieldAlt className="text-blue-400 text-xs" />
                          <span>{pool.protocol}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-sm text-white border-r border-slate-700/30">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <span className="text-blue-400 text-xs font-bold">{pool.token0_symbol.charAt(0)}</span>
                          </div>
                          <span className="font-medium">{pool.token0_symbol}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-sm text-white">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                            <span className="text-cyan-400 text-xs font-bold">{pool.token1_symbol.charAt(0)}</span>
                          </div>
                          <span className="font-medium">{pool.token1_symbol}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center space-y-3">
                        <FaSearch className="text-4xl text-slate-600" />
                        <p className="text-lg">No pools found</p>
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FaNetworkWired className="text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Pools</p>
                <p className="text-white text-xl font-bold">{sortedAndFilteredPools.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <FaShieldAlt className="text-cyan-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Protocols</p>
                <p className="text-white text-xl font-bold">
                  {new Set(sortedAndFilteredPools.map(p => p.protocol)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FaExchangeAlt className="text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Active Chains</p>
                <p className="text-white text-xl font-bold">
                  {new Set(sortedAndFilteredPools.map(p => p.blockchain)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Unique Tokens</p>
                <p className="text-white text-xl font-bold">
                  {new Set([
                    ...sortedAndFilteredPools.map(p => p.token0_symbol),
                    ...sortedAndFilteredPools.map(p => p.token1_symbol)
                  ]).size}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
    </div>
  );
};

export default Pool;
