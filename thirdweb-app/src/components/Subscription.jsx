import React, { useState, useEffect } from "react";
import { prepareContractCall, readContract } from "thirdweb";
import Lottie from 'lottie-react';
import animationData from '../../../animation/rzq6s13pWw.json';
import { useActiveAccount } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import { client } from "../client";
import { ethers } from "ethers";
import { getContract } from "thirdweb";
import { TransactionButton } from "thirdweb/react";

// Contract address from environment variables
const contractaddress = import.meta.env.VITE_ADDRESS;

// Initialize the Thirdweb contract instance
const contract = getContract({
  client: client,
  chain: sepolia,
  address: contractaddress,
});

const Subscription = () => {
  // Get the active wallet account address
  const { address } = useActiveAccount() || {}; // Handle case if address is undefined

  // State for subscription prices
  const [prices, setPrices] = useState({ week: 0, month: 0, year: 0 });
  // State to check if the user is subscribed
  const [isSubscribed, setIsSubscribed] = useState(false);
  // State for remaining subscription time
  const [remainingTime, setRemainingTime] = useState({ days: 0, hours: 0, minutes: 0 });
  // State for skeleton loader when fetching prices
  const [showPricesSkeleton, setShowPricesSkeleton] = useState(true);
  // State for skeleton loader when checking subscription status
  const [showSubscriptionSkeleton, setShowSubscriptionSkeleton] = useState(true);
  // State for transaction messages (success/error)
  const [transactionStatus, setTransactionStatus] = useState("");
  // State to control visibility of transaction message
  const [showTransactionMessage, setShowTransactionMessage] = useState(false);

  // Effect to fetch subscription prices from the contract
  useEffect(() => {
    const fetchPrices = async () => {
      // Only fetch if wallet is connected
      if (!address) {
        setShowPricesSkeleton(false); // Hide skeleton if no address
        return;
      }

      setShowPricesSkeleton(true); // Show skeleton while loading

      // Simulate a delay for loading effect
      setTimeout(async () => {
        try {
          // Read contract methods for prices
          const priceWeek = await readContract({
            contract,
            method: "function priceWeek() view returns (uint256)",
          });

          const priceMonth = await readContract({
            contract,
            method: "function priceMonth() view returns (uint256)",
          });

          const priceYear = await readContract({
            contract,
            method: "function priceYear() view returns (uint256)",
          });

          // Update prices state, converting wei to ether string
          setPrices({
            week: ethers.formatEther(priceWeek),
            month: ethers.formatEther(priceMonth),
            year: ethers.formatEther(priceYear),
          });
        } catch (error) {
          // Log specific error message for debugging
          console.error("Error fetching prices:", error.message, error);
          setTransactionStatus("Failed to fetch prices.");
          setShowTransactionMessage(true);
        } finally {
          setShowPricesSkeleton(false); // Hide skeleton after fetch attempt
        }
      }, 500); // 0.5 second delay to simulate loading
    };

    fetchPrices();
  }, [address]); // Re-run when wallet address changes

  // Effect to check if the user is already subscribed and calculate remaining time
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      // Only check if wallet is connected
      if (!address) {
        setIsSubscribed(false); // Ensure not subscribed if no address
        setShowSubscriptionSkeleton(false); // Hide skeleton if no address
        return;
      }

      setShowSubscriptionSkeleton(true); // Show skeleton while checking status

      try {
        // Read contract method to check subscription status for the user
        const data = await readContract({
          contract,
          method: "function isSubscribed(address _user) view returns (bool)",
          params: [address],
        });

        setIsSubscribed(data); // Update subscription status

        // If subscribed, fetch subscription end time and calculate remaining time
        if (data) {
          const subscriptionEndTime = await readContract({
            contract,
            method: "function subscriptions(address) view returns (uint256)",
            params: [address],
          });

          // Convert BigNumber timestamp (seconds) to JavaScript milliseconds
          const endTime = Number(subscriptionEndTime) * 1000;
          const remainingMilliseconds = endTime - Date.now();

          // Calculate days, hours, and minutes remaining
          const daysRemaining = Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24));
          const hoursRemaining = Math.floor((remainingMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutesRemaining = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

          setRemainingTime({
            days: daysRemaining,
            hours: hoursRemaining,
            minutes: minutesRemaining,
          });
        }
      } catch (error) {
        // Log specific error message for debugging
        console.error("Error checking subscription status:", error.message, error);
        setTransactionStatus("Failed to check subscription status.");
        setShowTransactionMessage(true);
      } finally {
        setShowSubscriptionSkeleton(false); // Hide skeleton after status check
      }
    };

    checkSubscriptionStatus();
  }, [address]); // Re-run when wallet address changes

  // Function to handle transaction confirmation
  const handleTransactionConfirmed = async () => {
    setTransactionStatus("Transaction Successful!");
    setShowTransactionMessage(true);
    // You might want to re-fetch subscription status after a successful transaction
    // to update the UI immediately.
    // checkSubscriptionStatus(); // This would re-run the useEffect
  };

  // Function to handle transaction error
  const handleTransactionError = (error) => {
    setTransactionStatus(`Transaction Failed: ${error.message || 'Unknown error'}`);
    setShowTransactionMessage(true);
    console.error("Transaction error:", error);
  };

  return (
    <div className="bg-transparent min-h-screen flex flex-col items-center pt-10 px-4">

      {/* Transaction Status Message */}
      {showTransactionMessage && (
        <div className={`mb-4 p-3 rounded-md text-white ${transactionStatus.includes("Successful") ? "bg-green-500" : "bg-red-500"}`}>
          {transactionStatus}
          <button onClick={() => setShowTransactionMessage(false)} className="ml-4 text-white font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Main content container with Lottie and plans */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-7xl w-full">
        {/* Lottie Animation on the left */}
        <div className="w-full md:w-1/3 flex justify-center items-center">
          <Lottie animationData={animationData} loop={true} autoplay={true} className="max-w-xs md:max-w-none" />
        </div>

        {/* Subscription Plans on the right */}
        <div className="w-full md:w-2/3 flex flex-wrap justify-center gap-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-12 mt-8 text-center w-full">
            Choose Your Subscription Plan
          </h1>
          {showPricesSkeleton || showSubscriptionSkeleton ? (
            <div className="flex flex-wrap justify-center gap-8 w-full">
              {/* Skeleton Loader for Subscription Plans */}
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 text-gray-200 rounded-xl p-8 w-80 animate-pulse">
                  <div className="bg-gray-600 h-8 w-2/3 mb-4 rounded"></div>
                  <div className="bg-gray-600 h-10 w-1/2 mb-4 rounded"></div>
                  <div className="bg-gray-600 h-6 w-3/4 mb-6 rounded"></div>
                  <div className="bg-gray-600 h-10 w-full rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8 w-full">
              {/* Weekly Plan */}
              <div className="bg-[#0B1020] border border-gray-700 text-gray-200 rounded-xl p-8 w-80 hover:scale-105 transition-all group relative overflow-hidden border border-transparent card-glow-effect">
                <h2 className="text-2xl font-semibold mb-4">Weekly Plan</h2>
                <p className="text-3xl font-bold mb-2 text-blue-400">{prices.week} ETH</p>
                <p className="mb-6 text-gray-400">7 Days Full Access</p>
                {isSubscribed ? (
                  <div className="text-gray-400 text-sm">
                    <p className="text-green-400">Subscription Active</p>
                    <p>{remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m remaining</p>
                  </div>
                ) : (
                  <TransactionButton
                    transaction={() =>
                      prepareContractCall({
                        contract,
                        method: "function subscribe(uint8 _option) payable",
                        params: [1], // Week Plan
                        // Correctly convert ETH string to Wei BigInt
                        value: ethers.parseEther(prices.week.toString()),
                      })
                    }
                    onTransactionConfirmed={handleTransactionConfirmed}
                    onError={handleTransactionError}
                    style={{
                      marginTop: "1rem",
                      backgroundColor: "#2563EB",
                      color: "white",
                      padding: "1rem 1rem",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "15px"
                    }}
                  >
                    Get Started
                  </TransactionButton>
                )}
              </div>

              {/* Monthly Plan */}
              <div className="bg-[#0B1020] border border-gray-700 text-gray-200 rounded-xl p-8 w-80 hover:scale-105 transition-all group relative overflow-hidden border border-transparent card-glow-effect">
                <h2 className="text-2xl font-semibold mb-4">Monthly Plan</h2>
                <p className="text-3xl font-bold mb-2 text-blue-400">{prices.month} ETH</p>
                <p className="mb-6 text-gray-400">30 Days Full Access</p>
                {isSubscribed ? (
                  <div className="text-gray-400 text-sm">
                    <p className="text-green-400">Subscription Active</p>
                    <p>{remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m remaining</p>
                  </div>
                ) : (
                  <TransactionButton
                    transaction={() =>
                      prepareContractCall({
                        contract,
                        method: "function subscribe(uint8 _option) payable",
                        params: [2], // Month Plan
                        // Correctly convert ETH string to Wei BigInt
                        value: ethers.parseEther(prices.month.toString()),
                      })
                    }
                    onTransactionConfirmed={handleTransactionConfirmed}
                    onError={handleTransactionError}
                    style={{
                      marginTop: "1rem",
                      backgroundColor: "#2563EB",
                      color: "white",
                      padding: "1rem 1rem",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "15px"
                    }}
                  >
                    Most Popular
                  </TransactionButton>
                )}
              </div>

              {/* Yearly Plan */}
              <div className="bg-[#0B1020] border border-gray-700 text-gray-200 rounded-xl p-8 w-80 hover:scale-105 transition-all group relative overflow-hidden border border-transparent card-glow-effect">
                <h2 className="text-2xl font-semibold mb-4">Yearly Plan</h2>
                <p className="text-3xl font-bold mb-2 text-blue-400">{prices.year} ETH</p>
                <p className="mb-6 text-gray-400">365 Days Full Access</p>
                {isSubscribed ? (
                  <div className="text-gray-400 text-sm">
                    <p className="text-green-400">Subscription Active</p>
                    <p>{remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m remaining</p>
                  </div>
                ) : (
                  <TransactionButton
                    transaction={() =>
                      prepareContractCall({
                        contract,
                        method: "function subscribe(uint8 _option) payable",
                        params: [3], // Year Plan
                        // Correctly convert ETH string to Wei BigInt
                        value: ethers.parseEther(prices.year.toString()),
                      })
                    }
                    onTransactionConfirmed={handleTransactionConfirmed}
                    onError={handleTransactionError}
                    style={{
                      marginTop: "1rem",
                      backgroundColor: "#2563EB",
                      color: "white",
                      padding: "1rem 1rem",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "15px"
                    }}
                  >
                    Best Value
                  </TransactionButton>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
