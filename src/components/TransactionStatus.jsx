import { getExplorerUrl } from '../services/soroban';

export default function TransactionStatus({ status, hash, message }) {
  if (!status && !hash) return null;

  const statusColors = {
    Preparing: 'bg-gray-600',
    'Waiting for wallet approval': 'bg-yellow-600',
    Submitted: 'bg-blue-600',
    Confirmed: 'bg-green-600',
    Failed: 'bg-red-600',
  };

  return (
    <div className={`mt-4 p-4 rounded text-white ${statusColors[status] || 'bg-gray-600'}`}>
      <p className="font-bold">{status}</p>
      {message && <p className="text-sm mt-1">{message}</p>}
      {hash && (
        <a
          href={getExplorerUrl(hash)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline mt-2 block"
        >
          View on Stellar Explorer
        </a>
      )}
    </div>
  );
}
