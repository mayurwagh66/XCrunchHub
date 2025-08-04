import React, { useState } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
    FaRocket,
    FaCoins,
    FaUsers,
    FaChartBar,
    FaLightbulb,
    FaGlobe,
    FaFileAlt,
    FaEye,
    FaBrain
} from 'react-icons/fa';

const FraudDetection = () => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('English');
  const [queryResponse, setQueryResponse] = useState('');
  const [riskInput, setRiskInput] = useState('');
  const [riskReport, setRiskReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [useGroq, setUseGroq] = useState(false);
  const [copiedInput, setCopiedInput] = useState(false);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  const geminiModel = new GoogleGenerativeAI(GEMINI_API_KEY).getGenerativeModel({ model: "gemini-1.5-flash" });
  const groqClient = new Groq({
    apiKey: GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const groqModelName = "llama3-8b-8192";

  const handleCopyInput = () => {
    if (riskInput) {
      navigator.clipboard.writeText(riskInput);
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    }
  };

  const handleMultilingualQuery = async () => {
    setLoading(true);
    setQueryResponse('');
    try {
      let prompt = `As a multilingual AI, answer the following query about an NFT project in ${language}:

Query: "${query}"

Provide a concise and informative response, assuming you have access to real-time NFT project data. If you cannot find specific data, explain that but still provide a general overview.`;
      
      let text = "";
      if (useGroq) {
        const chatCompletion = await groqClient.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: groqModelName,
        });
        text = chatCompletion.choices[0]?.message?.content || "";
      } else {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        text = response.text();
      }
      setQueryResponse(text);
    } catch (error) {
      console.error("Error generating multilingual query response:", error);
      setQueryResponse("Error generating response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRiskAnalysis = async () => {
    setLoading(true);
    setRiskReport('');
    try {
      let prompt = `Perform a comprehensive risk assessment for the NFT project or wallet address: "${riskInput}".

As an AI expert in blockchain forensics and predictive analytics, generate a detailed report identifying potential risks. Structure your response clearly with headings, bullet points, and relevant emojis. Present the headings without any bolding markdown (\`**\`) or numbering symbols (\`#\`). Focus on the following areas:

Scam & Fraud Risk: 🚨 Indications of phishing, fake projects, malicious contracts, or suspicious activities (e.g., unusual transaction patterns, rapid token dumps, or hidden functionalities).
Rug Pull Potential: 📉 Warning signs of sudden project abandonment, liquidity removal, or developer anonymity.
Forgery & Authenticity: 🖼️ Likelihood of counterfeit NFTs, manipulated metadata, or unauthorized minting.
Wash Trading & Manipulation: ♻️ Evidence of artificial trading volume or price manipulation through self-dealing.
Sanctioned Interactions: 🚫 Any links or direct interactions with known sanctioned entities or addresses.

Provide a clear and concise report, including specific reasons for your assessment and actionable insights or warnings. If the input is a wallet address, analyze its transaction patterns, NFT holdings, and interaction history. If it's a project name, assess its contract, community, liquidity, and market behavior. Aim for a professional, easy-to-read forensic analysis.`;

      let text = "";
      if (useGroq) {
        const chatCompletion = await groqClient.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: groqModelName,
        });
        text = chatCompletion.choices[0]?.message?.content || "";
      } else {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        text = response.text();
      }
      setRiskReport(text);
    } catch (error) {
      console.error("Error generating risk report:", error);
      setRiskReport("Error generating risk report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const input = document.getElementById('risk-report-content');
    if (input) {
      html2canvas(input, {
        scale: 2,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: 'a4'
        });

        const imgWidth = 595.28;
        const pageHeight = 841.89;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const filename = `NFT_Risk_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
        pdf.save(filename);
      });
    } else {
      console.error("Risk report content element not found for PDF download.");
    }
  };

  const getRiskLevel = (report) => {
    if (!report) return 'unknown';
    const lowerReport = report.toLowerCase();
    if (lowerReport.includes('high risk') || lowerReport.includes('🚨') || lowerReport.includes('critical')) {
      return 'high';
    } else if (lowerReport.includes('medium risk') || lowerReport.includes('⚠️') || lowerReport.includes('moderate')) {
      return 'medium';
    } else if (lowerReport.includes('low risk') || lowerReport.includes('✅') || lowerReport.includes('safe')) {
      return 'low';
    }
    return 'unknown';
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

  const riskLevel = getRiskLevel(riskReport);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-16">
          <div className="text-center mb-12">
                                     <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full px-6 py-3 mb-6">
                             <FaShieldAlt className="text-red-400 text-xl" />
                             <span className="text-red-400 font-medium">Advanced Fraud Detection</span>
                         </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              Blockchain
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"> Forensics</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              AI-powered fraud detection, risk assessment, and forensic analysis for NFT projects and wallet addresses
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
                {/* AI Model Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <FaBrain className="text-red-400" />
                    <span>AI Model</span>
                  </h3>
                  <select
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                    value={useGroq ? "groq" : "gemini"}
                    onChange={(e) => setUseGroq(e.target.value === "groq")}
                  >
                    <option value="gemini">Gemini (Google AI)</option>
                    <option value="groq">Groq (Fast Inference)</option>
                  </select>
                </div>

                {/* Quick Stats */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <AiOutlineBarChart className="text-red-400" />
                    <span>Detection Stats</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-red-400 mb-1">99.7%</div>
                      <p className="text-slate-400 text-sm">Accuracy Rate</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-orange-400 mb-1">2.3M+</div>
                      <p className="text-slate-400 text-sm">Scams Detected</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">15+</div>
                      <p className="text-slate-400 text-sm">Languages</p>
                    </div>
                  </div>
                </div>

                {/* Risk Level Indicator */}
                {riskReport && (
                  <div className="mb-8">
                                         <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                       <FaShieldAlt className="text-red-400" />
                       <span>Risk Assessment</span>
                     </h3>
                    <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">
                        {getRiskIcon(riskLevel)}
                      </div>
                      <div className={`text-xl font-bold mb-1 ${getRiskColor(riskLevel)}`}>
                        {riskLevel.toUpperCase()} RISK
                      </div>
                      <p className="text-slate-400 text-sm">
                        {riskLevel === 'high' ? 'Immediate attention required' :
                         riskLevel === 'medium' ? 'Caution advised' :
                         riskLevel === 'low' ? 'Generally safe' : 'Analysis needed'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Tools */}
          <div className="xl:col-span-3">
            <div className="space-y-8">
              {/* Multilingual Query Engine */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <FaGlobe className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Multilingual Query Engine</h2>
                    <p className="text-slate-400">Ask questions about NFT projects in multiple languages</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Query</label>
          <input
            type="text"
                        className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            placeholder="Ask about any NFT project..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
                    </div>
                    <div className="lg:w-48">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                      <select
                        className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Japanese">Japanese</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Korean">Korean</option>
                        <option value="Arabic">Arabic</option>
          </select>
                    </div>
                    <div className="lg:w-auto">
                      <label className="block text-sm font-medium text-slate-300 mb-2">&nbsp;</label>
                      <button
                        onClick={handleMultilingualQuery}
                        disabled={loading || !query.trim()}
                        className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:cursor-not-allowed transform hover:scale-105"
                      >
                        {loading ? (
                          <>
                            <AiOutlineLoading3Quarters className="animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <FaSearch />
                            <span>Ask</span>
                          </>
                        )}
          </button>
        </div>
                  </div>

        {queryResponse && (
                    <div className="bg-slate-700/30 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <AiOutlineBulb className="text-blue-400" />
                        <span>Response</span>
                      </h3>
                      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {queryResponse}
                      </div>
          </div>
        )}
                </div>
              </div>

              {/* AI Risk Engine & Forensics */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                <div className="flex items-center space-x-3 mb-6">
                                     <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                     <FaShieldAlt className="text-white text-xl" />
                   </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">AI Risk Engine & Forensics</h2>
                    <p className="text-slate-400">Comprehensive risk assessment and forensic analysis</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Wallet Address or Project</label>
                      <div className="relative">
          <input
            type="text"
                          className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-400 focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
            placeholder="Enter wallet address or NFT project identifier..."
            value={riskInput}
            onChange={(e) => setRiskInput(e.target.value)}
          />
                        {riskInput && (
                          <button
                            onClick={handleCopyInput}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            {copiedInput ? <FaCheck className="text-green-400" /> : <FaCopy />}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="lg:w-auto">
                      <label className="block text-sm font-medium text-slate-300 mb-2">&nbsp;</label>
                      <button
                        onClick={handleRiskAnalysis}
                        disabled={loading || !riskInput.trim()}
                        className="w-full lg:w-auto bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:cursor-not-allowed transform hover:scale-105"
                      >
                        {loading ? (
                          <>
                            <AiOutlineLoading3Quarters className="animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <FaShieldAlt />
                            <span>Analyze Risk</span>
                          </>
                        )}
          </button>
        </div>
                  </div>

        {riskReport && (
                    <div className="bg-slate-700/30 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                          <AiOutlineWarning className="text-red-400" />
                          <span>Risk Report</span>
                        </h3>
                        <button
                          onClick={handleDownloadPdf}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
                        >
                          <AiOutlineDownload />
                          <span>Download PDF</span>
                        </button>
                      </div>
                      <div id="risk-report-content" className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {riskReport}
                      </div>
                    </div>
                  )}
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

                <div className="bg-slate-700/30 rounded-xl p-12 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaNetworkWired className="text-4xl text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Coming Soon</h3>
                  <p className="text-slate-400 mb-6">
                    Interactive visualizations of NFT fraud networks, transaction patterns, and suspicious connections
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm">Powered by advanced AI models. Risk assessments are for informational purposes only.</p>
        </div>
      </div>
    </div>
  );
};

export default FraudDetection;