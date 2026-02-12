import React from 'react';

function DataTable({ data, maxRows = 10 }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#0b0b0e] border border-white/10 rounded-xl py-8 text-center">
        <p className="text-white/50 text-sm">No data to display</p>
      </div>
    );
  }

  const headers = Object.keys(data[0]);
  const displayData = data.slice(0, maxRows);
  const hasMore = data.length > maxRows;

  return (
    <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
        <h3 className="text-white font-medium">Data Preview</h3>
        <span className="text-xs text-white/50">
          Showing {displayData.length} of {data.length} rows
        </span>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-80">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-[#0b0b0e] z-10">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase whitespace-nowrap border-b border-white/10"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {displayData.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-white/5 transition"
              >
                {headers.map((header) => (
                  <td
                    key={header}
                    className="px-4 py-2 text-white/80 whitespace-nowrap"
                  >
                    {row[header] !== null &&
                    row[header] !== undefined &&
                    row[header] !== ''
                      ? String(row[header])
                      : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {hasMore && (
        <div className="px-4 py-2 text-center border-t border-white/10">
          <p className="text-xs text-white/40">
            + {data.length - maxRows} more rows not shown
          </p>
        </div>
      )}
    </div>
  );
}

export default DataTable;
