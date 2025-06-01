// src/components/SearchBar.jsx
import React, { useState } from "react";
import { ArrowRight, CircleHelp } from "lucide-react";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  onSearch,
  loading,
  loadingPhase,
  error,
}) {
  const [inputFlash, setInputFlash] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setInputFlash(true);
    setTimeout(() => setInputFlash(false), 400);
    onSearch(e);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto flex items-center gap-2 rounded-full overflow-hidden border border-gray-200 bg-white shadow-lg pl-2 pr-1 py-1 mb-8 transition-all"
      >
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search deals, companies, or sectors..."
            className={`w-full pl-6 pr-4 py-3 bg-white outline-none placeholder:text-gray-400 rounded-full transition-all duration-100 ${
              inputFlash ? "animate-pop" : ""
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gray-950 hover:bg-gray-800 text-white rounded-full px-4 py-3 flex items-center gap-2 transition-colors duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {!loading ? (
            <>
              <span className="hidden sm:inline">Analyze</span>
              <ArrowRight size={18} />
            </>
          ) : (
            <div className="w-4 h-4 border-2 border-t-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          )}
        </button>
      </form>

      {loading && (
        <div className="flex flex-col items-center mt-3 space-y-2">
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-300"></div>
          </div>
          <p className="text-sm text-gray-600">{loadingPhase}</p>
        </div>
      )}
      {error && (
        <div className="mt-3 text-red-500 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
          {error}
        </div>
      )}
    </>
  );
}
