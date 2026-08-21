import ReportCard from '../components/ReportCard';
import TransactionStatus from '../components/TransactionStatus';
import { getReports, markFound, getTransactionStatus } from '../services/soroban';
import { useState, useEffect } from 'react';

export default function Reports({ publicKey, onNavigate }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionStatus, setActionStatus] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getReports(publicKey);
      setReports(data || []);
    } catch (e) {
      setError('Failed to load reports: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleMarkFound = async (report) => {
    setActionStatus({ status: 'Preparing transaction' });
    try {
      const result = await markFound(publicKey, report.id);
      setActionStatus({
        status: 'Submitted',
        hash: result.sendTransactionResponse?.hash,
        message: 'Item marked as found!',
      });
      loadReports();
    } catch (e) {
      setActionStatus({
        status: 'Failed',
        message: e.message || 'Failed to mark item as found',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Lost Reports</h2>
        <button
          onClick={() => onNavigate('create')}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-white"
        >
          Create Report
        </button>
      </div>

      <TransactionStatus {...actionStatus} />

      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-gray-400">No reports found. Be the first to create one!</div>
      ) : (
        <div>
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              actionLabel="Mark as Found"
              showAction={report.status === 0 && report.owner !== publicKey}
              onAction={handleMarkFound}
            />
          ))}
        </div>
      )}
    </div>
  );
}
