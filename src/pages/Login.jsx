import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import TypingText from "../components/TypingText";
import { login } from "../services/auth";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(formData.email, formData.password);
      onLogin(res.user);
      navigate("/dashboards");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0b0b0e] overflow-hidden">

      {/* ---------- LEFT BACKGROUND VISUAL ---------- */}
      <div className="absolute inset-y-0 left-0 w-[55%] pointer-events-none z-0">

        {/* Ambient cyan glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-cyan-500/5 to-transparent blur-[140px]" />

        {/* Floating SVG */}
        <motion.img
          src="/illustrations/analytics.svg"
          alt="Analytics Illustration"
          className="
            absolute
            left-[-150px]
            top-[27%]
            -translate-y-1/2
            w-[720px]
            opacity-80
          "
          animate={{ y: [0, -14, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Hard fade before form */}
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#0b0b0e] to-transparent pointer-events-none" />
      </div>

      {/* ---------- CONTENT LAYER ---------- */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Empty left column to push form right */}
          <div />

          {/* ---------- RIGHT: LOGIN FORM ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">
                <TypingText
                  texts={[
                    "Intelli-CSV",
                    "Data. Visualized.",
                    "Insights. Simplified.",
                  ]}
                />
              </h1>

              <p className="text-white/50 text-sm">
                Sign in to continue
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label-dark">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-dark"
                  required
                />
              </div>

              <div>
                <label className="label-dark">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-dark"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full py-3 rounded-xl
                  bg-cyan-500 text-black font-medium
                  hover:bg-cyan-400
                  hover-lift focus-ring
                  disabled:opacity-60
                "
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-sm text-white/50">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-cyan-400 hover:underline">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;
