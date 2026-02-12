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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import html2canvas from 'html2canvas';

function ChartRenderer({ chart, csvData = [], onEdit, onDelete }) {
  const chartRef = useRef(null);
  const { spec } = chart;

  const color = spec.color || '#22d3ee';

  /* ---------- DATA PREP ---------- */

  const prepareData = () => {
    if (!csvData.length) return [];

    const { type, xColumn, yColumn } = spec;

    if (type === 'pie') {
      const counts = {};
      csvData.forEach((row) => {
        const key = row[xColumn];
        if (key != null) counts[key] = (counts[key] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({
        name,
        value,
      }));
    }

    const isNumeric = csvData.some(
      (row) => !isNaN(Number(row[yColumn]))
    );

    if (isNumeric) {
      return csvData
        .map((row) => ({
          x: row[xColumn],
          y: Number(row[yColumn]),
        }))
        .filter((d) => d.x != null && !isNaN(d.y));
    }

    const counts = {};
    csvData.forEach((row) => {
      const key = row[xColumn];
      if (key != null) counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts).map(([x, y]) => ({ x, y }));
  };

  const data = prepareData();

  /* ---------- EXPORT ---------- */

  const exportPNG = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: '#0b0b0e',
      scale: 4,
    });

    const link = document.createElement('a');
    link.download = `${spec.title || 'chart'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const exportSVG = () => {
    const svg = chartRef.current?.querySelector('svg');
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], {
      type: 'image/svg+xml;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${spec.title || 'chart'}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- RENDER ---------- */

  if (!data.length) {
    return (
      <div className="bg-[#0b0b0e] border border-white/10 rounded-xl p-10 text-center text-white/50">
        No data available
      </div>
    );
  }

  const Wrapper = ({ children }) => (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  );

  const common = {
    data,
    margin: { top: 20, right: 30, left: 10, bottom: 10 },
  };

  const axisStyle = {
    stroke: '#9ca3af',
    fontSize: 12,
  };

  const gridStyle = {
    stroke: '#ffffff15',
  };

  const tooltipStyle = {
    backgroundColor: '#111116',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff',
  };

  const renderChart = () => {
    switch (spec.type) {
      case 'bar':
        return (
          <Wrapper>
            <BarChart {...common}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="x" {...axisStyle} />
              <YAxis {...axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="y" fill={color} radius={[6, 6, 0, 0]} />
            </BarChart>
          </Wrapper>
        );

      case 'line':
        return (
          <Wrapper>
            <LineChart {...common}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="x" {...axisStyle} />
              <YAxis {...axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line
                dataKey="y"
                stroke={color}
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </Wrapper>
        );

      case 'area':
        return (
          <Wrapper>
            <AreaChart {...common}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="x" {...axisStyle} />
              <YAxis {...axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area
                dataKey="y"
                stroke={color}
                fill={color}
                fillOpacity={0.25}
              />
            </AreaChart>
          </Wrapper>
        );

      case 'pie':
        return (
          <Wrapper>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </Wrapper>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={chartRef}
      className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-4 shadow-lg"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-medium truncate">
          {spec.title}
        </h3>

        <div className="flex gap-2">
          <button className="icon-btn" onClick={exportPNG}>PNG</button>
          <button className="icon-btn" onClick={exportSVG}>SVG</button>
          <button className="icon-btn" onClick={onEdit}>✏️</button>
          <button className="icon-btn danger" onClick={onDelete}>🗑️</button>
        </div>
      </div>

      {renderChart()}

      <div className="mt-2 text-xs text-white/40">
        X: {spec.xColumn} • Y: {spec.yColumn || 'count'}
      </div>
    </div>
  );
}

export default ChartRenderer;
