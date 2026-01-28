import React from 'react';

function DataTable({ data, maxRows = 10 }) {
  if (!data || data.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }

  const headers = Object.keys(data[0]);
  const displayData = data.slice(0, maxRows);
  const hasMore = data.length > maxRows;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Data Preview</h3>
        <span className="text-sm text-gray-600">
          Showing {displayData.length} of {data.length} rows
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={header} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {row[header] !== null && row[header] !== undefined
                      ? String(row[header])
                      : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-500">
            + {data.length - maxRows} more rows not shown
          </p>
        </div>
      )}
    </div>
  );
}

export default DataTable;