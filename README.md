# Stellar Connect - Simple Payment dApp

A beginner-friendly React dApp built on the Stellar Testnet for sending XLM payments. This project demonstrates wallet integration, balance fetching, transaction submission, and user feedback using the Freighter wallet and Tailwind CSS.

## Features

- **Freighter Wallet Setup**: Seamless integration with Freighter browser extension
- **Wallet Connection & Disconnection**: Connect and disconnect wallet from the UI
- **Real-time Balance Display**: View your XLM balance directly in the header
- **Send XLM Payments**: Transfer XLM to any Stellar testnet address
- **Transaction Feedback**: Visual success/failure states with transaction hashes and explorer links

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS v4
- @stellar/freighter-api
- @stellar/stellar-sdk

## Prerequisites

- Node.js >= 18
- npm or yarn
- [Freighter Wallet](https://www.freighter.app/) browser extension
- Freighter wallet set to **Testnet** mode

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/your-username/stellar_connect.git
cd stellar_connect
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

5. Make sure Freighter is installed, unlocked, and switched to Testnet mode

## Usage

1. Click **Connect Wallet** in the top-right corner
2. Approve the connection in the Freighter popup
3. Your address and XLM balance will appear in the header
4. Enter a destination Stellar address and amount in the send form
5. Click **Send XLM** and approve the transaction in Freighter
6. View the transaction result on Stellar Expert explorer

## Screenshots

### Wallet Connected State
![Wallet Connected](docs/screenshots/wallet-connected.png)
- The header displays the connected wallet address and current XLM balance
- The Disconnect button is visible

### Balance Displayed
![Balance Displayed](docs/screenshots/balance-displayed.png)
- The connected wallet's XLM balance is shown next to the truncated public key in the header

### Successful Testnet Transaction
![Successful Transaction](docs/screenshots/successful-transaction.png)
- The transaction form shows a green success banner after submission
- A link to the transaction hash on Stellar Expert is provided

### Transaction Result Shown to User
![Transaction Result](docs/screenshots/transaction-result.png)
- Success/failure state is clearly indicated with color-coded feedback
- The transaction hash or error message is displayed to the user

## Project Structure

```
stellar_connect/
├── public/
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Freighter.js
│   │   └── Header.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── index.jsx
│   ├── logo.svg
│   ├── reportWebVitals.js
│   └── setupTests.js
├── index.html
├── package.json
├── postcss.config.js
├── vite.config.js
└── README.md
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Notes

- This app operates on the **Stellar Testnet**. Ensure your Freighter wallet is switched to Testnet mode.
- You can request test XLM from the [Stellar Testnet Friendbot](https://friendbot.stellar.org/) if needed.

## License

MIT
