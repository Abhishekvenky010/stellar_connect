import { useState, useEffect } from 'react';
import Header from './components/Header';
import WalletConnect from './components/WalletConnect';
import TransactionStatus from './components/TransactionStatus';
import { getBalance } from './components/Freighter';
import { disconnectXbull } from './services/wallet';
import Home from './pages/Home';
import CreateReport from './pages/CreateReport';
import Reports from './pages/Reports';
import ReportDetails from './pages/ReportDetails';

function App() {
  const [connected, setConnected] = useState(false);
  const [walletType, setWalletType] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [balance, setBalance] = useState('0');
  const [page, setPage] = useState('home');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [error, setError] = useState('');
  const [txStatus, setTxStatus] = useState(null);

  const connectWallet = async (type, key) => {
    setWalletType(type);
    setPublicKey(key);
    setConnected(true);
    setError('');
    setTxStatus(null);
    try {
      const bal = await getBalance();
      setBalance(Number(bal).toFixed(7));
    } catch (e) {
      console.error('Failed to load balance', e);
    }
  };

  const handleDisconnect = async () => {
    await disconnectXbull();
    setConnected(false);
    setWalletType('');
    setPublicKey('');
    setBalance('0');
    setPage('home');
    setSelectedReportId(null);
    setError('');
    setTxStatus(null);
  };

  const handleNavigate = (targetPage) => {
    setPage(targetPage);
    setSelectedReportId(null);
    setError('');
  };

  const handleViewReport = (reportId) => {
    setSelectedReportId(reportId);
    setPage('details');
  };

  const renderPage = () => {
    switch (page) {
      case 'create':
        return <CreateReport publicKey={publicKey} onNavigate={handleNavigate} />;
      case 'reports':
        return <Reports publicKey={publicKey} onNavigate={handleNavigate} onViewReport={handleViewReport} />;
      case 'details':
        return <ReportDetails reportId={selectedReportId} publicKey={publicKey} onBack={() => handleNavigate('reports')} />;
      default:
        return <Home onNavigate={handleNavigate} connected={connected} publicKey={publicKey} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <Header
        connected={connected}
        publicKey={publicKey}
        balance={balance}
        walletType={walletType}
        onDisconnect={handleDisconnect}
        onNavigate={handleNavigate}
      />
      <main className="p-8">
        {connected ? (
          renderPage()
        ) : (
          <div className="max-w-md mx-auto mt-20 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Lost & Found dApp</h1>
            <p className="text-gray-300 mb-8">
              A decentralized Lost & Found platform powered by Stellar Soroban smart contracts.
            </p>
            <WalletConnect
              onConnect={connectWallet}
              onDisconnect={handleDisconnect}
              connected={connected}
              publicKey={publicKey}
              balance={balance}
            />
          </div>
        )}

        {error && (
          <div className="mt-4 max-w-md mx-auto bg-red-600 text-white p-4 rounded">
            {error}
          </div>
        )}

        <TransactionStatus {...txStatus} />
      </main>
    </div>
  );
}

export default App;
