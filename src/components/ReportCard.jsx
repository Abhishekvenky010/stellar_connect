export default function ReportCard({ report, onAction, actionLabel, showAction = true }) {
  const statusColors = {
    0: 'bg-yellow-600',
    1: 'bg-blue-600',
    2: 'bg-green-600',
  };

  const statusLabels = {
    0: 'LOST',
    1: 'FOUND',
    2: 'RECOVERED',
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-white">{report.item_name}</h3>
        <span className={`px-2 py-1 rounded text-sm text-white ${statusColors[report.status] || 'bg-gray-600'}`}>
          {statusLabels[report.status] || 'UNKNOWN'}
        </span>
      </div>
      <div className="text-gray-300 mb-2">
        <p><span className="font-semibold">Location:</span> {report.location}</p>
        <p><span className="font-semibold">Description:</span> {report.description}</p>
        <p className="text-sm text-gray-400"><span className="font-semibold">Owner:</span> {report.owner.slice(0, 4)}...{report.owner.slice(-4)}</p>
        {report.finder && report.finder !== 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF' && (
          <p className="text-sm text-gray-400"><span className="font-semibold">Finder:</span> {report.finder.slice(0, 4)}...{report.finder.slice(-4)}</p>
        )}
        <p className="text-sm text-gray-500"><span className="font-semibold">Report ID:</span> #{report.id}</p>
      </div>
      {showAction && onAction && (
        <button
          onClick={() => onAction(report)}
          className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-white"
        >
          {actionLabel || 'Action'}
        </button>
      )}
    </div>
  );
}
