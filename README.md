# Stellar Connect - Decentralized Lost & Found dApp

A Soroban-powered Lost & Found platform built on the Stellar Testnet. Report lost items, mark them as found, and confirm recoveries — all recorded immutably on the blockchain.

## Features

- **Multi-Wallet Support**: Connect with Freighter or xBull wallet
- **Create Lost Item Reports**: Store item name, location, and description on-chain
- **View Lost Reports**: Browse all lost item reports with owner, status, and finder details
- **Mark Item Found**: Any wallet can mark a lost item as found
- **Confirm Recovery**: Only the original owner can confirm item recovery
- **Transaction Status**: Real-time transaction tracking with explorer links
- **Error Handling**: Clear UI feedback for wallet, transaction, and contract errors
- **Smart Contract Events**: On-chain events for report creation, found, and recovery actions

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS v4
- @stellar/stellar-sdk v16
- @stellar/freighter-api
- @creit.tech/xbull-wallet-connect
- Soroban Rust SDK v27

## Soroban Contract

### Contract Address

```
CAIFCSOJYGP6I7U2GDZ646C4P5HMXCA4M2376J25S2F6ULDYNJHAXU7K
```

### Contract Functions

- `create_report(owner, item_name, location, description)` - Create a new lost item report
- `mark_found(caller, report_id)` - Mark an item as found
- `confirm_recovery(owner, report_id)` - Confirm item recovery (owner only)
- `get_report(report_id)` - Get a single report by ID
- `get_reports()` - Get all reports

### Contract Status Codes

- `0` - LOST
- `1` - FOUND
- `2` - RECOVERED

### Contract Errors

- `ReportNotFound` - Report does not exist
- `Unauthorized` - Caller is not authorized
- `InvalidStatus` - Invalid status transition
- `InvalidInput` - Empty input fields

### Events

- `ReportCreated` - Emitted when a new report is created
- `ItemFound` - Emitted when an item is marked as found
- `ItemRecovered` - Emitted when recovery is confirmed

## Deployment Details

### Deployer Account

```
GAY3G6VTLIHK5C4NLAJOG65YVYQAXG7LKFHTQPTQKCTX4TZACJAMJWCN
```

### Deployment Steps

1. Install Soroban CLI:
```bash
stellar --version
```

2. Set network to testnet:
```bash
stellar network use testnet
```

3. Build the contract:
```bash
cd contract
stellar contract build
```

4. Deploy to testnet:
```bash
stellar contract deploy --source deployer --network testnet
```

### Example Transaction Hashes

- Contract Deployment: `bc466da886568522331455d1fc7f14d8bbd9679c20efe03248a6310680f30654`
  - https://stellar.expert/explorer/testnet/tx/bc466da886568522331455d1fc7f14d8bbd9679c20efe03248a6310680f30654

- Contract WASM Upload: `249a9a020372353c2f6b11210f1fda0c36fc3b8ea80825d7de6b1643e58d93b6`
  - https://stellar.expert/explorer/testnet/tx/249a9a020372353c2f6b11210f1fda0c36fc3b8ea80825d7de6b1643e58d93b6

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

5. Make sure Freighter or xBull is installed, unlocked, and switched to Testnet mode

## Wallet Support

### Freighter

1. Install [Freighter Wallet](https://www.freighter.app/) browser extension
2. Create or import a wallet
3. Switch to **Testnet** mode
4. Fund your account using the Friendbot

### xBull

1. Install [xBull Wallet](https://xbull.app/) browser extension
2. Create or import a wallet
3. Switch to **Testnet** mode
4. Fund your account using the Friendbot

## Usage

1. Open the app and click **Freighter** or **xBull** to connect your wallet
2. Approve the connection in your wallet popup
3. Navigate to **Create Report** to submit a lost item report
4. Approve the transaction in your wallet
5. View all reports on the **Reports** page
6. Click **Mark as Found** on any lost item
7. Owners can confirm recovery from the report details page

## Error Handling

The application handles the following error cases:

1. **Wallet not connected** - Users must connect a wallet before interacting with the contract
2. **Transaction rejected by user** - If the user rejects the transaction in their wallet
3. **Contract execution failed** - If the Soroban contract returns an error
4. **Report not found** - When accessing a non-existent report
5. **Unauthorized** - When a non-owner tries to confirm recovery
6. **Invalid status transition** - When trying to mark an already found/recovered item
### Wallet Connected State
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4fd13aea-e993-4a3c-8b63-74dd3256ca6b" />

- The header displays the connected wallet address and current XLM balance
- The Disconnect button is visible

### Balance Displayed

- The connected wallet's XLM balance is shown next to the truncated public key in the header

### Successful Testnet Transaction
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/de96d202-077d-47d4-ab39-a176c2b27847" />

- The transaction form shows a green success banner after submission
- A link to the transaction hash on Stellar Expert is provided

### Transaction Result Shown to User

- Success/failure state is clearly indicated with color-coded feedback
- The transaction hash or error message is displayed to the user

## Project Structure

```
stellar_connect/
├── contract/
│   ├── Cargo.toml
│   ├── contracts/
│   │   └── lost-found/
│   │       ├── Cargo.toml
│   │       ├── src/
│   │       │   ├── lib.rs
│   │       │   └── test.rs
│   │       └── Makefile
│   └── bindings/
│       ├── dist/
│       ├── src/
│       └── package.json
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── WalletConnect.jsx
│   │   ├── ReportCard.jsx
│   │   └── TransactionStatus.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CreateReport.jsx
│   │   ├── Reports.jsx
│   │   └── ReportDetails.jsx
│   ├── services/
│   │   ├── soroban.js
│   │   └── wallet.js
│   ├── bindings/
│   │   └── index.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── index.jsx
├── index.html
├── package.json
├── postcss.config.js
├── vite.config.js
└── README.md
```

## Contract Tests

Run the Soroban contract unit tests:
```bash
cd contract/contracts/lost-found
cargo test
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Blockchain Explorer

View contract and transactions on Stellar Expert:
- Contract: https://stellar.expert/explorer/testnet/contract/CAIFCSOJYGP6I7U2GDZ646C4P5HMXCA4M2376J25S2F6ULDYNJHAXU7K
- Deployer: https://stellar.expert/explorer/testnet/account/GAY3G6VTLIHK5C4NLAJOG65YVYQAXG7LKFHTQPTQKCTX4TZACJAMJWCN

## Screenshots
<img width="1912" height="821" alt="image" src="https://github.com/user-attachments/assets/464708ff-6dd7-49aa-abdc-7e29c9a227cd" />

<img width="1910" height="782" alt="image" src="https://github.com/user-attachments/assets/a149e452-9795-46ce-a870-13ab08b9b40d" />


## Notes

- This app operates on the **Stellar Testnet**. Ensure your wallet is switched to Testnet mode.
- You can request test XLM from the [Stellar Testnet Friendbot](https://friendbot.stellar.org/) if needed.
- The contract is deployed and live on testnet.

## License

MIT
