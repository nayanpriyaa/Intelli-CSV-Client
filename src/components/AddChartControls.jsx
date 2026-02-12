import React, { useState, useEffect } from 'react';

function AddChartControls({
  csvData,
  onAddChart,
  editingChart,
  onUpdateChart,
  onCancelEdit,
}) {
  const [chartType, setChartType] = useState('bar');
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [chartTitle, setChartTitle] = useState('');
  const [chartColor, setChartColor] = useState('#22d3ee');
  const [showForm, setShowForm] = useState(false);

  const columns =
    csvData && csvData.length > 0 ? Object.keys(csvData[0]) : [];

  useEffect(() => {
    if (editingChart) {
      setChartType(editingChart.spec.type);
      setXColumn(editingChart.spec.xColumn || '');
      setYColumn(editingChart.spec.yColumn || '');
      setChartTitle(editingChart.spec.title || '');
      setChartColor(editingChart.spec.color || '#22d3ee');
      setShowForm(true);
    }
  }, [editingChart]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!xColumn || (chartType !== 'pie' && !yColumn)) {
      alert('Please select required columns');
      return;
    }

    const chartSpec = {
      type: chartType,
      xColumn,
      yColumn: chartType === 'pie' ? xColumn : yColumn,
      title:
        chartTitle ||
        `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
      color: chartColor,
    };

    editingChart
      ? onUpdateChart(editingChart.id, chartSpec)
      : onAddChart(chartSpec);

    resetForm();
  };

  const resetForm = () => {
    setChartType('bar');
    setXColumn('');
    setYColumn('');
    setChartTitle('');
    setChartColor('#22d3ee');
    setShowForm(false);
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit?.();
  };

  if (!csvData || csvData.length === 0) return null;

  return (
    <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">
          {editingChart ? 'Edit Chart' : 'Charts'}
        </h3>

        {!showForm && !editingChart && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-medium 
           hover:bg-cyan-400 transition 
           hover-lift focus-ring active:scale-[0.98]"

          >
            + Add Chart
          </button>
        )}
      </div>

      {(showForm || editingChart) && (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 animate-fade-in"
        >
          {/* Chart Type */}
          <div>
            <label className="label-dark">Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="input-dark"
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="area">Area</option>
              <option value="pie">Pie</option>
              <option value="scatter">Scatter</option>
              <option value="histogram">Histogram</option>
              <option value="treemap">Treemap</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="label-dark">Chart Title</label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              placeholder="Optional title"
              className="input-dark"
            />
          </div>

          {/* Color */}
          <div className="flex items-center gap-4">
            <label className="label-dark">Accent Color</label>
            <input
              type="color"
              value={chartColor}
              onChange={(e) => setChartColor(e.target.value)}
              className="w-12 h-10 rounded border border-white/20 bg-transparent"
            />
          </div>

          {/* X Column */}
          <div>
            <label className="label-dark">
              {chartType === 'pie' ? 'Category Column' : 'X Axis'}
            </label>
            <select
              value={xColumn}
              onChange={(e) => setXColumn(e.target.value)}
              className="input-dark"
              required
            >
              <option value="">Select column</option>
              {columns.map((col) => (
                <option key={col}>{col}</option>
              ))}
            </select>
          </div>

          {/* Y Column */}
          {chartType !== 'pie' && (
            <div>
              <label className="label-dark">Y Axis</label>
              <select
                value={yColumn}
                onChange={(e) => setYColumn(e.target.value)}
                className="input-dark"
                required
              >
                <option value="">Select column</option>
                {columns.map((col) => (
                  <option key={col}>{col}</option>
                ))}
              </select>
            </div>
          )}

          {/* Hint */}
          <div className="text-xs text-white/60 bg-white/5 p-3 rounded-lg">
            {chartType === 'bar' && 'Compare values across categories'}
            {chartType === 'line' && 'Visualize trends over time'}
            {chartType === 'area' && 'Cumulative progression'}
            {chartType === 'pie' && 'Proportional distribution'}
            {chartType === 'scatter' && 'Relationship between variables'}
            {chartType === 'histogram' && 'Data distribution'}
            {chartType === 'treemap' && 'Hierarchical representation'}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition"
            >
              {editingChart ? 'Update Chart' : 'Add to Dashboard'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 rounded-lg border border-white/20 text-white/70 hover:bg-white/10 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddChartControls;
