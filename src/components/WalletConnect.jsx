import { useState } from 'react';
import { connectFreighter, connectXbull } from '../services/wallet';

export default function WalletConnect({ onConnect, onDisconnect, connected, publicKey, balance }) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async (walletType) => {
    setConnecting(true);
    setError('');
    try {
      let result;
      if (walletType === 'freighter') {
        result = await connectFreighter();
      } else {
        result = await connectXbull();
      }
      onConnect(result.wallet, result.publicKey);
    } catch (e) {
      setError(e.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {connected ? (
        <>
          <div className="text-sm text-gray-300">
            {`${publicKey?.slice(0, 4)}...${publicKey?.slice(-4)}`}
          </div>
          <div className="text-sm text-gray-400">
            Balance: {balance} XLM
          </div>
          <button
            onClick={onDisconnect}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
          >
            Disconnect
          </button>
        </>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => handleConnect('freighter')}
            disabled={connecting}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {connecting ? 'Connecting...' : 'Freighter'}
          </button>
          <button
            onClick={() => handleConnect('xbull')}
            disabled={connecting}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {connecting ? 'Connecting...' : 'xBull'}
          </button>
        </div>
      )}
      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}
    </div>
  );
}
