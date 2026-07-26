import './App.css';
import Header from './components/Header';
import { useState } from 'react';
import { checkConnection, retrievePublickey, getBalance, sendXlm } from './components/Freighter';

function App() {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState("0");
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [txResult, setTxResult] = useState(null);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [fundResult, setFundResult] = useState(null);

  const connectWallet = async () => {
    try {
      const allowed = await checkConnection();
      if (!allowed) return alert("Permission denied");

      const key = await retrievePublickey();
      const bal = await getBalance();

      setPublicKey(key);
      setBalance(Number(bal).toFixed(7));
      setConnected(true);
      setTxResult(null);
      setError('');
      setFundResult(null);
    } catch (e) {
      console.error(e);
      alert("Failed to connect wallet. Please make sure Freighter is installed and unlocked.");
    }
  };

  const handleDisconnect = () => {
    setConnected(false);
    setPublicKey("");
    setBalance("0");
    setTxResult(null);
    setError('');
    setFundResult(null);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    setTxResult(null);

    if (!destination || !amount) {
      setError('Please enter both destination address and amount.');
      return;
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Amount must be a number greater than 0.');
      return;
    }

    try {
      setIsSending(true);
      const hash = await sendXlm(destination, amount);
      setTxResult({
        success: true,
        hash: hash,
        message: 'Transaction submitted successfully!',
      });
      setDestination('');
      setAmount('');
      const bal = await getBalance();
      setBalance(Number(bal).toFixed(7));
    } catch (err) {
      setError(err.message || 'Transaction failed. Please try again.');
      setTxResult({
        success: false,
        message: err.message || 'Transaction failed',
      });
    } finally {
      setIsSending(false);
    }
  };

  const fundAccount = async () => {
    if (!publicKey) return;
    setError('');
    setFundResult(null);
    setIsFunding(true);
    try {
      const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
      const data = await response.json();
      if (data.balance) {
        setFundResult({
          success: true,
          message: `Funded! New balance: ${data.balance} XLM`,
        });
        const bal = await getBalance();
        setBalance(Number(bal).toFixed(7));
      } else {
        setFundResult({
          success: false,
          message: 'Funding failed. Please try again.',
        });
      }
    } catch (err) {
      setFundResult({
        success: false,
        message: 'Failed to fund account from Friendbot.',
      });
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <Header
        connected={connected}
        publicKey={publicKey}
        balance={balance}
        onConnect={connectWallet}
        onDisconnect={handleDisconnect}
      />
      <main className="p-8">
        <h1 className="text-3xl font-bold underline text-white">
          Send XLM Payment
        </h1>

        {connected && (
          <div className="mt-6 max-w-md mx-auto">
            <button
              onClick={fundAccount}
              disabled={isFunding}
              className="w-full py-2 bg-yellow-600 rounded hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isFunding ? 'Funding Account...' : 'Fund Testnet Account (Friendbot)'}
            </button>
            {fundResult && (
              <div className={`mt-2 p-3 rounded text-sm ${fundResult.success ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                {fundResult.message}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSend} className="mt-8 max-w-md mx-auto bg-gray-500 p-6 rounded-lg">
          <div className="mb-4">
            <label className="block text-white mb-2">Destination Address</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="G..."
              className="w-full p-2 rounded text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Amount (XLM)</label>
            <input
              type="number"
              step="0.0000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0000000"
              className="w-full p-2 rounded text-black"
            />
          </div>

          <button
            type="submit"
            disabled={isSending || !connected}
            className="w-full py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isSending ? 'Sending...' : connected ? 'Send XLM' : 'Connect Wallet First'}
          </button>
        </form>

        {error && (
          <div className="mt-4 max-w-md mx-auto bg-red-600 text-white p-4 rounded">
            {error}
          </div>
        )}

        {txResult && (
          <div className={`mt-4 max-w-md mx-auto p-4 rounded ${txResult.success ? 'bg-green-600' : 'bg-red-600'} text-white`}>
            <p className="font-bold">{txResult.success ? 'Success!' : 'Failed'}</p>
            <p className="text-sm mt-1">{txResult.message}</p>
            {txResult.hash && (
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txResult.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline mt-2 block"
              >
                View on Stellar Explorer
              </a>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
