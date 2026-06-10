import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  TrendingUp,
  CircleArrowUp,
  CircleHelp,
  Newspaper,
  Briefcase,
} from "lucide-react";
import SearchBar from "../components/SearchBar";

const categoryStyles = {
  tech: "bg-indigo-50/50 text-indigo-600 border-indigo-100",
  finance: "bg-emerald-50/50 text-emerald-600 border-emerald-100",
  media: "bg-purple-50/50 text-purple-600 border-purple-100",
  retail: "bg-amber-50/50 text-amber-600 border-amber-100",
  industrial: "bg-blue-50/50 text-blue-600 border-blue-100",
  healthcare: "bg-rose-50/50 text-rose-600 border-rose-100",
};

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(null);
  const [error, setError] = useState(null);
  const exampleDeals = [
    { text: "Netflix buying Warner Bros", category: "media" },
    { text: "Capital One buying Discover", category: "finance" },
    { text: "Palo Alto acquiring CyberArk", category: "tech" },
    { text: "IBM acquiring Confluent", category: "tech" },
    { text: "Kone acquiring TKE", category: "industrial" },
    { text: "Danaher acquiring Masimo", category: "healthcare" },
  ];

  const setQuery = (prompt) => {
    setSearchQuery(prompt);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setError(null);
    setLoadingAnalysis(true);
    setLoadingPhase("Fetching news articles...");

    try {
      setTimeout(() => setLoadingPhase("Analyzing sentiment..."), 1000);
      setTimeout(() => setLoadingPhase("This might take a while..."), 2000);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/analyze`,
        { query: searchQuery.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Store results in sessionStorage and navigate
      sessionStorage.setItem("analysisData", JSON.stringify(res.data));
      sessionStorage.setItem("searchQuery", searchQuery.trim());
      navigate("/results");
    } catch (err) {
      setError(
        err.response?.status === 429
          ? "Too many requests. Please wait a moment."
          : "Failed to fetch analysis. Please try again."
      );
    } finally {
      setLoadingPhase(null);
      setTimeout(() => setLoadingAnalysis(false), 1000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative justify-center">
      <header className="fixed top-4 right-4 z-50 flex gap-2">
        <Link
          to="/news"
          className="w-9 h-9 rounded-full flex items-center justify-center font-medium cursor-pointer hover:bg-gray-200"
        >
          <Newspaper className="text-gray-600" size={20} />
        </Link>
        <Link
          to="/about"
          className="w-9 h-9 rounded-full flex items-center justify-center font-medium cursor-pointer hover:bg-gray-200"
        >
          <CircleHelp className="text-gray-600" size={20} />
        </Link>
      </header>

      <div className="max-w-4xl w-full mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center mt-10 md:mt-0 mb-8">
          <h1 className="text-4xl ptserif text-gray-800 mb-2 text-center">
            Sentilyst
          </h1>
          <p className="text-gray-600 mb-18 text-center max-w-xl">
            M&A headline sentiment tracker.
          </p>

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            loading={loadingAnalysis}
            loadingPhase={loadingPhase}
            error={error}
          />
        </div>

        <div className="w-full mb-8">
          <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" />
            Try Examples
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exampleDeals.map((deal, i) => (
              <button
                key={i}
                onClick={() => setQuery(deal.text)}
                className={`text-left px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group hover:shadow-md cursor-pointer
                  ${i > 5 ? "hidden lg:block" : ""}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className={`text-xs px-2.5 py-1 flex gap-1.5 items-center rounded-full border ${categoryStyles[deal.category] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                    <Briefcase size={12} strokeWidth={2} />
                    <span className="text-[11px] font-semibold capitalize leading-none">{deal.category}</span>
                  </div>
                  <CircleArrowUp
                    size={18}
                    className="text-white fill-gray-900"
                  />
                </div>
                <span className="text-sm text-gray-800 group-hover:text-blue-700 transition-colors block mb-1">
                  {deal.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
