import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub, FaDiscord } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { BiAnalyse, BiShield, BiTrendingUp } from 'react-icons/bi';

function Footer() {
  return (
    <footer className="relative bg-black bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">X</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Xcrunch</h3>
                  <span className="text-sm bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent font-semibold">HUB</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Advanced blockchain analytics and scoring platform. Discover, analyze, and track the best opportunities in the crypto space.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-purple-500/20 rounded-full flex items-center justify-center transition-all duration-300 group">
                <FaTwitter className="text-white group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-purple-500/20 rounded-full flex items-center justify-center transition-all duration-300 group">
                <FaDiscord className="text-white group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-purple-500/20 rounded-full flex items-center justify-center transition-all duration-300 group">
                <FaGithub className="text-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <BiTrendingUp className="mr-2 group-hover:scale-110 transition-transform" />
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/Token" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <BiAnalyse className="mr-2 group-hover:scale-110 transition-transform" />
                  Token Analysis
                </a>
              </li>
              <li>
                <a href="/Pool" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <BiShield className="mr-2 group-hover:scale-110 transition-transform" />
                  Pool Security
                </a>
              </li>
              <li>
                <a href="/ai-analyzer" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <BiAnalyse className="mr-2 group-hover:scale-110 transition-transform" />
                  AI Analyzer
                </a>
              </li>
              <li>
                <a href="/fraud-detection" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <BiShield className="mr-2 group-hover:scale-110 transition-transform" />
                  Fraud Detection
                </a>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Portfolio Tracking
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Risk Assessment
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Market Analysis
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  NFT Analytics
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  API Access
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                                 <MdEmail className="mr-3 text-purple-400" />
                <span className="text-sm">support@xcrunch.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                                 <MdPhone className="mr-3 text-purple-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                                 <MdLocationOn className="mr-3 text-purple-400" />
                <span className="text-sm">Crypto Valley, Switzerland</span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-3 text-white">Stay Updated</h5>
              <div className="flex">
                                 <input
                   type="email"
                   placeholder="Enter your email"
                   className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                 />
                 <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-r-lg transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} XCrunchHub. All Rights Reserved.</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

             {/* Floating Elements */}
       <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-full blur-xl"></div>
       <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-purple-500/20 rounded-full blur-xl"></div>
    </footer>
  );
}

export default Footer;


