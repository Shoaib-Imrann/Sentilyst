// src/pages/SentilystDashboard.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import {
  Search,
  TrendingUp,
  PieChart,
  Activity,
  Briefcase,
  ArrowRight,
  CircleArrowUp,
  CircleHelp,
} from "lucide-react";
import { AppContext } from "../Context/AppContext";
import Banner from "../components/Banner";

export default function SentilystDashboard() {
  const navigate = useNavigate();
  const { setAnalysisData, searchQuery, setSearchQuery, analyzedTabs, fetchAnalyzedTabs } =
    useContext(AppContext);
  const [newsData, setNewsData] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(null);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [inputFlash, setInputFlash] = useState(false);

  // Categories with their corresponding icons and colors
  const categories = [
    {
      id: "all",
      name: "All Deals",
      icon: <Activity size={12} />,
      bg: "bg-gray-100",
      text: "text-gray-800",
    },
    {
      id: "tech",
      name: "Tech",
      icon: <PieChart size={12} />,
      bg: "bg-blue-50",
      text: "text-blue-800",
    },
    {
      id: "finance",
      name: "Finance",
      icon: <TrendingUp size={12} />,
      bg: "bg-green-50",
      text: "text-green-800",
    },
    {
      id: "media",
      name: "Media",
      icon: <Briefcase size={12} />,
      bg: "bg-purple-50",
      text: "text-purple-800",
    },
    {
      id: "retail",
      name: "Retail",
      icon: <Briefcase size={12} />,
      bg: "bg-yellow-50",
      text: "text-yellow-800",
    },
  ];

  // Sample deals organized by category
  const dealsByCategory = {
    all: [
      { text: "Adobe acquiring Figma", category: "tech" },
      { text: "Microsoft buying Activision Blizzard", category: "tech" },
      { text: "Broadcom acquiring VMware", category: "tech" },
      { text: "JPMorgan Chase buying First Republic Bank", category: "finance" },
      { text: "Amazon acquiring One Medical", category: "retail" },
      { text: "Disney acquiring 21st Century Fox assets", category: "media" },
    ],
    tech: [
      { text: "Adobe acquiring Figma", category: "tech" },
      { text: "Microsoft buying Activision Blizzard", category: "tech" },
      { text: "Broadcom acquiring VMware", category: "tech" },
    ],
    finance: [
      { text: "JPMorgan Chase buying First Republic Bank", category: "finance" },
      { text: "Wells Fargo acquiring Wachovia", category: "finance" },
      { text: "Bank of America buying Merrill Lynch", category: "finance" },
    ],
    media: [
      { text: "Disney acquiring 21st Century Fox assets", category: "media" },
      { text: "Warner Bros merging with Discovery", category: "media" },
      { text: "Paramount Global merger talks", category: "media" },
    ],
    retail: [
      { text: "Amazon acquiring One Medical", category: "retail" },
      { text: "Walmart acquiring Flipkart", category: "retail" },
      { text: "Target acquiring Shipt", category: "retail" },
    ],
  };

  // Helper function to get category styles and icon
  const getCategoryStyles = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category
      ? { bg: category.bg, text: category.text, icon: category.icon }
      : {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: <Activity size={16} />,
        };
  };

  const setQuery = (prompt) => {
    setSearchQuery(prompt);
    setInputFlash(true);
    setTimeout(() => setInputFlash(false), 400);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setError(null);
    setLoadingAnalysis(true);
    setLoadingPhase("Scraping platforms...");

    const accessToken = localStorage.getItem("accessToken");

    try {
      // Simulate progress phases for better UX
      setTimeout(() => setLoadingPhase("Analyzing sentiment..."), 1000);
      setTimeout(() => setLoadingPhase("This might take a while..."), 2000);


      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/analyze`,
        { query: searchQuery.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAnalysisData(res.data);
      
      // Refresh the analyzed tabs list after successful analysis
      await fetchAnalyzedTabs();
      
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to fetch analysis. Please try again.");
    } finally {
      setLoadingPhase(null);
      setTimeout(() => setLoadingAnalysis(false), 2000);
    }
  };

  return (
    <>
    <div className="flex flex-col min-h-screen bg-gray-50 relative justify-center">
      <header className="fixed top-9 right-4 z-50">
        <button className="w-9 h-9 rounded-full flex items-center justify-center font-medium cursor-pointer hover:bg-gray-200">
          <Link to="/about"><CircleHelp className="text-gray-600" size={20} /></Link>
        </button>
      </header>

      <div className="max-w-4xl w-full mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center mt-10 md:mt-0  mb-8">
          <h1 className="text-4xl ptserif text-gray-800 mb-2 text-center">
            Sentilyst
          </h1>
          <p className="text-gray-600 mb-18 text-center max-w-xl">
            M&A Analysis Platform
          </p>

          {/* Enhanced Search Form */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            loading={loadingAnalysis}
            loadingPhase={loadingPhase}
            error={error}
          />

          {/* {loadingAnalysis && (
            <div className="flex flex-col items-center mt-3 space-y-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-0"></div>
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
          )} */}
        </div>

        {/* Deals Grid */}
        <div className="w-full mb-8">
          <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" />
            Try
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dealsByCategory[activeCategory].map((deal, i) => {
              const categoryStyle = getCategoryStyles(deal.category);

              return (
                <button
                  key={i}
                  onClick={() => setQuery(deal.text)}
                  className={`text-left px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group hover:shadow-md cursor-pointer
                    ${i > 3 ? "hidden lg:block" : ""}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div
                      className={` ${categoryStyle.bg} ${categoryStyle.text} text-xs px-2 flex gap-2 items-center py-1 rounded-full border-[0.1px] border-gray-200`}
                    >
                      <div>{categoryStyle.icon}</div>
                      <div className="text-[10px]">
                        {categories.find((cat) => cat.id === deal.category)
                          ?.name || "General"}
                      </div>
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
