import React, { useMemo } from 'react';

function DataAnalyzer({ data }) {
  const analysis = useMemo(() => {
    if (!data || data.length === 0) return null;

    const headers = Object.keys(data[0]);
    const rowCount = data.length;
    const columnCount = headers.length;

    // Analyze column types
    const columnTypes = {};
    const columnStats = {};

    headers.forEach((header) => {
      const values = data.map((row) => row[header]).filter((v) => v !== null && v !== undefined && v !== '');
      const numericValues = values.filter((v) => typeof v === 'number' || !isNaN(Number(v)));

      if (numericValues.length > values.length * 0.8) {
        columnTypes[header] = 'numeric';
        const numbers = numericValues.map(Number);
        columnStats[header] = {
          min: Math.min(...numbers),
          max: Math.max(...numbers),
          avg: numbers.reduce((a, b) => a + b, 0) / numbers.length,
        };
      } else {
        columnTypes[header] = 'text';
        columnStats[header] = {
          unique: new Set(values).size,
        };
      }
    });

    return {
      rowCount,
      columnCount,
      headers,
      columnTypes,
      columnStats,};
  }, [data]);

  if (!analysis) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Analysis</h3>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-primary-50 p-4 rounded-lg">
          <p className="text-sm text-primary-600 font-medium">Rows</p>
          <p className="text-2xl font-bold text-primary-900">{analysis.rowCount}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Columns</p>
          <p className="text-2xl font-bold text-green-900">{analysis.columnCount}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Numeric</p>
          <p className="text-2xl font-bold text-purple-900">
            {Object.values(analysis.columnTypes).filter((t) => t === 'numeric').length}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm text-orange-600 font-medium">Text</p>
          <p className="text-2xl font-bold text-orange-900">
            {Object.values(analysis.columnTypes).filter((t) => t === 'text').length}
          </p>
        </div>
      </div>

      {/* Column Details */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Column Details</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Column
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Statistics
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analysis.headers.map((header) => (
                <tr key={header}>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">{header}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        analysis.columnTypes[header] === 'numeric'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {analysis.columnTypes[header]}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {analysis.columnTypes[header] === 'numeric' ? (
                      <div className="text-xs">
                        <span>Min: {analysis.columnStats[header].min.toFixed(2)}</span>
                        <span className="mx-2">|</span>
                        <span>Max: {analysis.columnStats[header].max.toFixed(2)}</span>
                        <span className="mx-2">|</span>
                        <span>Avg: {analysis.columnStats[header].avg.toFixed(2)}</span>
                      </div>
                    ) : (
                      <div className="text-xs">
                        {analysis.columnStats[header].unique} unique values
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DataAnalyzer;