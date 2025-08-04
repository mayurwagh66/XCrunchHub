import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import ForceGraph2D from 'react-force-graph-2d';
import { forceLink, forceManyBody, forceCenter } from 'd3-force-3d';
import { 
    AiOutlineSearch, 
    AiOutlineWarning, 
    AiOutlineDownload,
    AiOutlineLoading3Quarters,
    AiOutlineBulb,
    AiOutlineBarChart,
    AiOutlineAlert,
    AiOutlineCheckCircle,
    AiOutlineCloseCircle,
    AiOutlineExclamationCircle
} from 'react-icons/ai';
import { 
    FaShieldAlt, 
    FaSearch, 
    FaChartLine, 
    FaNetworkWired, 
    FaCopy, 
    FaCheck,
    FaCoins,
    FaUsers,
    FaChartBar,
    FaFileAlt,
    FaExclamationTriangle,
    FaCheckDouble,
    FaTimes,
    FaInfoCircle,
    FaDollarSign
} from 'react-icons/fa';

// Modern NFT Analytics Dashboard Component - Updated 2024
const NftDashboards = () => {
  const [nftAddress, setNftAddress] = useState('');
  const [nftSecurityData, setNftSecurityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const graphRef = useRef();

  // Handle node click event for fraud map
  const handleNodeClick = (node) => {
    console.log('Node clicked:', node);
  };

  // Handle link click event for fraud map
  const handleLinkClick = (link) => {
    console.log('Link clicked:', link);
  };

  const handleCopyAddress = () => {
    if (nftAddress) {
      navigator.clipboard.writeText(nftAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  // Custom node rendering for fraud map
  const nodeCanvasObject = (node, ctx, globalScale) => {
    const label = node.id;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = node.color || 'blue';
    ctx.fillText(label, node.x, node.y);
  };

  // Custom link rendering for fraud map
  const linkCanvasObject = (link, ctx, globalScale) => {
    const MAX_FONT_SIZE = 12;
    const text = link.label;

    ctx.strokeStyle = link.color || '#ccc';
    ctx.lineWidth = link.value || 1;
    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    ctx.stroke();

    if (text && text.length > 0) {
      const fontSize = Math.min(MAX_FONT_SIZE, (link.value * 0.5));
      ctx.font = `${fontSize}px Sans-Serif`;
      const textWidth = ctx.measureText(text).width;
      const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(
        link.source.x - bckgDimensions[0] / 2,
        link.source.y - bckgDimensions[1] / 2,
        bckgDimensions[0],
        bckgDimensions[1]
      );
      ctx.fillStyle = 'black';
      ctx.fillText(text, link.source.x, link.source.y);
    }
  };

  // Mock data for Whale Tracker
  const whaleData = [
    {
      address: '0xAbC123...DeF456',
      volumeUSD: '5,200,000',
      nftsHeld: '1,500',
      notableCollections: 'CryptoPunks, BAYC, Azuki',
      recentActivity: 'Bought 5 BAYC in last 24h',
      riskLevel: 'low',
      avatar: '🐋'
    },
    {
      address: '0x123XyZ...789AbC',
      volumeUSD: '3,800,000',
      nftsHeld: '800',
      notableCollections: 'Moonbirds, Doodles',
      recentActivity: 'Sold 10 Moonbirds, acquired 2 Doodles',
      riskLevel: 'medium',
      avatar: '🐋'
    },
    {
      address: '0xFeD987...A5B6C7D',
      volumeUSD: '2,100,000',
      nftsHeld: '600',
      notableCollections: 'CloneX, Cool Cats',
      recentActivity: 'No significant activity in last 48h',
      riskLevel: 'low',
      avatar: '🐋'
    },
  ];

  // Known scam/fraudulent addresses for Wall of Shame
  const scamAddresses = [
    { address: '0xd882cfc20f52f2599d84b8e8d58c7fb62cfe344b', reason: 'Known for illicit activities', severity: 'high' },
    { address: '0x6e1db9836521977ee93651027768f7e0d5722a33', reason: 'Associated with phishing scams', severity: 'high' },
    { address: '0xf4a2eff88a408ff4c4550148151c33c93442619e', reason: 'Involved in rug pulls', severity: 'medium' },
    { address: '0xab5c66752a9e8167967685f1450532fb96d5d24f', reason: 'Linked to NFT forgery rings', severity: 'high' },
  ];

  // GoPlus API credentials
  const GO_PLUS_API_KEY = import.meta.env.VITE_GOPLUS_API_KEY;
  const GO_PLUS_SECRET_KEY = import.meta.env.VITE_GOPLUS_SECRET_KEY;
  const GO_PLUS_BASE_URL = '/api-goplus';

  // Mock data for Fraud Map
  const fraudGraphData = {
    nodes: [
      { id: 'A', name: 'Node A', val: 10, color: 'red' },
      { id: 'B', name: 'Node B', val: 8, color: 'blue' },
      { id: 'C', name: 'Node C', val: 5, color: 'green' },
    ],
    links: [
      { source: 'A', target: 'B', value: 5, label: 'Link AB' },
      { source: 'B', target: 'C', value: 3, label: 'Link BC' },
    ],
  };

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 100);
    }
  }, [fraudGraphData]);

  const handleGoPlusNftSecurity = async () => {
    setLoading(true);
    setNftSecurityData(null);
    try {
      const trimmedNftAddress = nftAddress.trim();
      const chainId = 1;
      const goPlusRequestUrl = `${GO_PLUS_BASE_URL}/nft_security/1?contract_addresses=${trimmedNftAddress}`;
      console.log("GoPlus NFT Security Request URL:", goPlusRequestUrl);
      const goPlusResponse = await axios.get(goPlusRequestUrl, {
        params: {
          api_key: GO_PLUS_API_KEY,
          api_secret: GO_PLUS_SECRET_KEY,
        },
        headers: {}
      });
      console.log("GoPlus API Response:", goPlusResponse.data);
      setNftSecurityData(goPlusResponse.data[`${trimmedNftAddress.toLowerCase()}`]);

    } catch (error) {
      console.error("Error fetching GoPlus NFT security data:", error);
      setNftSecurityData({ error: "Failed to fetch NFT security data." });
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high': return <AiOutlineCloseCircle className="text-red-400" />;
      case 'medium': return <AiOutlineExclamationCircle className="text-yellow-400" />;
      case 'low': return <AiOutlineCheckCircle className="text-green-400" />;
      default: return <AiOutlineAlert className="text-gray-400" />;
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full px-6 py-3 mb-6">
              <AiOutlineBarChart className="text-indigo-400 text-xl" />
              <span className="text-indigo-400 font-medium">Advanced Analytics</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              NFT Analytics
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> Dashboards</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Comprehensive dashboards and visual interfaces for in-depth NFT analysis, security auditing, and market intelligence
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
                {/* Quick Stats */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <AiOutlineBarChart className="text-indigo-400" />
                    <span>Analytics Stats</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-indigo-400 mb-1">2.3M+</div>
                      <p className="text-slate-400 text-sm">NFTs Analyzed</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-1">15K+</div>
                      <p className="text-slate-400 text-sm">Whales Tracked</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">99.8%</div>
                      <p className="text-slate-400 text-sm">Accuracy Rate</p>
                    </div>
                  </div>
                </div>

                {/* Security Status */}
                {nftSecurityData && !nftSecurityData.error && (
                  <div className="mb-8">
                                       <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                     <FaShieldAlt className="text-indigo-400" />
                     <span>Security Status</span>
                   </h3>
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">
                        {nftSecurityData.is_malicious ? 
                          <AiOutlineCloseCircle className="text-red-400" /> : 
                          <AiOutlineCheckCircle className="text-green-400" />
                        }
                      </div>
                      <div className={`text-xl font-bold mb-1 ${nftSecurityData.is_malicious ? 'text-red-400' : 'text-green-400'}`}>
                        {nftSecurityData.is_malicious ? 'UNSAFE' : 'SAFE'}
                      </div>
                      <p className="text-slate-400 text-sm">
                        {nftSecurityData.is_malicious ? 'Security risks detected' : 'No security issues found'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Dashboards */}
          <div className="xl:col-span-3">
            <div className="space-y-8">
              {/* GoPlus NFT Security Analysis */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <FaShieldAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">GoPlus NFT Security Analysis</h2>
                    <p className="text-slate-400">Enter an NFT contract address to get a comprehensive security audit report</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-300 mb-2">NFT Contract Address</label>
                      <div className="relative">
            <input
              type="text"
                          className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                          placeholder="0xee24b9872022c7770CCC828d856224416CBa005f"
              value={nftAddress}
              onChange={(e) => setNftAddress(e.target.value)}
            />
                        {nftAddress && (
                          <button
                            onClick={handleCopyAddress}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-green-400 transition-colors"
                          >
                            {copiedAddress ? <FaCheck className="text-green-400" /> : <FaCopy />}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="lg:w-auto">
                      <label className="block text-sm font-medium text-slate-300 mb-2">&nbsp;</label>
                      <button
                        onClick={handleGoPlusNftSecurity}
                        disabled={loading || !nftAddress.trim()}
                        className="w-full lg:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:cursor-not-allowed transform hover:scale-105"
                      >
                        {loading ? (
                          <>
                            <AiOutlineLoading3Quarters className="animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <FaSearch />
                            <span>Analyze Security</span>
                          </>
                        )}
            </button>
                    </div>
          </div>

          {nftSecurityData && !nftSecurityData.error && (
                    <div className="bg-slate-700/30 rounded-xl p-6">
                                             <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                         <FaShieldAlt className="text-green-400" />
                         <span>Security Report</span>
                       </h3>
                      
                      {/* Security Status Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-slate-600/30 rounded-xl p-4 text-center">
                          <div className="text-2xl mb-2">
                            {nftSecurityData.verified ? <FaCheckDouble className="text-green-400" /> : <FaTimes className="text-red-400" />}
                          </div>
                          <p className="text-slate-400 text-sm mb-1">Verified</p>
                          <p className="text-white font-semibold">{nftSecurityData.verified ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="bg-slate-600/30 rounded-xl p-4 text-center">
                          <div className="text-2xl mb-2">
                            {nftSecurityData.is_open_source ? <FaCheckDouble className="text-green-400" /> : <FaTimes className="text-red-400" />}
                          </div>
                          <p className="text-slate-400 text-sm mb-1">Open Source</p>
                          <p className="text-white font-semibold">{nftSecurityData.is_open_source ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="bg-slate-600/30 rounded-xl p-4 text-center">
                          <div className="text-2xl mb-2">
                            {nftSecurityData.is_malicious ? <FaExclamationTriangle className="text-red-400" /> : <FaCheckDouble className="text-green-400" />}
                          </div>
                          <p className="text-slate-400 text-sm mb-1">Malicious</p>
                          <p className="text-white font-semibold">{nftSecurityData.is_malicious ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="bg-slate-600/30 rounded-xl p-4 text-center">
                          <div className="text-2xl mb-2">
                            {nftSecurityData.is_proxy ? <FaInfoCircle className="text-yellow-400" /> : <FaCheckDouble className="text-green-400" />}
                          </div>
                          <p className="text-slate-400 text-sm mb-1">Proxy Contract</p>
                          <p className="text-white font-semibold">{nftSecurityData.is_proxy ? 'Yes' : 'No'}</p>
                        </div>
                      </div>

                      {/* NFT Details */}
                      <div className="bg-slate-600/30 rounded-xl p-4">
                        <h4 className="text-md font-semibold text-white mb-3 flex items-center space-x-2">
                          <FaFileAlt className="text-indigo-400" />
                          <span>NFT Details</span>
                        </h4>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <p className="text-slate-400 text-sm">Symbol</p>
                            <p className="text-white font-semibold">{nftSecurityData.symbol || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Name</p>
                            <p className="text-white font-semibold">{nftSecurityData.name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">ERC Standard</p>
                            <p className="text-white font-semibold">{nftSecurityData.standard_type || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Total Supply</p>
                            <p className="text-white font-semibold">{nftSecurityData.total_supply || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">24h Volume</p>
                            <p className="text-white font-semibold">{nftSecurityData.volume_24h || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Avg Price (24h)</p>
                            <p className="text-white font-semibold">{nftSecurityData.avg_price_24h || 'N/A'}</p>
                          </div>
                        </div>
              </div>
            </div>
          )}
                  
          {nftSecurityData?.error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                      <p className="text-red-400">Error: {nftSecurityData.error}</p>
                      {nftSecurityData.message && <p className="text-red-300 text-sm mt-1">API Message: {nftSecurityData.message}</p>}
            </div>
          )}
        </div>
              </div>

              {/* Whale Tracker Dashboard */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                <div className="flex items-center space-x-3 mb-6">
                                     <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                     <FaUsers className="text-white text-xl" />
                   </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Whale Tracker Dashboard</h2>
                    <p className="text-slate-400">Track significant NFT holders and their movements to identify market trends</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
            <thead>
                      <tr className="border-b border-slate-600/50">
                        <th className="text-left py-4 px-4 text-slate-300 font-semibold">Whale Address</th>
                        <th className="text-left py-4 px-4 text-slate-300 font-semibold">Total Volume (USD)</th>
                        <th className="text-left py-4 px-4 text-slate-300 font-semibold">NFTs Held</th>
                        <th className="text-left py-4 px-4 text-slate-300 font-semibold">Notable Collections</th>
                        <th className="text-left py-4 px-4 text-slate-300 font-semibold">Recent Activity</th>
                        <th className="text-left py-4 px-4 text-slate-300 font-semibold">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {whaleData.map((whale, index) => (
                        <tr key={index} className="border-b border-slate-600/30 hover:bg-slate-700/30 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{whale.avatar}</span>
                              <span className="text-white font-mono">{whale.address}</span>
                            </div>
                          </td>
                                                     <td className="py-4 px-4">
                             <div className="flex items-center space-x-2">
                               <FaDollarSign className="text-green-400" />
                               <span className="text-white font-semibold">${whale.volumeUSD}</span>
                             </div>
                           </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <FaCoins className="text-blue-400" />
                              <span className="text-white">{whale.nftsHeld}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-slate-300 text-sm">{whale.notableCollections}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-slate-300 text-sm">{whale.recentActivity}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              {getRiskIcon(whale.riskLevel)}
                              <span className={`text-sm font-semibold ${getRiskColor(whale.riskLevel)}`}>
                                {whale.riskLevel.toUpperCase()}
                              </span>
                            </div>
                          </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
              </div>

              {/* Wall of Shame */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FaExclamationTriangle className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Fake NFT Wall of Shame</h2>
                    <p className="text-slate-400">Community-driven leaderboard highlighting fraudulent NFT projects and activities</p>
                  </div>
                </div>

                <div className="space-y-4">
            {scamAddresses.map((scam, index) => (
                    <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getSeverityColor(scam.severity)}`}></div>
                          <div>
                            <p className="text-red-400 font-mono text-sm">{scam.address}</p>
                            <p className="text-slate-300 text-sm">{scam.reason}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getSeverityColor(scam.severity)} text-white`}>
                            {scam.severity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Visual NFT Fraud Maps */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FaNetworkWired className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Interactive Visual NFT Fraud Maps</h2>
                    <p className="text-slate-400">Network visualization of fraud patterns and connections</p>
                  </div>
        </div>

                <div className="bg-slate-700/30 rounded-xl p-6 h-96">
          {fraudGraphData && (
            <ForceGraph2D
              graphData={fraudGraphData}
              nodeLabel="id"
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={0.5}
              onNodeClick={handleNodeClick}
              onLinkClick={handleLinkClick}
              nodeCanvasObject={nodeCanvasObject}
              linkCanvasObject={linkCanvasObject}
              ref={graphRef}
                      width={800}
                      height={400}
                      backgroundColor="transparent"
                      enableZoomPan={true}
              onNodeDragEnd={node => {
                node.fx = node.x;
                node.fy = node.y;
              }}
                      nodeId="id"
                      linkSource="source"
                      linkTarget="target"
              nodeCanvasObjectMode={() => 'after'}
              linkCanvasObjectMode={() => 'after'}
                      warmupTicks={200}
                      cooldownTicks={1000}
              onEngineStop={() => {
                if (graphRef.current) {
                          graphRef.current.zoomToFit(400, 100);
                }
              }}
            />
          )}
        </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm">Powered by advanced analytics and AI models. Data is for informational purposes only.</p>
        </div>
      </div>
    </div>
  );
};

export default NftDashboards;