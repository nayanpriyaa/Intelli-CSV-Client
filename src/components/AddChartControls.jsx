import React, { useState, useEffect } from 'react';

function AddChartControls({ csvData, onAddChart, editingChart, onUpdateChart, onCancelEdit }) {
  const [chartType, setChartType] = useState('bar');
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [chartTitle, setChartTitle] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Get column names from CSV data
  const columns = csvData && csvData.length > 0 ? Object.keys(csvData[0]) : [];

  // Populate form when editing
  useEffect(() => {
    if (editingChart) {
      setChartType(editingChart.spec.type);
      setXColumn(editingChart.spec.xColumn || '');
      setYColumn(editingChart.spec.yColumn || '');
      setChartTitle(editingChart.spec.title || '');
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
      title: chartTitle || `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
    };

    if (editingChart) {
      onUpdateChart(editingChart.id, chartSpec);
    } else {
      onAddChart(chartSpec);
    }

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setChartType('bar');
    setXColumn('');
    setYColumn('');
    setChartTitle('');
    setShowForm(false);
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  if (!csvData || csvData.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingChart ? 'Edit Chart' : 'Add Chart'}
        </h3>
        {!showForm && !editingChart && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            + Add Chart
          </button>
        )}
      </div>

      {(showForm || editingChart) && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
          {/* Chart Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Type
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="input"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="area">Area Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="scatter">Scatter Plot</option>
              <option value="histogram">Histogram</option>
              <option value="treemap">Treemap</option>
            </select>
          </div>

          {/* Chart Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Title (Optional)
            </label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="input"
              placeholder="Enter chart title"
            />
          </div>

          {/* X Column */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {chartType === 'pie' ? 'Category Column' : 'X-Axis Column'}
            </label>
            <select
              value={xColumn}
              onChange={(e) => setXColumn(e.target.value)}
              className="input"
              required
            >
              <option value="">Select column...</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Y Column (not needed for pie charts) */}
          {chartType !== 'pie' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Y-Axis Column
              </label>
              <select
                value={yColumn}
                onChange={(e) => setYColumn(e.target.value)}
                className="input"
                required
              >
                <option value="">Select column...</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Chart Type Hints */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-800">
              {chartType === 'bar' && '📊 Bar Chart: Compare values across categories'}
              {chartType === 'line' && '📈 Line Chart: Show trends over time or sequence'}
              {chartType === 'area' && '📉 Area Chart: Display cumulative values over time'}
              {chartType === 'pie' && '🥧 Pie Chart: Show proportions of a whole'}
              {chartType === 'scatter' && '⚫ Scatter Plot: Show relationship between two variables'}
              {chartType === 'histogram' && '📊 Histogram: Display distribution of values'}
              {chartType === 'treemap' && '🗂️ Treemap: Show hierarchical data as nested rectangles'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button type="submit" className="btn btn-primary">
              {editingChart ? 'Update Chart' : 'Add Chart to Dashboard'}
            </button>
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddChartControls;