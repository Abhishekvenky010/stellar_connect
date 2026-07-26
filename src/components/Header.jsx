import React from "react";

const Header = ({ connected, publicKey, balance, onConnect, onDisconnect }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <div className="text-xl font-bold">Stellar dApp</div>

      <div className="flex items-center gap-4">
        {publicKey && (
          <>
            <div className="text-sm text-gray-300">
              {`${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`}
            </div>
            <div className="text-sm text-gray-400">
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
            onClick={onConnect}
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
