import React, { useRef } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import html2canvas from 'html2canvas';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

function ChartRenderer({ chart, csvData, onEdit, onDelete }) {
  const chartRef = useRef(null);
  const { spec } = chart;

  // Prepare data based on chart type
  const prepareData = () => {
    if (!csvData || csvData.length === 0) return [];

    const { type, xColumn, yColumn } = spec;

    if (type === 'pie') {
      // Aggregate data for pie chart
      const counts = {};
      csvData.forEach((row) => {
        const key = row[xColumn];
        if (key !== null && key !== undefined) {
          counts[key] = (counts[key] || 0) + 1;
        }
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    if (type === 'histogram') {
      // Create histogram bins
      const values = csvData
        .map((row) => Number(row[yColumn]))
        .filter((v) => !isNaN(v));
      
      if (values.length === 0) return [];

      const min = Math.min(...values);
      const max = Math.max(...values);
      const binCount = 10;
      const binSize = (max - min) / binCount;

      const bins = Array(binCount).fill(0);
      values.forEach((value) => {
        const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
        bins[binIndex]++;
      });

      return bins.map((count, index) => ({
        range: `${(min + index * binSize).toFixed(1)}-${(min + (index + 1) * binSize).toFixed(1)}`,
        count,
      }));
    }

    if (type === 'treemap') {
      // Aggregate data for treemap
      const grouped = {};
      csvData.forEach((row) => {
        const category = row[xColumn];
        const value = Number(row[yColumn]);
        if (category && !isNaN(value)) {
          grouped[category] = (grouped[category] || 0) + value;
        }
      });
      return Object.entries(grouped).map(([name, size]) => ({ name, size }));
    }

    // Standard data mapping for other chart types
    return csvData
      .map((row) => ({
        [xColumn]: row[xColumn],
        [yColumn]: Number(row[yColumn]),
      }))
      .filter((row) => row[xColumn] !== null && !isNaN(row[yColumn]));
  };

  const data = prepareData();

  // Export chart as PNG
  const handleExport = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `${spec.title || 'chart'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to export chart:', error);
      alert('Failed to export chart');
    }
  };

  // Render appropriate chart based on type
  const renderChart = () => {
    if (data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available for this chart
        </div>
      );
    }

    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (spec.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={spec.xColumn} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={spec.yColumn} fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={spec.xColumn} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={spec.yColumn} stroke="#0ea5e9" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={spec.xColumn} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={spec.yColumn} fill="#0ea5e9" stroke="#0ea5e9" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={spec.xColumn} name={spec.xColumn} />
              <YAxis dataKey={spec.yColumn} name={spec.yColumn} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Data Points" data={data} fill="#0ea5e9" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'histogram':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'treemap':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <Treemap
              data={data}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#0ea5e9"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Treemap>
          </ResponsiveContainer>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="card animate-fade-in" ref={chartRef}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{spec.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="text-green-600 hover:text-green-700"
            title="Export as PNG"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
          <button
            onClick={onEdit}
            className="text-primary-600 hover:text-primary-700"
            title="Edit chart"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-700"
            title="Delete chart"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {renderChart()}

      <div className="mt-2 text-xs text-gray-500">
        {spec.type === 'pie'
          ? `Category: ${spec.xColumn}`
          : `X: ${spec.xColumn} | Y: ${spec.yColumn}`}
      </div>
    </div>
  );
}

export default ChartRenderer;