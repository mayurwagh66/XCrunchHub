import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { readContract, getContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import { client } from "../client";
import { 
    AiOutlineEyeInvisible, 
    AiOutlineCopy, 
    AiOutlineCheck,
    AiOutlineArrowUp,
    AiOutlineArrowDown,
    AiOutlineUser,
    AiOutlineDollar,
    AiOutlineBarChart
} from 'react-icons/ai';
import { FaChartLine, FaNetworkWired, FaCopy, FaCheck, FaChartBar } from 'react-icons/fa';

const contractaddress = import.meta.env.VITE_ADDRESS;

let contract = null;
if (contractaddress) {
    contract = getContract({
        client: client,
        chain: sepolia,
        address: contractaddress,
    });
} else {
    console.error("VITE_ADDRESS is not defined in your .env file.");
}

const formatLargeNumber = (number) => {
    if (!number && number !== 0) return "N/A";
    const num = parseFloat(number);
    if (num >= 1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(2) + "T";
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(2) + "K";
    return number.toString();
};

const TokenDetails = () => {
    const navigate = useNavigate();
    const { address } = useActiveAccount() || {};
    const [isSubscribed, setIsSubscribed] = useState(false);
    const { blockchain, tokenId } = useParams();
    const [tokenDetails, setTokenDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const [displayScore, setDisplayScore] = useState(0);
    const [profitableTradeScore, setProfitableTradeScore] = useState(0);
    const [tradingPatternScore, setTradingPatternScore] = useState(0);
    const [lpStabilityScore, setLpStabilityScore] = useState(0);

    useEffect(() => {
        const fetchTokenDetails = async () => {
            if (!tokenId) return;

            setLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/Token/${blockchain}/${tokenId}`);
                const data = res.data;

                const validatedData = {
                    token_name: data.token_name || "Unknown",
                    token_symbol: data.token_symbol || "N/A",
                    trading_volume: data.trading_volume || 0,
                    current_price: data.current_price || 0,
                    market_cap: data.market_cap || 0,
                    circulating_supply: data.circulating_supply || 0,
                    fully_diluted_valuation: data.fully_diluted_valuation || 0,
                    total_supply: data.total_supply || 0,
                    token_score: data.token_score || 0,
                    token_address: data.token_address || "0x0",
                    blockchain: data.blockchain || "Unknown",
                    profitable_trade_score: data.profitable_trade_score || 0,
                    all_time_high: data.all_time_high || 0,
                    all_time_low: data.all_time_low || 0,
                    lp_stability_score: data.lp_stability_score || 0,
                    trading_pattern_score: data.trading_pattern_score || 0,
                    holders: data.holders || 0
                };
                setTokenDetails(validatedData);

            } catch (error) {
                setError("Error fetching token details");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTokenDetails();
    }, [blockchain, tokenId]);

    useEffect(() => {
        if (!tokenDetails) return;

        const animate = (setter, target, multiplier = 1) => {
            let current = 0;
            const targetValue = target * multiplier;
            const interval = setInterval(() => {
                if (current >= targetValue) {
                    clearInterval(interval);
                } else {
                    current += Math.ceil(targetValue / 50) || 1;
                    setter(Math.min(current, targetValue));
                }
            }, 30);
            return interval;
        };

        const intervals = [
            animate(setDisplayScore, tokenDetails.token_score),
            animate(setProfitableTradeScore, tokenDetails.profitable_trade_score, 20),
            animate(setTradingPatternScore, tokenDetails.trading_pattern_score, 20),
            animate(setLpStabilityScore, tokenDetails.lp_stability_score, 20)
        ];

        return () => intervals.forEach(clearInterval);
    }, [tokenDetails]);

    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            if (!address || !contract) return;
            try {
                const data = await readContract({
                    contract,
                    method: "function isSubscribed(address _user) view returns (bool)",
                    params: [address],
                });
                setIsSubscribed(data);
            } catch (error) {
                console.error("Error checking subscription status:", error);
            }
        };
        checkSubscriptionStatus();
    }, [address]);

    const handleCopy = () => {
        if (tokenDetails) {
            navigator.clipboard.writeText(tokenDetails.token_address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 90) return "#10B981";
        if (score >= 80) return "#F59E0B";
        if (score >= 70) return "#EF4444";
        return "#DC2626";
    };

    const getScoreGradient = (score) => {
        if (score >= 90) return "from-green-500 to-emerald-500";
        if (score >= 80) return "from-yellow-500 to-orange-500";
        if (score >= 70) return "from-orange-500 to-red-500";
        return "from-red-500 to-pink-500";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading token details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <p className="text-red-400 text-xl">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {isSubscribed ? (
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 p-6">
                    <div className="max-w-7xl mx-auto pt-24 pb-32">
                        {tokenDetails && (
                            <>
                                {/* Header Section */}
                                <div className="mb-8">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                            <FaChartLine className="text-white text-xl" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-white">{tokenDetails.token_name}</h1>
                                            <p className="text-slate-400 text-sm">Detailed token analysis and metrics</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Token Overview */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                                    {/* Token Info Card */}
                                    <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-white mb-2">{tokenDetails.token_name}</h2>
                                                <div className="flex items-center space-x-4 text-slate-400">
                                                    <span className="px-3 py-1 bg-slate-700/50 rounded-full text-sm">{tokenDetails.token_symbol}</span>
                                                    <span className="px-3 py-1 bg-slate-700/50 rounded-full text-sm">{tokenDetails.blockchain}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-green-400">${formatLargeNumber(tokenDetails.current_price)}</p>
                                                <p className="text-slate-400 text-sm">Current Price</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-6 mb-6">
                                            <div className="bg-slate-700/30 rounded-xl p-4">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <FaChartBar className="text-blue-400" />
                                                    <span className="text-slate-400 text-sm">24hr Volume</span>
                                                </div>
                                                <p className="text-xl font-bold text-green-400">${formatLargeNumber(tokenDetails.trading_volume)}</p>
                                            </div>
                                            <div className="bg-slate-700/30 rounded-xl p-4">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <AiOutlineUser className="text-blue-400" />
                                                    <span className="text-slate-400 text-sm">Total Holders</span>
                                                </div>
                                                <p className="text-xl font-bold text-white">{formatLargeNumber(tokenDetails.holders)}</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-700/30 rounded-xl p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <FaNetworkWired className="text-blue-400" />
                                                    <span className="text-slate-400 text-sm">Contract Address</span>
                                                </div>
                                                <button 
                                                    onClick={handleCopy}
                                                    className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors"
                                                >
                                                    <span className="font-mono text-sm">
                                                        {tokenDetails.token_address.slice(0, 6)}...{tokenDetails.token_address.slice(-4)}
                                                    </span>
                                                    {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DeFi Score Card */}
                                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 flex flex-col items-center justify-center">
                                        <div className="relative mb-6">
                                            <div className="w-32 h-32">
                                                <CircularProgressbar
                                                    value={displayScore}
                                                    maxValue={100}
                                                    text={`${Math.ceil(displayScore)}`}
                                                    styles={buildStyles({
                                                        pathColor: getScoreColor(displayScore),
                                                        textColor: getScoreColor(displayScore),
                                                        trailColor: "#374151",
                                                        textSize: "24px",
                                                        fontWeight: "bold",
                                                    })}
                                                />
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${getScoreGradient(displayScore)} opacity-20 blur-xl`}></div>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">DeFi Score</h3>
                                        <p className="text-slate-400 text-sm text-center">
                                            {displayScore >= 80 ? "Excellent" : displayScore >= 60 ? "Good" : "Needs Attention"}
                                        </p>
                                    </div>
                                </div>

                                {/* Analysis Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                    {/* Token Analysis */}
                                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                <AiOutlineBarChart className="text-blue-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Token Analysis</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-slate-700/30 rounded-xl p-4">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <AiOutlineArrowUp className="text-green-400" />
                                                    <span className="text-slate-400 text-sm">All Time High</span>
                                                </div>
                                                <p className="text-lg font-bold text-green-400">${formatLargeNumber(tokenDetails.all_time_high)}</p>
                                            </div>
                                            <div className="bg-slate-700/30 rounded-xl p-4">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <AiOutlineArrowDown className="text-red-400" />
                                                    <span className="text-slate-400 text-sm">All Time Low</span>
                                                </div>
                                                <p className="text-lg font-bold text-red-400">${formatLargeNumber(tokenDetails.all_time_low)}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            {/* Profitable Trade Score */}
                                            <div className="text-center">
                                                <div className="w-16 h-16 mx-auto mb-3">
                                                    <CircularProgressbar 
                                                        value={profitableTradeScore} 
                                                        text={`${Math.ceil(profitableTradeScore / 20)}`} 
                                                        styles={buildStyles({ 
                                                            pathColor: getScoreColor(profitableTradeScore), 
                                                            textColor: getScoreColor(profitableTradeScore), 
                                                            trailColor: "#374151", 
                                                            textSize: "16px" 
                                                        })} 
                                                    />
                                                </div>
                                                <p className="text-slate-400 text-xs">Profitable Trade</p>
                                            </div>
                                            {/* Trading Pattern Score */}
                                            <div className="text-center">
                                                <div className="w-16 h-16 mx-auto mb-3">
                                                    <CircularProgressbar 
                                                        value={tradingPatternScore} 
                                                        text={`${Math.ceil(tradingPatternScore / 20)}`} 
                                                        styles={buildStyles({ 
                                                            pathColor: getScoreColor(tradingPatternScore), 
                                                            textColor: getScoreColor(tradingPatternScore), 
                                                            trailColor: "#374151", 
                                                            textSize: "16px" 
                                                        })} 
                                                    />
                                                </div>
                                                <p className="text-slate-400 text-xs">Trading Pattern</p>
                                            </div>
                                            {/* LP Stability Score */}
                                            <div className="text-center">
                                                <div className="w-16 h-16 mx-auto mb-3">
                                                    <CircularProgressbar 
                                                        value={lpStabilityScore} 
                                                        text={`${Math.ceil(lpStabilityScore / 20)}`} 
                                                        styles={buildStyles({ 
                                                            pathColor: getScoreColor(lpStabilityScore), 
                                                            textColor: getScoreColor(lpStabilityScore), 
                                                            trailColor: "#374151", 
                                                            textSize: "16px" 
                                                        })} 
                                                    />
                                                </div>
                                                <p className="text-slate-400 text-xs">LP Stability</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Token Metrics */}
                                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                                <AiOutlineDollar className="text-cyan-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Token Metrics</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-700/30 rounded-xl p-4">
                                                <p className="text-slate-400 text-sm mb-1">Price</p>
                                                <p className="text-lg font-bold text-green-400">${formatLargeNumber(tokenDetails.current_price)}</p>
                                            </div>
                                            <div className="bg-slate-700/30 rounded-xl p-4">
                                                <p className="text-slate-400 text-sm mb-1">Trading Volume</p>
                                                <p className="text-lg font-bold text-green-400">${formatLargeNumber(tokenDetails.trading_volume)}</p>
                                            </div>
                                            <div className="bg-slate-700/30 rounded-xl p-4">
                                                <p className="text-slate-400 text-sm mb-1">Market Cap</p>
                                                <p className="text-lg font-bold text-green-400">${formatLargeNumber(tokenDetails.market_cap)}</p>
                                            </div>
                                            <div className="bg-slate-700/30 rounded-xl p-4">
                                                <p className="text-slate-400 text-sm mb-1">Circulating Supply</p>
                                                <p className="text-lg font-bold text-white">{formatLargeNumber(tokenDetails.circulating_supply)}</p>
                                            </div>
                                            <div className="bg-slate-700/30 rounded-xl p-4">
                                                <p className="text-slate-400 text-sm mb-1">FDV</p>
                                                <p className="text-lg font-bold text-green-400">${formatLargeNumber(tokenDetails.fully_diluted_valuation)}</p>
                                            </div>
                                            <div className="bg-slate-700/30 rounded-xl p-4">
                                                <p className="text-slate-400 text-sm mb-1">Total Supply</p>
                                                <p className="text-lg font-bold text-white">{formatLargeNumber(tokenDetails.total_supply)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AiOutlineEyeInvisible className="text-4xl text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Subscription Required</h2>
                        <p className="text-slate-400 mb-8">Please subscribe to view detailed token analysis and metrics.</p>
                        <button
                            onClick={() => navigate('/subscription')}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
                        >
                            <AiOutlineEyeInvisible size={20} />
                            <span>Go to Subscription</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default TokenDetails;
