import TransactionStatus from '../components/TransactionStatus';
import { createReport, getTransactionStatus } from '../services/soroban';
import { useState } from 'react';

export default function CreateReport({ publicKey, onNavigate }) {
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus(null);

    if (!itemName || !location || !description) {
      setError('All fields are required');
      return;
    }

    setSubmitting(true);
    setStatus({ status: 'Preparing transaction' });

    try {
      const result = await createReport(publicKey, itemName, location, description);
      setStatus({
        status: 'Submitted',
        hash: result.sendTransactionResponse?.hash,
        message: 'Report created successfully!',
      });
      setItemName('');
      setLocation('');
      setDescription('');
    } catch (e) {
      setStatus({
        status: 'Failed',
        message: e.message || 'Failed to create report',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => onNavigate('home')}
        className="mb-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 text-white"
      >
        Back to Home
      </button>

      <h2 className="text-3xl font-bold text-white mb-6">Create Lost Item Report</h2>

      <TransactionStatus {...status} />

      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-700 p-6 rounded-lg">
        <div className="mb-4">
          <label className="block text-white mb-2">Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Black Wallet"
            className="w-full p-2 rounded text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Library"
            className="w-full p-2 rounded text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the lost item..."
            rows={4}
            className="w-full p-2 rounded text-black"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white"
        >
          {submitting ? 'Creating Report...' : 'Create Report'}
        </button>
      </form>
    </div>
  );
}
