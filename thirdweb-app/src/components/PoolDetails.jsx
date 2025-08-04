import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { readContract, getContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import { client } from "../client";
import { 
    AiOutlineEyeInvisible, 
    AiOutlineArrowLeft,
    AiOutlineDollar,
    AiOutlineBarChart,
    AiOutlineTransaction,
    AiOutlineCopy,
    AiOutlineCheck
} from 'react-icons/ai';
import { 
    FaNetworkWired, 
    FaCopy, 
    FaCheck, 
    FaExchangeAlt,
    FaChartLine,
    FaShieldAlt,
    FaUsers,
    FaCoins
} from 'react-icons/fa';

const contractaddress = import.meta.env.VITE_ADDRESS;

let contract = null;
if (contractaddress) {
    contract = getContract({ client, chain: sepolia, address: contractaddress });
}

const formatNumber = (num) => {
    if (num === null || num === undefined) return '0.00';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toLocaleString();
};

const FinancialNumber = ({ value, isCurrency = false, icon = null }) => {
    if (value === null || value === undefined) return '--';
    const numericValue = parseFloat(value);
    const colorClass = numericValue >= 0 ? 'text-green-400' : 'text-red-400';
    const formatted = formatNumber(Math.abs(numericValue));
    const prefix = isCurrency ? '$' : '';
    return (
        <div className="flex items-center space-x-2">
            {icon && <span className="text-slate-400">{icon}</span>}
            <span className={`${colorClass} font-bold text-lg`}>{prefix}{formatted}</span>
        </div>
    );
};

const PoolDetails = () => {
    const navigate = useNavigate();
    const { address } = useActiveAccount() || {};
    const { blockchain, pairAddress } = useParams();
    const [poolData, setPoolData] = useState(null);
    const [poolMetadata, setPoolMetadata] = useState(null);
    const [error, setError] = useState(null);
    const [copiedToken0, setCopiedToken0] = useState(false);
    const [copiedToken1, setCopiedToken1] = useState(false);
    const [copiedPairAddress, setCopiedPairAddress] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPoolDataSequentially = async () => {
            if (!blockchain || !pairAddress) return;
            setLoading(true);
            setError(null);
            try {
                const poolDataRes = await axios.get(`${import.meta.env.VITE_API_URL}/pooldetails/${blockchain}/${pairAddress}`);
                setPoolData(poolDataRes.data);

                const poolMetadataRes = await axios.get(`${import.meta.env.VITE_API_URL}/poolmetadata/${blockchain}/${pairAddress}`);
                setPoolMetadata(poolMetadataRes.data);

            } catch (err) {
                setError("Failed to fetch pool details");
            } finally {
                setLoading(false);
            }
        };
        fetchPoolDataSequentially();
    }, [blockchain, pairAddress]);

    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            if (!address || !contract) return;
            try {
                const data = await readContract({ contract, method: "function isSubscribed(address _user) view returns (bool)", params: [address] });
                setIsSubscribed(data);
            } catch (error) { console.error("Error checking subscription status:", error); }
        };
        checkSubscriptionStatus();
    }, [address]);

    const handleCopy = (type, value) => {
        if (value) {
            navigator.clipboard.writeText(value);
            if (type === 'token0') {
                setCopiedToken0(true);
                setTimeout(() => setCopiedToken0(false), 2000);
            } else if (type === 'token1') {
                setCopiedToken1(true);
                setTimeout(() => setCopiedToken1(false), 2000);
            } else if (type === 'pair') {
                setCopiedPairAddress(true);
                setTimeout(() => setCopiedPairAddress(false), 2000);
            }
        }
    };
    
    const displayAddress = (addr) => {
        if (typeof addr === 'string' && addr.startsWith('0x')) {
            return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
        }
        return 'Address N/A';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading pool details...</p>
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
                poolData && poolMetadata && (
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 p-6">
                        <div className="max-w-7xl mx-auto pt-24 pb-32">
                            {/* Header Section */}
                            <div className="mb-8">
                                <button 
                                    onClick={() => navigate('/Pool')}
                                    className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-6"
                                >
                                    <AiOutlineArrowLeft />
                                    <span>Back to Pools</span>
                                </button>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                                        <FaExchangeAlt className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-white">
                                            {poolMetadata.protocol?.charAt(0).toUpperCase() + poolMetadata.protocol?.slice(1)} Protocol
                                        </h1>
                                        <p className="text-slate-400 text-sm">Liquidity pool analysis and metrics</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pool Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                            <FaNetworkWired className="text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-sm">Blockchain</p>
                                            <p className="text-white font-semibold">{poolData.blockchain}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                            <AiOutlineDollar className="text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-sm">Total TVL</p>
                                            <FinancialNumber value={poolData.total_tvl} isCurrency />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                            <AiOutlineBarChart className="text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-sm">24h Volume</p>
                                            <FinancialNumber value={poolData.volume_24hrs} isCurrency />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                            <AiOutlineTransaction className="text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-sm">24h Transactions</p>
                                            <FinancialNumber value={poolData.transactions_24hrs} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pair Address Card */}
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 mb-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">
                                            <FaShieldAlt className="text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-sm">Pair Address</p>
                                            <p className="text-white font-mono">{displayAddress(poolData.pair_address)}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleCopy('pair', poolData.pair_address)}
                                        className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors"
                                    >
                                        {copiedPairAddress ? <FaCheck className="text-green-400" /> : <FaCopy />}
                                    </button>
                                </div>
                            </div>

                            {/* Token Details Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {[0, 1].map((index) => {
                                    const tokenAddress = index === 0 ? poolMetadata.token0_address : poolMetadata.token1_address;
                                    const tokenSymbol = index === 0 ? poolMetadata.token0_symbol : poolMetadata.token1_symbol;
                                    const tokenPrice = index === 0 ? poolData.token0_price : poolData.token1_price;
                                    const tokenReserve = index === 0 ? poolData.token0_reserve : poolData.token1_reserve;
                                    const tokenTVL = index === 0 ? poolData.token0_tvl : poolData.token1_tvl;

                                    return (
                                        <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-12 h-12 bg-gradient-to-r ${index === 0 ? 'from-blue-500 to-cyan-500' : 'from-cyan-500 to-blue-500'} rounded-xl flex items-center justify-center`}>
                                                        <FaCoins className="text-white text-lg" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">{tokenSymbol}</h3>
                                                        <p className="text-slate-400 text-sm">Token {index + 1}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-slate-400 text-sm">Price</p>
                                                    <FinancialNumber value={tokenPrice} isCurrency />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="bg-slate-700/30 rounded-xl p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <FaChartLine className="text-blue-400" />
                                                            <span className="text-slate-400 text-sm">Address</span>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleCopy(index === 0 ? 'token0' : 'token1', tokenAddress)}
                                                            className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors"
                                                            disabled={!tokenAddress}
                                                        >
                                                            <span className="font-mono text-sm">{displayAddress(tokenAddress)}</span>
                                                            {((index === 0 && copiedToken0) || (index === 1 && copiedToken1)) ? 
                                                                <FaCheck className="text-green-400" /> : 
                                                                <FaCopy />
                                                            }
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-slate-700/30 rounded-xl p-4">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <FaUsers className="text-green-400" />
                                                            <span className="text-slate-400 text-sm">Reserve</span>
                                                        </div>
                                                        <FinancialNumber value={tokenReserve} isCurrency />
                                                    </div>
                                                    <div className="bg-slate-700/30 rounded-xl p-4">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <AiOutlineDollar className="text-cyan-400" />
                                                            <span className="text-slate-400 text-sm">TVL</span>
                                                        </div>
                                                        <FinancialNumber value={tokenTVL} isCurrency />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AiOutlineEyeInvisible className="text-4xl text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Subscription Required</h2>
                        <p className="text-slate-400 mb-8">Please subscribe to view detailed pool analysis and metrics.</p>
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

export default PoolDetails;
