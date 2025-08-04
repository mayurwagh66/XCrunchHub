import React, { useState, useEffect, useContext } from 'react';
import Chart from 'chart.js/auto';
import { DataContext } from '../App';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import axios from "axios";
import { 
    AiOutlineRobot, 
    AiOutlineWallet, 
    AiOutlinePicture, 
    AiOutlineLoading3Quarters,
    AiOutlineBarChart,
    AiOutlineBulb,
    AiOutlineCopy,
    AiOutlineCheck,
    AiOutlineArrowRight,
    AiOutlineStar,
    AiOutlineSafety
} from 'react-icons/ai';
import { 
    FaBrain, 
    FaChartLine, 
    FaNetworkWired, 
    FaCopy, 
    FaCheck,
    FaRocket,
    FaShieldAlt,
    FaCoins,
    FaUsers,
    FaChartBar,
    FaLightbulb
} from 'react-icons/fa';

const AiAnalyzer = () => {
    const [currentTab, setCurrentTab] = useState('wallet');
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [useGroq, setUseGroq] = useState(false);
    const [copiedAddress, setCopiedAddress] = useState(false);

    const { account } = useContext(DataContext);

    // Access your API keys
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

    // Initialize the Generative AI models
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const groqClient = new Groq({
        apiKey: GROQ_API_KEY,
        dangerouslyAllowBrowser: true,
    });
    const groqModelName = "llama3-8b-8192";

    const BITSCRUNCH_API_KEY = import.meta.env.VITE_UNLEASHNFTS_API_KEY;
    const BITSCRUNCH_BASE_URL = "https://api.bitscrunch.com";

    // Etherscan API configuration
    const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;
    const ETHERSCAN_BASE_URL = "https://api-sepolia.etherscan.io/api";

    // Create an Axios instance for bitsCrunch API
    const bitsCrunchApi = axios.create({
        baseURL: BITSCRUNCH_BASE_URL,
        headers: {
            'X-API-KEY': BITSCRUNCH_API_KEY,
            'Content-Type': 'application/json',
        },
    });

    // Create an Axios instance for Etherscan API
    const etherscanApi = axios.create({
        baseURL: ETHERSCAN_BASE_URL,
    });

    // Utility function to convert Wei to Ether
    const weiToEther = (wei) => {
        return (parseFloat(wei) / 1e18).toFixed(4);
    };

    useEffect(() => {
        switchTab('wallet');
    }, []);

    useEffect(() => {
        if (account && currentTab === 'wallet') {
            setInputValue(account.address);
        }
    }, [account, currentTab]);

    useEffect(() => {
        let riskChart = null;
        if (reportData && reportData.chartData) {
            const ctx = document.getElementById('riskChart').getContext('2d');
            if (riskChart) {
                riskChart.destroy();
            }
            riskChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: reportData.chartData.labels,
                    datasets: [{
                        label: 'Number of Transactions',
                        data: reportData.chartData.data,
                        backgroundColor: reportData.chartData.colors,
                        borderColor: reportData.chartData.borderColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Count'
                            }
                        }
                    }
                }
            });
        }
    }, [reportData]);

    const switchTab = (newTab) => {
        setCurrentTab(newTab);
        setInputValue('');
        setReportData(null);
    };

    const handleCopyAddress = () => {
        if (inputValue) {
            navigator.clipboard.writeText(inputValue);
            setCopiedAddress(true);
            setTimeout(() => setCopiedAddress(false), 2000);
        }
    };

    const handleAnalysis = async () => {
        if (!inputValue.trim()) {
            alert('Please enter a valid input');
            return;
        }

        setIsLoading(true);
        setReportData(null);

        try {
            let analysisResult = null;

            if (currentTab === 'wallet') {
                analysisResult = await analyzeWallet(inputValue);
            } else if (currentTab === 'collection') {
                analysisResult = await analyzeCollection(inputValue);
            } else if (currentTab === 'risk') {
                analysisResult = await analyzeRisk(inputValue);
            }

            setReportData(analysisResult);
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Analysis failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const analyzeWallet = async (address) => {
        // Mock wallet analysis - replace with real implementation
        return {
            title: `Wallet Analysis: ${address.slice(0, 6)}...${address.slice(-4)}`,
            metrics: [
                { label: 'Total Balance', value: '2.45 ETH', icon: <FaCoins />, color: 'text-green-400' },
                { label: 'Total Transactions', value: '156', icon: <FaChartBar />, color: 'text-blue-400' },
                { label: 'NFT Holdings', value: '12', icon: <AiOutlinePicture />, color: 'text-purple-400' },
                { label: 'Risk Score', value: 'Low', icon: <FaShieldAlt />, color: 'text-green-400' }
            ],
            chartData: {
                labels: ['DeFi', 'NFTs', 'Gaming', 'Other'],
                data: [45, 30, 15, 10],
                colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
                borderColors: ['#2563EB', '#059669', '#D97706', '#DC2626']
            },
            summaryTitle: 'AI-Generated Wallet Summary',
            summary: 'This wallet shows a balanced portfolio with significant DeFi activity and moderate NFT holdings. The transaction patterns indicate an experienced user with low risk profile.',
            insights: [
                'High DeFi engagement suggests experienced user',
                'Moderate NFT holdings indicate diversification',
                'Low risk score reflects legitimate activity patterns',
                'Consistent transaction history over 2+ years'
            ]
        };
    };

    const analyzeCollection = async (collection) => {
        // Mock collection analysis - replace with real implementation
        return {
            title: `Collection Analysis: ${collection}`,
            metrics: [
                { label: 'Floor Price', value: '2.5 ETH', icon: <FaChartLine />, color: 'text-green-400' },
                { label: 'Total Volume', value: '1,234 ETH', icon: <FaChartBar />, color: 'text-blue-400' },
                { label: 'Owners', value: '8,456', icon: <FaUsers />, color: 'text-purple-400' },
                { label: 'Market Cap', value: '12,345 ETH', icon: <FaCoins />, color: 'text-cyan-400' }
            ],
            chartData: {
                labels: ['0-1 ETH', '1-5 ETH', '5-10 ETH', '10+ ETH'],
                data: [60, 25, 10, 5],
                colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
                borderColors: ['#2563EB', '#059669', '#D97706', '#DC2626']
            },
            summaryTitle: 'AI-Generated Collection Summary',
            summary: 'This NFT collection shows strong community engagement with a healthy floor price. The distribution indicates good liquidity and market stability.',
            insights: [
                'Strong community with 8,456 unique owners',
                'Healthy floor price indicates demand',
                'Good liquidity with active trading volume',
                'Balanced price distribution suggests stability'
            ]
        };
    };

    const analyzeRisk = async (address) => {
        // Mock risk analysis - replace with real implementation
        return {
            title: `Risk Analysis: ${address.slice(0, 6)}...${address.slice(-4)}`,
            metrics: [
                { label: 'Risk Score', value: 'Low', icon: <AiOutlineSafety />, color: 'text-green-400' },
                { label: 'Suspicious TXs', value: '0', icon: <FaShieldAlt />, color: 'text-green-400' },
                { label: 'Contract Interactions', value: '45', icon: <FaNetworkWired />, color: 'text-blue-400' },
                { label: 'Age', value: '2.5 years', icon: <AiOutlineStar />, color: 'text-yellow-400' }
            ],
            chartData: {
                labels: ['Safe', 'Low Risk', 'Medium Risk', 'High Risk'],
                data: [70, 20, 8, 2],
                colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
                borderColors: ['#059669', '#2563EB', '#D97706', '#DC2626']
            },
            summaryTitle: 'AI-Generated Risk Assessment',
            summary: 'This wallet demonstrates low risk characteristics with no suspicious transactions detected. The interaction patterns are consistent with legitimate DeFi usage.',
            insights: [
                'No suspicious transactions detected',
                'Established wallet with 2.5+ year history',
                'Legitimate DeFi contract interactions',
                'Consistent transaction patterns'
            ]
        };
    };

    const getTabIcon = (tab) => {
        switch (tab) {
            case 'wallet': return <AiOutlineWallet />;
            case 'collection': return <AiOutlinePicture />;
            case 'risk': return <FaShieldAlt />;
            default: return <AiOutlineRobot />;
        }
    };

    const getTabTitle = (tab) => {
        switch (tab) {
            case 'wallet': return 'Wallet Analysis';
            case 'collection': return 'NFT Collection';
            case 'risk': return 'Risk Forensics';
            default: return 'AI Analysis';
        }
    };

    const getTabDescription = (tab) => {
        switch (tab) {
            case 'wallet': return 'Analyze wallet activity, holdings, and patterns';
            case 'collection': return 'Evaluate NFT collection performance and metrics';
            case 'risk': return 'Assess transaction risk and security analysis';
            default: return 'AI-powered blockchain analysis';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
                <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-16">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full px-6 py-3 mb-6">
                            <AiOutlineRobot className="text-purple-400 text-xl" />
                            <span className="text-purple-400 font-medium">AI-Powered Analytics</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-6">
                            Advanced Blockchain
                            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Intelligence</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Get AI-powered insights, risk assessments, and comprehensive analysis for any wallet or NFT collection
                        </p>
                    </div>
                    </div>
                </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 pb-32">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Left Sidebar - Controls */}
                    <div className="xl:col-span-1">
                        <div className="sticky top-8">
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                                {/* Analysis Type Selection */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                        <FaLightbulb className="text-purple-400" />
                                        <span>Analysis Type</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {['wallet', 'collection', 'risk'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => switchTab(tab)}
                                                className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                                                    currentTab === tab
                                                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                                                        : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-102'
                                                }`}
                                            >
                                                <span className="text-lg">{getTabIcon(tab)}</span>
                                                <div className="text-left">
                                                    <p className="font-medium">{getTabTitle(tab)}</p>
                                                    <p className="text-xs opacity-75">{getTabDescription(tab)}</p>
                                                </div>
                                            </button>
                                        ))}
                    </div>
                    </div>

                                {/* Input Section */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-300 mb-3">
                                        {currentTab === 'wallet' ? 'Wallet Address' :
                                         currentTab === 'collection' ? 'Collection Name/Address' :
                                         'Address for Risk Analysis'}
                                    </label>
                                    <div className="relative">
                        <input 
                            type="text" 
                                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                            placeholder={currentTab === 'wallet' ? '0x...' :
                                                       currentTab === 'collection' ? 'e.g., bored-ape-yacht-club' :
                                                       '0x...'}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                                        {inputValue && (
                    <button 
                                                onClick={handleCopyAddress}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                                            >
                                                {copiedAddress ? <FaCheck className="text-green-400" /> : <FaCopy />}
                    </button>
                                        )}
                                    </div>
                </div>

                                {/* AI Model Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-300 mb-3">AI Model</label>
                    <select
                                        className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                        value={useGroq ? "groq" : "gemini"}
                        onChange={(e) => setUseGroq(e.target.value === "groq")}
                    >
                                        <option value="gemini">Gemini (Google AI)</option>
                        <option value="groq">Groq (Fast Inference)</option>
                    </select>
                </div>

                                {/* Analyze Button */}
                                <button
                                    onClick={handleAnalysis}
                                    disabled={isLoading || !inputValue.trim()}
                                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:cursor-not-allowed transform hover:scale-105"
                                >
                                    {isLoading ? (
                                        <>
                                            <AiOutlineLoading3Quarters className="animate-spin" />
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaBrain />
                                            <span>Analyze</span>
                                            <AiOutlineArrowRight />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Results */}
                    <div className="xl:col-span-3">
                        {isLoading ? (
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50 text-center">
                                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-purple-400 mx-auto mb-6"></div>
                                <h3 className="text-2xl font-semibold text-white mb-3">AI Analysis in Progress</h3>
                                <p className="text-slate-400 text-lg">Fetching data and generating insights...</p>
                                <div className="mt-6 flex justify-center space-x-2">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                            </div>
                        ) : reportData ? (
                            <div className="space-y-8">
                                {/* Report Header */}
                                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2">{reportData.title}</h2>
                                            <p className="text-slate-400">AI-powered analysis completed</p>
                                        </div>
                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                            <AiOutlineRobot className="text-white text-2xl" />
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics Grid */}
                                {reportData.metrics && (
                                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                                            <AiOutlineBarChart className="text-purple-400" />
                                            <span>Key Metrics</span>
                                        </h3>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {reportData.metrics.map((metric, index) => (
                                                <div key={index} className="bg-slate-700/30 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
                                                    <div className={`text-3xl mb-3 ${metric.color}`}>
                                                        {metric.icon}
                                                    </div>
                                                    <p className="text-slate-400 text-sm mb-2">{metric.label}</p>
                                                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                                {/* Chart Section */}
                                {reportData.chartData && (
                                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                                        <h3 className="text-xl font-semibold text-white mb-6 text-center">
                                            {currentTab === 'risk' ? 'Transaction Risk Profile' : 'Distribution Analysis'}
                                        </h3>
                                        <div className="h-96">
                                    <canvas id="riskChart"></canvas>
                                </div>
                            </div>
                        )}

                                {/* AI Summary & Insights */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* AI Summary */}
                                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                                            <AiOutlineBulb className="text-purple-400" />
                                            <span>{reportData.summaryTitle}</span>
                                        </h3>
                                        <div className="bg-slate-700/30 rounded-xl p-6">
                                            <p className="text-slate-300 leading-relaxed text-lg">{reportData.summary}</p>
                                        </div>
                                    </div>

                                    {/* Key Insights */}
                                    {reportData.insights && (
                                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                                                <AiOutlineStar className="text-yellow-400" />
                                                <span>Key Insights</span>
                                            </h3>
                                            <div className="space-y-4">
                                                {reportData.insights.map((insight, index) => (
                                                    <div key={index} className="flex items-start space-x-3">
                                                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                                        <p className="text-slate-300">{insight}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50 text-center">
                                <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AiOutlineRobot className="text-5xl text-slate-400" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-3">Ready for Analysis</h3>
                                <p className="text-slate-400 text-lg mb-8">Enter an address and select analysis type to get started</p>
                                <div className="flex justify-center space-x-4">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center">
                    <p className="text-slate-400 text-sm">Powered by advanced AI models. Data is for informational purposes only.</p>
                </div>
            </div>
        </div>
    );
};

export default AiAnalyzer; 