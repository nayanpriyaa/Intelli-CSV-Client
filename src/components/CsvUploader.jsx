import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle } from "lucide-react";
import Papa from "papaparse";
import DataAnalyzer from "./DataAnalyzer";
import DataTable from "./DataTable";

function CsvUploader({ onUpload }) {
  const [csvData, setCsvData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.name.endsWith(".csv")) {
        setError("Please upload a valid CSV file");
        return;
      }

      setLoading(true);
      setError("");
      setFileName(file.name);

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.errors.length) {
            setError("Failed to parse CSV file");
            setLoading(false);
            return;
          }

          setCsvData(result.data);
          onUpload(result.data, file);
          setLoading(false);
        },
        error: () => {
          setError("Failed to parse CSV file");
          setLoading(false);
        },
      });
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept: { "text/csv": [".csv"] },
      multiple: false,
    });

  return (
    <div className="space-y-8">
      {/* DROPZONE */}
      <motion.div
        {...getRootProps()}
        className={`relative border border-dashed rounded-2xl p-10 cursor-pointer transition ${
          isDragActive
            ? "border-cyan-400 bg-cyan-400/5"
            : "border-white/15 hover:border-cyan-400/60"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center text-center gap-4">
          {/* Icon */}
          <motion.div
            animate={
              isDragActive
                ? { scale: 1.1 }
                : { scale: 1 }
            }
            transition={{ duration: 0.2 }}
            className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center"
          >
            <UploadCloud className="text-cyan-400" size={28} />
          </motion.div>

          {/* Text */}
          <div>
            <p className="text-white font-medium">
              {isDragActive
                ? "Drop your CSV here"
                : "Upload your CSV file"}
            </p>
            <p className="text-white/50 text-sm mt-1">
              Drag & drop or click to browse
            </p>
          </div>

          {/* Illustration (optional) */}
          <img
            src="/illustrations/upload.svg"
            alt=""
            className="w-40 opacity-80 pointer-events-none"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      </motion.div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="flex items-center gap-3 text-white/60">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          Processing CSV…
        </div>
      )}

      {/* SUCCESS */}
      {csvData && !loading && (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle size={18} />
            <span className="text-sm">
              {fileName} uploaded successfully
            </span>
          </div>

          {/* Analyzer */}
          <DataAnalyzer data={csvData} />

          {/* Preview Table */}
          <DataTable data={csvData} maxRows={8} />
        </motion.div>
      )}
    </div>
  );
}

export default CsvUploader;
