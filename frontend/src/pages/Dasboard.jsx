// src/pages/Dashboard.jsx
import React, { useContext, useState } from "react";
import {
  ResponsiveContainer,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ExternalLink, Zap, AlignLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { FaReddit } from "react-icons/fa";
import { SiGooglenews } from "react-icons/si";
import SearchBar from "../components/SearchBar";
import { AppContext } from "../Context/AppContext";
import Banner from "../components/Banner";
import axios from "axios";

export default function Dashboard() {
  const { analysisData, setAnalysisData, searchQuery, setSearchQuery, fetchAnalyzedTabs } =
    useContext(AppContext);

  // search & analysis
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(null);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setError(null);
    setLoadingAnalysis(true);
    setLoadingPhase("Analyzing...");

    const accessToken = localStorage.getItem("accessToken");

    try {
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

      if (res.status >= 200 && res.status < 300) {
        setAnalysisData(res.data);
        // Refresh the analyzed tabs list after successful analysis
        await fetchAnalyzedTabs();
      } else {
        setError(
          `Failed to fetch analysis: Backend responded with status ${res.status}`
        );
        console.error(
          "Backend analysis request failed with status:",
          res.status,
          res.data
        );
      }
    } catch (error) {
      setError(`Failed to fetch analysis: ${error.message}`);
      console.error("Error during analysis request:", error);
    } finally {
      setLoadingPhase(null);
      setTimeout(() => setLoadingAnalysis(false), 2000);
    }
  };

  // extract analysisData
  const {
    sentiment_percentages = {},
    scraped_data = [],
    risk_level = 0,
  } = analysisData || {};

  // determine unique platforms
  const platforms = Array.from(
    new Set(
      scraped_data
        .map((post) => {
          const url = post.split(" - ")[1] || "";
          if (url.includes("reddit.com")) return "reddit";
          if (url.includes("news.google.com")) return "google";
          return null;
        })
        .filter(Boolean)
    )
  );

  // helper to render platform icon + label
  const renderLabel = (platform) => {
    switch (platform) {
      case "reddit":
        return (
          <span className="flex items-center gap-1 text-orange-600 bg-orange-50 text-xs font-semibold border-[0.1px] border-orange-600 px-2 py-1 rounded-full">
            <FaReddit size={14} /> Reddit
          </span>
        );
      case "google":
        return (
          <span className="flex items-center gap-1 text-blue-600 text-xs font-semibold border-[0.1px] bg-blue-50 border-blue-600 px-2 py-1 rounded-full">
            <SiGooglenews size={14} />
            News
          </span>
        );
      default:
        return null;
    }
  };

  const sentimentData = [
    {
      name: "Positive",
      value: sentiment_percentages.positive || 0,
      color: "#10B981",
    },
    {
      name: "Negative",
      value: sentiment_percentages.negative || 0,
      color: "#EF4444",
    },
  ];

  const risk = risk_level;
  const riskColor =
    risk < 30
      ? "text-green-500"
      : risk < 60
      ? "text-yellow-500"
      : "text-red-500";

  const redditCount = scraped_data.filter((post) =>
    post.includes("reddit.com")
  ).length;
  const googleCount = scraped_data.filter((post) =>
    post.includes("news.google.com")
  ).length;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="md:hidden p-4 bg-white shadow-sm flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          >
            {/* <AlignLeft size={20} /> */}
          </button>
          <Link to="/" className="text-xl ptserif font-semibold text-gray-800">Sentilyst</Link>
          <div className="w-8"></div> {/* Empty div for flex spacing */}
        </header>
        {/* <div className="flex md:hidden">
        <Banner  />
        </div> */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6 mt-3">
            {/* Search Bar */}
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              loading={loadingAnalysis}
              loadingPhase={loadingPhase}
              error={error}
            />

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-6 space-y-6">
                {/* Sentiment Analysis Card */}
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="px-4 py-3 rounded-t-xl border-b border-gray-100">
                  <h3 className="font-semibold text-lg text-gray-700">
                    Sentiment Analysis
                  </h3>
                  </div>
                  <div className="px-6 pb-6">

                  <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartPieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {sentimentData.map((entry, idx) => (
                            <Cell key={idx} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartPieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Sentiment Metrics */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {sentimentData.map((item) => (
                      <div
                        key={item.name}
                        className={`p-4 rounded-lg ${
                          item.name === "Positive" ? "bg-green-50" : "bg-red-50"
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <span
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-gray-700 font-medium">
                            {item.name}
                          </span>
                        </div>
                        <span
                          className={`md:text-xl font-bold ${
                            item.name === "Positive"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>

                {/* Risk Assessment Card */}
                <div className="bg-white rounded-xl shadow-sm h-[18.5rem]">
                  <div className="px-4 py-3 rounded-t-xl border-b border-gray-100">
                  <h3 className="font-semibold text-lg text-gray-700">
                    Risk Assessment
                  </h3>
                  </div>
                    <div className="px-6 pb-6">
                  <div className="flex items-end mt-6 mb-4">
                    <span className={`text-4xl font-semibold ${riskColor}`}>
                      {risk}
                      <span className="text-2xl ml-1">%</span>
                    </span>
                    <span className="ml-2 text-gray-500 text-sm">
                      Risk Level
                    </span>
                  </div>

                  {/* Risk Progress Bar */}
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-8">
                    <div
                      className={`${
                        risk < 30
                          ? "bg-green-500"
                          : risk < 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      } h-full`}
                      style={{ width: `${risk}%` }}
                    />
                  </div>

                  {/* Insight Box */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium flex items-center mb-2">
                      <Zap size={16} className="mr-2 text-blue-500" />
                      Insight
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {risk <= 30
                        ? "Low risk, stable."
                        : risk <= 60
                        ? "Moderate risk."
                        : "High risk, may be volatile."}
                    </p>
                  </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-6 space-y-6">
                {/* Source Distribution Card */}
                <div className="bg-white rounded-xl shadow-sm">
                   <div className="px-4 py-3 rounded-t-xl border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Source Distribution
                  </h3>
                  </div>
                        <div className="px-6 pb-6">
                  <div className="h-40 text-sm md:text-md">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "Reddit",
                            value: redditCount,
                            color: "#EA580C",
                          },
                          {
                            name: "News",
                            value: googleCount,
                            color: "#1A73E8",
                          },
                        ]}
                        layout="vertical"
                        margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                        />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="value">
                          <Cell key="reddit-bar" fill="#EA580C" />
                          <Cell key="news-bar" fill="#1A73E8" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Source Metrics */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 rounded-lg bg-orange-50">
                      <div className="flex items-center gap-1 text-orange-600 mb-1">
                        <FaReddit size={16} />
                        <span className="text-sm md:text-md font-medium">Reddit</span>
                      </div>
                      <span className=" md:text-lg font-bold text-gray-800">
                        {redditCount}
                      </span>
                      <span className="text-xs md:text-sm text-gray-500 ml-1">posts</span>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50">
                      <div className="flex items-center gap-1 text-blue-600 mb-1">
                        <SiGooglenews size={16} />
                        <span className="text-sm md:text-md  font-medium">News</span>
                      </div>
                      <span className=" md:text-lg font-bold text-gray-800">
                        {googleCount}
                      </span>
                      <span className="text-xs md:text-sm text-gray-500 ml-1">
                        articles
                      </span>
                    </div>
                  </div>
                  </div>
                </div>

                {/* Scraped Data List */}
                <div className="bg-white rounded-xl shadow-sm">
                   <div className="px-4 py-3 rounded-t-xl border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-700">
                      Scraped Data
                    </h3>
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                      {scraped_data.length} results
                    </span>
                    </div>
                  </div>
                        <div className="px-6 pt-6 pb-7.5">
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {scraped_data.length > 0 ? (
                      scraped_data.map((post, idx) => {
                        const [title = "", url = ""] = post.split(" - ");
                        const isReddit = url.includes("reddit.com");
                        const isGoogle = url.includes("news.google.com");
                        const domainLabel =
                          url.match(/https?:\/\/([^/]+)/)?.[1] || "Link";

                        return (
                          <div
                            key={idx}
                            onClick={() => window.open(url, "_blank")}
                            className="bg-gray-50 p-3 rounded-lg hover:shadow-md border border-gray-100 flex justify-between items-center cursor-pointer transition-all"
                          >
                            <div className="flex-1 pr-2">
                              <p
                                className={`font-medium text-sm ${
                                  title
                                    ? "text-gray-900"
                                    : "text-gray-500 italic"
                                }`}
                              >
                                {title || `Article from ${domainLabel}`}
                              </p>
                              <div className="flex gap-2 mt-2 items-center">
                                <span className="text-xs text-gray-400">
                                  #{idx + 1}
                                </span>
                                {isReddit && renderLabel("reddit")}
                                {isGoogle && renderLabel("google")}
                              </div>
                            </div>
                            <div className="px-2">
                              <ExternalLink
                                size={15}
                                className="text-gray-400"
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-400 italic">
                        No data available
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
