import React from "react";

const Header = ({ connected, publicKey, balance, walletType, onDisconnect, onNavigate }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <div className="flex items-center gap-6">
        <div className="text-xl font-bold cursor-pointer" onClick={() => onNavigate('home')}>
          Lost & Found dApp
        </div>
        {connected && (
          <nav className="flex gap-4">
            <button onClick={() => onNavigate('home')} className="text-sm hover:text-blue-400">
              Home
            </button>
            <button onClick={() => onNavigate('create')} className="text-sm hover:text-blue-400">
              Create Report
            </button>
            <button onClick={() => onNavigate('reports')} className="text-sm hover:text-blue-400">
              Reports
            </button>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
          {connected && (
            <>
              <div className="text-sm text-gray-300">
                {`${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`}
              </div>
              <div className="text-sm text-gray-400">
                {walletType && <span className="capitalize mr-2">({walletType})</span>}
                Balance: {balance} XLM
              </div>
            </>
          )}
        {connected ? (
          <button
            onClick={onDisconnect}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
