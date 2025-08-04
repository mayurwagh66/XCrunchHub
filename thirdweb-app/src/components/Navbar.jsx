import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton, darkTheme, useActiveAccount } from "thirdweb/react";
import { client } from "../client";
import image from "../assets/image.png";


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const account = useActiveAccount();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${
        scrolled ? "bg-[#001636] bg-opacity-95 backdrop-blur-md border-b border-gray-700/50" : "bg-[#001636] bg-opacity-85 backdrop-blur-sm"
      } fixed top-0 left-0 w-full z-50 shadow-lg transition-all ease-in-out duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img src={image} alt="Logo" className="h-12 w-12 rounded-lg shadow-lg hover:scale-110 transition-transform duration-200" />
            <Link to="/">
              <h1 className="text-3xl font-extrabold text-white cursor-pointer hover:scale-105 transition-transform duration-200 tracking-wide">
                <span className="text-white drop-shadow-lg">XCrunch</span>
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
                  Hub
                </span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {account ? (
              <>
                <Link
                  to="/Token"
                  className={`${
                    isActive("/Token") ? "text-blue-400 font-semibold bg-blue-900/20 px-3 py-2 rounded-lg" : "text-white hover:text-blue-200 hover:bg-blue-900/10 px-3 py-2 rounded-lg"
                  } transition-all duration-200 font-medium`}
                >
                  Token
                </Link>

                <Link
                  to="/Pool"
                  className={`${
                    isActive("/Pool") ? "text-blue-400 font-semibold bg-blue-900/20 px-3 py-2 rounded-lg" : "text-white hover:text-blue-200 hover:bg-blue-900/10 px-3 py-2 rounded-lg"
                  } transition-all duration-200 font-medium`}
                >
                  Pool
                </Link>

                <Link
                  to="/Portfolio"
                  className={`${
                    isActive("/Portfolio") ? "text-blue-400 font-semibold bg-blue-900/20 px-3 py-2 rounded-lg" : "text-white hover:text-blue-200 hover:bg-blue-900/10 px-3 py-2 rounded-lg"
                  } transition-all duration-200 font-medium`}
                >
                  Portfolio
                </Link>

                <Link
                  to="/Subscription"
                  className={`${
                    isActive("/Subscription") ? "text-blue-400 font-semibold bg-blue-900/20 px-3 py-2 rounded-lg" : "text-white hover:text-blue-200 hover:bg-blue-900/10 px-3 py-2 rounded-lg"
                  } transition-all duration-200 font-medium`}
                >
                  Subscription
                </Link>
                <Link
                  to="/ai-analyzer"
                  className={`${
                    isActive("/ai-analyzer") ? "text-blue-400 font-semibold bg-blue-900/20 px-3 py-2 rounded-lg" : "text-white hover:text-blue-200 hover:bg-blue-900/10 px-3 py-2 rounded-lg"
                  } transition-all duration-200 font-medium`}
                >
                  AI Analytics
                </Link>
                <div className="relative group">
                  <button
                    className={`text-white hover:text-blue-200 hover:bg-blue-900/10 px-3 py-2 rounded-lg transition-all duration-200 font-medium focus:outline-none`}
                  >
                    AI Tools
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-[#001636]/95 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 invisible">
                    <Link
                      to="/ai-analyzer"
                      className="block px-4 py-3 text-sm text-white hover:bg-blue-900/30 hover:text-blue-200 transition-all duration-200 rounded-md mx-2 my-1"
                      onClick={() => setIsOpen(false)}
                    >
                      AI Analyzer
                    </Link>
                    <Link
                      to="/fraud-detection"
                      className="block px-4 py-3 text-sm text-white hover:bg-blue-900/30 hover:text-blue-200 transition-all duration-200 rounded-md mx-2 my-1"
                      onClick={() => setIsOpen(false)}
                    >
                      Fraud Detection
                    </Link>
                    <Link
                      to="/nft-dashboards"
                      className="block px-4 py-3 text-sm text-white hover:bg-blue-900/30 hover:text-blue-200 transition-all duration-200 rounded-md mx-2 my-1"
                      onClick={() => setIsOpen(false)}
                    >
                      NFT Analytics Dashboards
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            
            <ConnectButton
              client={client}
              theme={darkTheme()}
              detailsButton={{
                style: {
                  maxHeight: "50px",
                  backgroundColor: "#1e40af",
                  color: "white",
                  borderRadius: "12px",
                  border: "1px solid #3b82f6",
                  padding: "8px 16px",
                  fontWeight: "600",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            />
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
  <div className="md:hidden bg-[#001636]/95 backdrop-blur-md border-t border-gray-700/50 p-4 shadow-lg">
    <div className="space-y-4">
      {/* Close button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(false)}
          className="text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Links Section */}
      {account && (
        <div className="space-y" style={{marginLeft:"50px"}}>
          <Link
            to="/Token"
            className={`${
              isActive("/Token") ? "text-blue-400 font-semibold " : "text-white hover:text-blue-200"
            } transition block text-lg`}
            onClick={() => setIsOpen(false)}
          >
            Token
          </Link>

          <Link
            to="/Pool"
            className={`p-2 rounded-md ${isActive("/Pool") ? "text-blue-400 font-semibold bg-blue-900" : "text-white hover:text-blue-200 hover:bg-blue-800 hover:scale-105"} transition block text-lg transform`}
            onClick={() => setIsOpen(false)}
          >
            Pool
          </Link>

          <Link
            to="/Portfolio"
            className={`p-2 rounded-md ${isActive("/Portfolio") ? "text-blue-400 font-semibold bg-blue-900" : "text-white hover:text-blue-200 hover:bg-blue-800 hover:scale-105"} transition block text-lg transform`}
            onClick={() => setIsOpen(false)}
          >
            Portfolio
          </Link>

          <Link
            to="/Subscription"
            className={`p-2 rounded-md ${isActive("/Subscription") ? "text-blue-400 font-semibold bg-blue-900" : "text-white hover:text-blue-200 hover:bg-blue-800 hover:scale-105"} transition block text-lg transform`}
            onClick={() => setIsOpen(false)}
          >
            Subscription
          </Link>
          <Link
            to="/ai-analyzer"
            className={`p-2 rounded-md ${isActive("/ai-analyzer") ? "text-blue-400 font-semibold bg-blue-900" : "text-white hover:text-blue-200 hover:bg-blue-800 hover:scale-105"} transition block text-lg transform`}
            onClick={() => setIsOpen(false)}
          >
            AI Analytics
          </Link>
          <div className="relative group">
            <button
              className={`p-2 rounded-md text-white hover:text-blue-200 hover:bg-blue-800 hover:scale-105 transition block text-lg focus:outline-none transform`}
            >
              AI Tools
            </button>
            <div className="pl-4 space-y-2">
              <Link
                to="/ai-analyzer"
                className="p-2 rounded-md block text-md text-white hover:text-blue-200 hover:bg-blue-800 hover:scale-105 transition transform"
                onClick={() => setIsOpen(false)}
              >
                AI Analyzer
              </Link>
              <Link
                to="/fraud-detection"
                className="p-2 rounded-md block text-md text-white hover:text-blue-200 hover:bg-blue-800 hover:scale-105 transition transform"
                onClick={() => setIsOpen(false)}
              >
                Fraud Detection
              </Link>
              <Link
                to="/nft-dashboards"
                className="p-2 rounded-md block text-md text-white hover:text-blue-200 hover:bg-blue-800 hover:scale-105 transition transform"
                onClick={() => setIsOpen(false)}
              >
                NFT Analytics Dashboards
              </Link>
            </div>
          </div>
        </div>
      )}
      

      {/* Connect Button */}
      <div className="mt-4">
        <ConnectButton
          client={client}
          theme={darkTheme()}
          detailsButton={{
            style: {
              marginLeft:"50px",
              maxHeight: "50px",
              backgroundColor: "#1e40af",
              color: "white",
              borderRadius: "12px",
              border: "1px solid #3b82f6",
              padding: "8px 16px",
              fontWeight: "600",
              width: "25%",
              transition: "all 0.2s ease-in-out",
            },
          }}
        />
      </div>
    </div>
  </div>
)}

    </nav>
  );
}

export default Navbar;
