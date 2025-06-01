// src/pages/AnalyzedData.jsx
import { Zap } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaReddit } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { SiGooglenews } from "react-icons/si";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RechartPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppContext } from "../Context/AppContext";
import React from "react";
import axios from "axios";
import Banner from "../components/Banner";

export default function AnalyzedData() {
  const [activeSection, setActiveSection] = useState("all");
  const [showTooltip, setShowTooltip] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();
  const { analyzedTabs, backendUrl } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!analyzedTabs?.length || !slug) return;
    setLoading(true);

    setTimeout(() => {
      // Find the record by matching the slug with each tab's query
      const record = analyzedTabs.find((tab) => {
        const tabSlug = tab.query
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 50);
        
        return tabSlug === slug;
      });
      
      if (record) {
        setData(record);
      } else {
        toast.error("Analysis not found");
        navigate(-1);
      }
      setLoading(false);
    }, 800); // Simulated loading time
  }, [slug, analyzedTabs, navigate]);

  const handleDelete = async () => {
    if (!data) return;
    
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("You need to be logged in");
      return;
    }

    try {
      const response = await axios.delete(`${backendUrl}/api/delete/${data.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        toast.success("Deleted");
        window.location.href = "/";
      } else {
        toast.error("Failed to delete this post");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error while deleting");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-[1px] border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className=" font-medium text-gray-900 text-sm">
            Processing your analysis...
          </h3>
          <p className="text-gray-500 mt-2 text-xs">This might take a moment</p>
        </div>
      </div>
    );
  }

  if (!data)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className=" font-semibold mb-2">Analysis Not Found</h3>
          <p className="text-gray-600 mb-6 text-sm">
            We couldn't locate the analysis you're looking for.
          </p>
          {/* <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button> */}
        </div>
      </div>
    );

  const {
    query,
    positive,
    negative,
    reddit_count,
    google_news_count,
    total_results,
    risk_level,
    created_at,
  } = data;

  // Format date
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Prepare chart data
  const sentimentData = [
    { name: "Positive", value: positive || 0, color: "#10B981" },
    { name: "Negative", value: negative || 0, color: "#EF4444" },
  ];

  // Platform distribution data
  const platformData = [
    { name: "Reddit", value: reddit_count || 0, color: "#FF4500" },
    { name: "Google News", value: google_news_count || 0, color: "#4285F4" },
  ];

  // Risk category
  const getRiskCategory = (level) => {
    if (level < 30)
      return {
        text: "Low Risk",
        color: "text-green-500",
        bgColor: "bg-green-500",
        icon: "✓",
      };
    if (level < 60)
      return {
        text: "Moderate Risk",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500",
        icon: "!",
      };
    return {
      text: "High Risk",
      color: "text-red-500",
      bgColor: "bg-red-500",
      icon: "⚠",
    };
  };

  const riskInfo = getRiskCategory(risk_level);

  const risk = risk_level;
  const riskColor =
    risk < 30
      ? "text-green-500"
      : risk < 60
      ? "text-yellow-500"
      : "text-red-500";

  // Sample historical data for demonstration
  const historicalData = [
    {
      date: "1 Week Ago",
      risk: Math.max(
        0,
        Math.min(100, risk_level + Math.floor(Math.random() * 20) - 10)
      ),
    },
    {
      date: "3 Days Ago",
      risk: Math.max(
        0,
        Math.min(100, risk_level + Math.floor(Math.random() * 15) - 7)
      ),
    },
    {
      date: "Yesterday",
      risk: Math.max(
        0,
        Math.min(100, risk_level + Math.floor(Math.random() * 10) - 5)
      ),
    },
    { date: "Today", risk: risk_level },
  ];

  // Determine trend
  const trend = historicalData[3].risk - historicalData[0].risk;
  const trendIcon =
    trend > 0 ? (
      <HiTrendingUp className="text-red-500" />
    ) : (
      <HiTrendingDown className="text-green-500" />
    );
  const trendText =
    trend > 0 ? `Rising ${Math.abs(trend)}%` : `Falling ${Math.abs(trend)}%`;
  const trendColor = trend > 0 ? "text-red-500" : "text-green-500";

  // Helper to render platform labels
  const renderLabel = (platform) => {
    switch (platform) {
      case "reddit":
        return (
          <span className="flex items-center gap-1 text-red-500 text-xs font-semibold bg-red-50 px-3 py-1.5 rounded-full">
            <FaReddit size={14} /> Reddit
          </span>
        );
      case "google":
        return (
          <span className="flex items-center gap-1 text-blue-600 text-xs font-semibold bg-blue-50 px-3 py-1.5 rounded-full">
            <SiGooglenews size={14} /> News
          </span>
        );
      default:
        return null;
    }
  };

  // Determine platforms present
  const platforms = [];
  if (reddit_count) platforms.push("reddit");
  if (google_news_count) platforms.push("google");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="md:hidden p-4 bg-white shadow-sm flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          >
            {/* <Menu className="h-6 w-6" /> */}
          </button>
          <Link to="/" className="text-xl ptserif font-semibold text-gray-800">Sentilyst</Link>
          <div className="w-8"></div> {/* Empty div for flex spacing */}
        </header>
      <div className="px-4 md:px-14 py-8">
        {/* Header */}
        <div className="mb-8 flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full flex justify-between items-start">
            <div>
              {/* <h1 className="text-3xl font-bold text-gray-900">Analysis for</h1> */}
              <input
                type="text"
                value={query}
                disabled
                className="min-w-full md:min-w-xl mt-2 border text-sm md:text-md border-gray-300 bg-white rounded-md cursor-not-allowed px-2 py-2.5 text-gray-500 "
              />

              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span className="ml-2">
                  Analyzed on {""}
                  {created_at ? (() => {
                    const date = new Date(created_at);
                    return date.toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'UTC'
                    });
                  })() : "Unknown date"} (IST)
                </span>
              </div>
            </div>
            <div>
              <button
                onClick={handleDelete}
                className="ml-2 mt-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-3.5 md:py-3 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* <div className="flex items-center">
                <span className="inline-flex items-center gap-1 mr-1 font-medium">
                  {platforms.map(p => renderLabel(p))}
                </span>
              </div> */}

          {/* Action buttons */}
          {/* <div className="flex space-x-2">
            <button className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
              <FaShare className="text-gray-500" size={14} /> Share
            </button>
            <button className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
              <FaDownload className="text-gray-500" size={14} /> Export
            </button>
            <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <FaBookmark size={14} /> Save
            </button>
          </div> */}
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Risk Card */}

          {/* Sentiment Breakdown */}
          <div className="bg-white rounded-xl shadow-sm">
             <div className="px-4 py-3 rounded-t-xl border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700">
              Sentiment Analysis
            </h3>
            </div>
            <div className="px-6 pb-6">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RechartPieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {sentimentData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </RechartPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {sentimentData.map((item) => (
                <div
                  key={item.name}
                  className={`p-3 rounded-lg bg-opacity-10 ${
                    item.name === "Positive" ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <div className="flex items-center mb-1 text-sm">
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span
                    className={` font-bold ${
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

          <div className="bg-white rounded-xl shadow-sm flex flex-col">
            <div className="px-4 py-3 rounded-t-xl border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700">
              Risk Assessment
            </h3>
            </div>
            <div className="px-6 pb-6">
            <div className="flex mb-4 items-end">
              <div className={`text-4xl font-bold mt-4 ${riskInfo.color}`}>
                {risk_level}
                <span className="text-2xl ml-1">%</span>
              </div>
              <span className="ml-2 text-gray-500 text-sm">Risk Level</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className={`${riskInfo.bgColor} h-full`}
                style={{ width: `${risk_level}%` }}
              />
            </div>
            <div className="p-4 mt-6 bg-blue-50 rounded-lg border border-blue-100">
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
        {/* Source Distribution */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-4 py-3 rounded-t-xl border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">
            Source Distribution
          </h3>
          </div>
          <div className="px-6 pb-6">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={platformData}
                layout="vertical"
                margin={{ top: 20, right: 50, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" nameKey="name">
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="p-3 rounded-lg bg-red-50 bg-opacity-20">
              <div className="flex items-center gap-1 text-red-500 mb-1">
                <FaReddit size={16} />
                <span className="text-sm md:text-md font-medium ">Reddit</span>
              </div>
              <span className="font-bold text-sm md:text-md text-gray-800">
                {reddit_count || 0}
              </span>
              <span className="text-xs text-gray-500 ml-1">posts</span>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 bg-opacity-20">
              <div className="flex items-center gap-1 text-blue-600 mb-1">
                <SiGooglenews size={16} />
                <span className="text-sm md:text-md font-medium">News</span>
              </div>
              <span className=" font-bold  text-sm md:text-md text-gray-800">
                {google_news_count || 0}
              </span>
              <span className="text-xs text-gray-500 ml-1">articles</span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
