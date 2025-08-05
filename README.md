# 🚀 XCrunchHub

<img width="1919" height="983" alt="Dashboard_1 1" src="https://github.com/user-attachments/assets/0e0d46d2-9e5d-48c9-858f-7bc870728266" />
<img width="1919" height="982" alt="Dashboard_1 3" src="https://github.com/user-attachments/assets/c5ea353f-7d7b-45ef-b023-d4e4321ece59" />
<img width="1919" height="985" alt="Dashboard_1 4" src="https://github.com/user-attachments/assets/c7b3d0d9-68c0-4fd9-bdbf-0cfe249ee91f" />
<img width="1919" height="984" alt="Dashboard_1 5" src="https://github.com/user-attachments/assets/eba277df-a568-4728-8c59-e3343182a437" />



> **Your Trusted DeFi Platform**

**XCrunchHub** is a powerful DeFi analytics platform that empowers users with blockchain-driven financial insights. Experience next-gen DeFi analytics, smart contract integrations, and AI-powered market analysis—all in one place.

📺 **[Watch Demo Video](https://www.youtube.com/watch?v=ZoMBdVoQzlU)**

---

## 🔍 Features

### 🪙 Token Analysis
- Comprehensive token data (price history, market cap, volume)
- DeFi safety scores for risk evaluation
- Multi-chain support (Ethereum, Polygon, Avalanche, Linea)
- Detailed technical indicators and trends
<img width="1919" height="985" alt="Token" src="https://github.com/user-attachments/assets/448f0493-5173-4c37-98b0-bdd5aaeed1fe" />

### 🏦 Pool Details
- DeFi pool metrics with liquidity insights
- Yield/APY calculations and historical data
- Risk evaluation of liquidity pools
- Support for major DeFi protocols
<img width="1916" height="986" alt="Pool" src="https://github.com/user-attachments/assets/2a722339-4a3e-4202-b281-6fdc7018f8f5" />


### 🤖 AI Analytics
- Wallet activity & holding analysis
- NFT collection insights and performance
- AI-driven risk and threat detection
- Predictive analysis for market trends
  <img width="1530" height="971" alt="AI_ANALYSIS" src="https://github.com/user-attachments/assets/e13a9b5f-34b7-4ffc-a17a-710a4eb6ddbd" />


### 🛡️ Fraud Detection
- Real-time alerts for smart contract risks
- Contract vulnerability scanning
- Risk analysis of NFTs and wallets
- Multilingual support for global users
  <img width="1919" height="981" alt="Fraud_dec1" src="https://github.com/user-attachments/assets/6170f992-ce1f-4e9a-a2ae-e7ba0534250b" />
  <img width="1919" height="985" alt="Fraud_2" src="https://github.com/user-attachments/assets/a23b6708-ad7e-4193-8e28-273f3d44a5b2" />


### 🎨 NFT Market Analytics
- NFT auditing and trend tracking
- Whale wallet monitoring
- Interactive dashboards powered by Recharts & D3.js
- AI-generated recommendations
  <img width="1414" height="794" alt="NFT_Analytics" src="https://github.com/user-attachments/assets/b19daade-2568-4d8a-95ea-a4010b348bdb" />
<img width="1919" height="982" alt="NFT_Analytics2" src="https://github.com/user-attachments/assets/5c712138-dfa5-4a99-81eb-b741b047c9aa" />


### 💬 Telegram Bot Integration
- Access our AI-powered NFT Bot: [@xcrunch_bot](https://t.me/xcrunch_bot)
- Real-time DeFi alerts in Telegram
- Smart investment suggestions
- Instant fraud detection alerts
- Interactive bot commands & multilingual support
<img width="800" height="516" alt="image" src="https://github.com/user-attachments/assets/32b24c51-2a70-4f65-851b-b3186e0a4cce" />
<img width="1522" height="985" alt="image" src="https://github.com/user-attachments/assets/7731c3fb-bf35-47db-ba2b-eae2dd91f18d" />

---

## 🧭 Core Principles

1. **Full Transparency** — Public ledger accountability  
2. **Military-grade Security** — Advanced protection protocols  
3. **AI-Powered Analytics** — Smart, data-driven decisions  
4. **Multi-Chain Support** — Ethereum, Polygon, Avalanche, Linea

---
## Smart Contract Integration

XCrunchHub utilizes blockchain technology for secure and transparent subscription management:

### Subscription Smart Contract

Our `Subscription.sol` contract manages user subscriptions with the following features:

- **Flexible Subscription Plans**: Weekly, monthly, and yearly options with different pricing tiers
- **Automatic Duration Management**: Extends existing subscriptions or creates new ones
- **Transparent Pricing**: All subscription costs are publicly visible on the blockchain
- **Owner Controls**: Allows for price updates and fund management by contract owner
- **Event Logging**: Emits events for subscriptions, price updates, and withdrawals for full transparency

```solidity
// Key functions include:
function subscribe(uint8 _plan) external payable;
function isSubscribed(address _user) external view returns (bool);
function updatePrices(uint256 _priceWeek, uint256 _priceMonth, uint256 _priceYear) external onlyOwner;
```

## Subscription Model

XCrunchHub offers flexible subscription options to access premium features:
- Weekly plans for short-term needs (0.01 ETH)
- Monthly subscriptions for regular users (0.03 ETH)
- Annual plans with the best value (0.3 ETH)

- All subscriptions are managed through our secure blockchain-based subscription system, ensuring transparency and control over your membership.

<img width="800" height="409" alt="image" src="https://github.com/user-attachments/assets/2d101166-7e0e-4c3a-a1d1-14169f453dcc" />


## 🔗 API Integration

### 🔄 Backend Endpoints
```bash
/Token                             → Token data across chains  
/Pool                              → Pool analytics and liquidity info  
/Token/:blockchain/:tokenId       → Token detail view  
/pooldetails/:blockchain/:address → Pool-level insights  
/poolmetadata/:blockchain/:addr   → Pool metadata  
/api/wallet-balance/:address      → Wallet cross-chain analyzer  


### External API Integrations

- **UnleashNFTs API** - Powers our NFT analytics and blockchain data
- **Etherscan API** - Provides transaction and contract verification data
- **Google Generative AI** - Enhances our AI analytics capabilities
- **Groq API** - Powers advanced natural language processing for insights

## Project Structure

```
├── Backend/            # Backend API services
├── Subscription.sol    # Smart contract for subscription management
├── animation/          # Animation assets for the UI
├── artifacts/          # Smart contract artifacts
└── thirdweb-app/       # Frontend application
    ├── src/
    │   ├── App.jsx     # Main application component
    │   ├── assets/     # Static assets
    │   ├── components/ # UI components
    │   └── ...         # Other source files
    └── ...             # Configuration files
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or other Web3 wallet

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/XCrunchHub.git
   cd XCrunchHub
   ```

2. Install dependencies for the frontend
   ```bash
   cd thirdweb-app
   npm install
   # or
   yarn install
   ```

3. Install dependencies for the backend
   ```bash
   cd ../Backend
   npm install
   # or
   yarn install
   ```

4. Set up environment variables
   - Create a `.env` file in the `thirdweb-app` directory based on the `.env.example` template
   - Create a `.env` file in the `Backend` directory based on the `.env.example` template

### Running the Application

1. Start the backend server
   ```bash
   cd Backend
   npm run dev
   # or
   yarn dev
   ```

2. Start the frontend application
   ```bash
   cd thirdweb-app
   npm run dev
   # or
   yarn dev
   ```

3. Open your browser and navigate to `http://localhost:5173

## 🧱 Technologies Used

- 🚀 **Frontend**: React, Tailwind CSS, Vite  
- ⚙️ **Backend**: Node.js, Express  
- ⛓️ **Blockchain**: Ethereum, Polygon, Avalanche, Linea  
- 💾 **Smart Contracts**: Solidity  
- 🌐 **Web3 Integration**: Thirdweb SDK  
- 📊 **Data Visualization**: Recharts, D3.js  

---

## 🤝 Contributing

We welcome contributions to **XCrunchHub**!  
Feel free to fork the repo, make changes, and submit a **Pull Request**.  
Let’s build the future of DeFi together 💪

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for full details.

---

## 👨‍💻 Creators

### 🧠 Ronak Agrawal
- 🔗 GitHub: [Ronak2027](https://github.com/Ronak2027)  
- 🔗 LinkedIn: [Ronak Agrawal](https://linkedin.com/in/ronak-agrawal-556657288)

### 🧠 Mayur Wagh
- 🔗 GitHub: [MayurWagh66](https://github.com/MayurWagh66)  
- 🔗 LinkedIn: [Mayur Wagh](https://linkedin.com/in/mayur-wagh2628)

---

## 📬 Contact

For any inquiries, feel free to reach out to us at:  
📧 **contact@xcrunchhub.com**

---

© 2024 **XCrunchHub** — All rights reserved.
