import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import animationData from '../../../animation/rzq6s13pWw.json';
import rocket from '../assets/rocket.json';
import Y6H8Ciz0IK from '../../../animation/Y6H8Ciz0IK.json';
import kklEM4rrNE from '../../../animation/kklEM4rrNE.json';
import c3S8Y4Yque from '../../../animation/c3S8Y4Yque.json';
import { 
    AiOutlineBarChart,
    AiOutlineSafety,
    AiOutlineEye
} from 'react-icons/ai';
import { 
    FaCoins,
    FaSearch,
    FaTelegram
} from 'react-icons/fa';

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  // Configure intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.dataset.section));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Animation classes helper
  const getAnimationClass = (section) => {
    return visibleSections.has(section) ? 'animate-fade-in-up' : 'opacity-0 translate-y-4';
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#0A0E24] text-gray-200">
      {/* Background Lightning Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient-blue opacity-30 animate-pulse-light transform-gpu"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-radial-gradient-light-blue opacity-20 animate-pulse-light delay-500 transform-gpu"></div>
        <div className="absolute bottom-0 left-1/4 w-full h-full bg-radial-gradient-blue opacity-25 animate-pulse-light delay-1000 transform-gpu"></div>
      </div>

      {/* Main Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 max-w-7xl mx-auto">
          {/* Lottie Animation */}
          <div 
            ref={el => sectionRefs.current[0] = el}
            data-section="main-animation"
            className={`w-full max-w-md lg:max-w-xl transition-all duration-700 ${getAnimationClass('main-animation')}`}
          >
            <Lottie animationData={Y6H8Ciz0IK} loop={true} autoplay={true} />
          </div>

          {/* Text Section */}
          <div 
            ref={el => sectionRefs.current[1] = el}
            data-section="main-text"
            className={`text-center md:text-left space-y-6 transition-all duration-700 ${getAnimationClass('main-text')}`}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
              Decentralize. <span>Empower</span>. Prosper.
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-2xl">
              XCrunchHub is your trusted DeFi platform, redefining finance through blockchain technology.
              Take control of your financial future today.
            </p>
            <button className="px-4 py-3 text-white font-semibold rounded-xl shadow-lg 
                  bg-gradient-to-r from-blue-700 to-blue-500 
                  hover:bg-gradient-to-br hover:from-blue-800 hover:to-blue-600 
                  transform transition-all duration-300 
                  hover:scale-105 hover:shadow-2xl 
                  active:scale-95 focus:ring-4 focus:ring-blue-400/50">
  Explore DeFi 
</button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div 
            ref={el => sectionRefs.current[2] = el}
            data-section="features-title"
            className={`text-center mb-16 transition-all duration-700 ${getAnimationClass('features-title')}`}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
              Welcome to XCrunchHub
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Card */}
            <div 
              ref={el => sectionRefs.current[3] = el}
              data-section="features-left"
              className={`p-8 bg-[#0B1020] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden border border-transparent card-glow-effect ${getAnimationClass('features-left')}`}
            >
              <h3 className="text-2xl font-semibold mb-6 text-blue-400">
                Why Choose XCrunchHub?
              </h3>
              <ul className="space-y-4 text-blue-200">
                {[
                  'Full Transparency: Public ledger accountability',
                  'Military-grade Security Protocols',
                  'Advanced AI-Powered Analytics',
                  'Multi-Chain DeFi Support'
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 animate-fade-in">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-400 rounded-full"></div>
                    <span className="text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Center Animation */}
            <div 
              ref={el => sectionRefs.current[4] = el}
              data-section="features-center"
              className={`flex items-center justify-center ${getAnimationClass('features-center')}`}
            >
              <div className="w-full max-w-sm transform hover:scale-105 transition-transform">
                <Lottie animationData={kklEM4rrNE} loop={true} autoplay={true} />
              </div>
            </div>

            {/* Right Card */}
            <div 
              ref={el => sectionRefs.current[5] = el}
              data-section="features-right"
              className={`p-8 bg-[#0B1020] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden border border-transparent card-glow-effect ${getAnimationClass('features-right')}`}
            >
              <h3 className="text-2xl font-semibold mb-6 text-blue-400">
                Our Value Proposition
              </h3>
              <ul className="space-y-4 text-blue-200">
                {[
                  'Comprehensive Token Analysis',
                  'Real-time Market Analytics',
                  'AI-Powered Risk Assessment',
                  'Ethereum, Polygon, Avalanche, Linea Support'
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 animate-fade-in">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-400 rounded-full"></div>
                    <span className="text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div 
            ref={el => sectionRefs.current[6] = el}
            data-section="services-title"
            className={`text-center mb-8 ${getAnimationClass('services-title')}`}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
            Our Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              {
                title: 'Token Analytics',
                content: 'Comprehensive token analysis with AI-powered valuation models and risk assessment',
                animation: c3S8Y4Yque,
                features: ['AI Valuation', 'Risk Assessment', 'Market Analysis'],
                icon: <AiOutlineBarChart className="text-2xl" />
              },
              {
                title: 'DeFi Pool Analytics',
                content: 'Advanced liquidity pool analysis with impermanent loss protection and yield optimization',
                animation: animationData,
                features: ['Impermanent Loss', 'Yield Analysis', 'Risk Metrics'],
                icon: <FaCoins className="text-2xl" />
              },
              {
                title: 'AI-Powered Analytics',
                content: 'Advanced AI analytics for wallet analysis, NFT collections, and comprehensive risk assessment',
                animation: rocket,
                features: ['Wallet Analysis', 'NFT Collections', 'Risk Forensics'],
                icon: <AiOutlineEye className="text-2xl" />
              },
              {
                title: 'Security & Fraud Detection',
                content: 'Multi-language fraud detection with real-time security alerts and contract analysis',
                animation: c3S8Y4Yque,
                features: ['Multi-language', 'Real-time Alerts', 'Security Analysis'],
                icon: <AiOutlineSafety className="text-2xl" />
              },
              {
                title: 'NFT Market Analytics',
                content: 'Comprehensive NFT market analysis with security auditing and whale tracking',
                animation: animationData,
                features: ['Security Auditing', 'Whale Tracking', 'Market Analysis'],
                icon: <FaSearch className="text-2xl" />
              },
              {
                title: 'Telegram Bot Integration',
                content: 'AI-powered NFT Copilot Bot with real-time alerts, analysis, and investment advice',
                animation: rocket,
                features: ['Real-time Alerts', 'AI Analysis', 'Investment Advice'],
                icon: <FaTelegram className="text-2xl" />
              }
            ].map((service, index) => (
              <div 
                key={index}
                ref={el => sectionRefs.current[7 + index] = el}
                data-section={`service-${index}`}
                className={`p-8 bg-[#0B1020] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden border border-blue-500/20 card-glow-effect min-h-[400px]`}
              >
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Lottie animationData={service.animation} loop={true} autoplay={true} className="h-24 w-24" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      {service.icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-center text-blue-400">
                  {service.title}
                </h3>
                <p className="text-blue-200 leading-relaxed text-center mb-6">
                  {service.content}
                </p>
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2 text-sm text-blue-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Additional Features Section */}
      <div className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div 
            ref={el => sectionRefs.current[10] = el}
            data-section="additional-features-title"
            className={`text-center mb-16 ${getAnimationClass('additional-features-title')}`}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
              Advanced Features
            </h2>
            <p className="text-xl text-blue-200 mt-4 max-w-3xl mx-auto">
              Discover our comprehensive suite of advanced DeFi tools, AI analytics, and security features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Token Details',
                description: 'Comprehensive token analysis with price history, market cap, and trading volume',
                icon: '📊',
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Pool Details',
                description: 'Detailed DeFi pool analysis with liquidity metrics and yield calculations',
                icon: '🏊',
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Security Auditing',
                description: 'GoPlus Security integration for comprehensive contract security analysis',
                icon: '🛡️',
                color: 'from-red-500 to-orange-500'
              },
              {
                title: 'Multi-Chain Support',
                description: 'Support for Ethereum, Polygon, Avalanche, and Linea networks',
                icon: '🔗',
                color: 'from-indigo-500 to-blue-500'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                ref={el => sectionRefs.current[11 + index] = el}
                data-section={`feature-${index}`}
                className={`p-6 bg-[#0B1020] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden border border-transparent card-glow-effect ${getAnimationClass(`feature-${index}`)}`}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">
                  {feature.title}
                </h3>
                <p className="text-blue-200 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div 
            ref={el => sectionRefs.current[15] = el}
            data-section="cta-section"
            className={`text-center ${getAnimationClass('cta-section')}`}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent mb-6">
              Ready to Explore?
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              Start your DeFi journey with XCrunchHub. Access advanced analytics, security tools, and comprehensive DeFi management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 text-white font-semibold rounded-xl shadow-lg 
                    bg-gradient-to-r from-blue-700 to-blue-500 
                    hover:bg-gradient-to-br hover:from-blue-800 hover:to-blue-600 
                    transform transition-all duration-300 
                    hover:scale-105 hover:shadow-2xl 
                    active:scale-95 focus:ring-4 focus:ring-blue-400/50">
                Get Started
              </button>
              <button className="px-8 py-4 text-blue-400 font-semibold rounded-xl shadow-lg 
                    bg-transparent border-2 border-blue-500
                    hover:bg-blue-500 hover:text-white
                    transform transition-all duration-300 
                    hover:scale-105 hover:shadow-2xl 
                    active:scale-95 focus:ring-4 focus:ring-blue-400/50">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#0A0E24] bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          
          </div>
        </div>
      )}

      <style>{`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
`}</style>
    </div>
  );
}

export default Home;