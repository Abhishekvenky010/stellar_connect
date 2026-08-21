import ReportCard from '../components/ReportCard';
import TransactionStatus from '../components/TransactionStatus';
import { getReport, confirmRecovery, getTransactionStatus } from '../services/soroban';
import { useState, useEffect } from 'react';

export default function ReportDetails({ reportId, publicKey, onBack }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionStatus, setActionStatus] = useState(null);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getReport(reportId, publicKey);
      setReport(data);
    } catch (e) {
      setError('Failed to load report: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRecovery = async () => {
    setActionStatus({ status: 'Preparing transaction' });
    try {
      const result = await confirmRecovery(publicKey, reportId);
      setActionStatus({
        status: 'Submitted',
        hash: result.sendTransactionResponse?.hash,
        message: 'Recovery confirmed!',
      });
      loadReport();
    } catch (e) {
      setActionStatus({
        status: 'Failed',
        message: e.message || 'Failed to confirm recovery',
      });
    }
  };

  if (loading) return <div className="text-gray-400">Loading report...</div>;
  if (error) return <div className="bg-red-600 text-white p-4 rounded">{error}</div>;
  if (!report) return <div className="text-gray-400">Report not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 text-white"
      >
        Back to Reports
      </button>

      <TransactionStatus {...actionStatus} />

      <ReportCard
        report={report}
        showAction={false}
      />

      {report.status === 1 && report.owner === publicKey && (
        <button
          onClick={handleConfirmRecovery}
          className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500 text-white"
        >
          Confirm Recovery
        </button>
      )}

      {report.status === 1 && report.owner !== publicKey && (
        <div className="mt-4 bg-blue-600 text-white p-4 rounded">
          Waiting for owner to confirm recovery
        </div>
      )}

      {report.status === 2 && (
        <div className="mt-4 bg-green-600 text-white p-4 rounded">
          Item has been recovered!
        </div>
      )}
    </div>
  );
}
