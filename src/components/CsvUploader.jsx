import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import DataAnalyzer from './DataAnalyzer';
import DataTable from './DataTable';

function CsvUploader({ onUpload }) {
  const [csvData, setCsvData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setLoading(true);
    setError('');
    setFileName(file.name);

    Papa.parse(file, {
      complete: (result) => {
        if (result.errors.length > 0) {
          setError('Error parsing CSV file');
          console.error(result.errors);
          setLoading(false);
          return;
        }

        setCsvData(result.data);
        onUpload(result.data, file);
        setLoading(false);
      },
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      error: (err) => {
        setError('Failed to parse CSV file');
        console.error(err);
        setLoading(false);
      },
    });
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400'
        }`}
      >
        <input {...getInputProps()} />
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? (
            <span className="text-primary-600 font-medium">Drop CSV file here</span>
          ) : (
            <>
              <span className="text-primary-600 font-medium">Click to upload</span> or drag and
              drop CSV file
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-gray-500">CSV files only (max 5MB)</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Processing CSV...</p>
        </div>
      )}

      {/* Data Preview */}
      {csvData && !loading && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Uploaded: {fileName}</h3>
            <button
              onClick={() => {
                setCsvData(null);
                setFileName('');
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear
            </button>
          </div>

          {/* Data Analyzer */}
          <DataAnalyzer data={csvData} />

          {/* Data Table Preview */}
          <DataTable data={csvData} maxRows={10} />
        </div>
      )}
    </div>
  );
}

export default CsvUploader;