import React, { useMemo } from 'react';

function DataAnalyzer({ data }) {
  const analysis = useMemo(() => {
    if (!data || data.length === 0) return null;

    const headers = Object.keys(data[0]);
    const rowCount = data.length;
    const columnCount = headers.length;

    const columnTypes = {};
    const columnStats = {};

    headers.forEach((header) => {
      const values = data
        .map((row) => row[header])
        .filter((v) => v !== null && v !== undefined && v !== '');

      const numericValues = values.filter(
        (v) => typeof v === 'number' || !isNaN(Number(v))
      );

      if (numericValues.length > values.length * 0.8) {
        const numbers = numericValues.map(Number);
        columnTypes[header] = 'numeric';
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
      columnStats,
    };
  }, [data]);

  if (!analysis) return null;

  return (
    <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-5 space-y-6">
      {/* Header */}
      <h3 className="text-white font-medium text-lg">
        Dataset Overview
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Rows" value={analysis.rowCount} />
        <StatCard label="Columns" value={analysis.columnCount} />
        <StatCard
          label="Numeric"
          value={
            Object.values(analysis.columnTypes).filter(
              (t) => t === 'numeric'
            ).length
          }
          accent="cyan"
        />
        <StatCard
          label="Text"
          value={
            Object.values(analysis.columnTypes).filter(
              (t) => t === 'text'
            ).length
          }
          accent="orange"
        />
      </div>

      {/* Column Details */}
      <div>
        <h4 className="text-sm font-medium text-white/70 mb-3">
          Column Details
        </h4>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-2 text-left text-white/60">
                  Column
                </th>
                <th className="px-4 py-2 text-left text-white/60">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-white/60">
                  Statistics
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {analysis.headers.map((header) => (
                <tr key={header} className="hover:bg-white/5 transition">
                  <td className="px-4 py-2 text-white">
                    {header}
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        analysis.columnTypes[header] === 'numeric'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {analysis.columnTypes[header]}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-white/70">
                    {analysis.columnTypes[header] === 'numeric' ? (
                      <div className="text-xs space-x-2">
                        <span>
                          Min:{' '}
                          {analysis.columnStats[header].min.toFixed(2)}
                        </span>
                        <span>•</span>
                        <span>
                          Max:{' '}
                          {analysis.columnStats[header].max.toFixed(2)}
                        </span>
                        <span>•</span>
                        <span>
                          Avg:{' '}
                          {analysis.columnStats[header].avg.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs">
                        {analysis.columnStats[header].unique} unique
                        values
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

/* ---------- Small Stat Card ---------- */

function StatCard({ label, value, accent = 'default' }) {
  const accentMap = {
    default: 'text-white',
    cyan: 'text-cyan-400',
    orange: 'text-orange-400',
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-xs text-white/60 mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${accentMap[accent]}`}>
        {value}
      </p>
    </div>
  );
}

export default DataAnalyzer;
