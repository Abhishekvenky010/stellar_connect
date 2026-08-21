export default function Home({ onNavigate, connected, publicKey }) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-5xl font-bold text-white mb-4">
        Decentralized Lost & Found
      </h1>
      <p className="text-xl text-gray-300 mb-8">
        Report lost items, mark found items, and confirm recoveries on the Stellar blockchain.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-gray-700 p-6 rounded-lg">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">Report Lost Items</h3>
          <p className="text-gray-300">
            Create a permanent record of your lost item on the blockchain with details and location.
          </p>
        </div>

        <div className="bg-gray-700 p-6 rounded-lg">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-white mb-2">Mark Found</h3>
          <p className="text-gray-300">
            Anyone can mark an item as found, recording the finder's wallet on-chain.
          </p>
        </div>

        <div className="bg-gray-700 p-6 rounded-lg">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-white mb-2">Confirm Recovery</h3>
          <p className="text-gray-300">
            Original owners can confirm recovery, completing the item lifecycle.
          </p>
        </div>
      </div>

      {connected && (
        <div className="mt-12 flex gap-4 justify-center">
          <button
            onClick={() => onNavigate('create')}
            className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-500 text-white font-bold"
          >
            Create Report
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-6 py-3 bg-green-600 rounded hover:bg-green-500 text-white font-bold"
          >
            View Reports
          </button>
        </div>
      )}
    </div>
  );
}
