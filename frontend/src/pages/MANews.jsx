import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Calendar,
  TrendingUp,
  Newspaper,
  RefreshCw,
  ArrowRight,
  FileText,
  ArrowLeft,
  CircleHelp,
} from "lucide-react";
import { Link } from "react-router-dom";

const NewsCard = ({ url, image, source, date, title, summary }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-all duration-300 hover:scale-[1.02] focus:outline-none group"
    >
      <div className="h-full overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col">
        {image && (
          <div className="w-full h-40 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <img
              src={image || "/api/placeholder/800/500"}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.src = "/api/placeholder/800/500";
              }}
            />
            <div className="absolute bottom-3 left-3 z-20">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                {source}
              </span>
            </div>
            <div className="absolute top-3 right-3 z-20">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/90 text-white">
                {formattedDate}
              </span>
            </div>
          </div>
        )}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-sm font-bold leading-tight mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-1">
            {summary}
          </p>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <ArrowRight className="h-3 w-3 mr-1 text-blue-500" />
              <span>Read more</span>
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-gray-400" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

const NewsGrid = ({
  news = [],
  currentPage,
  onPageChange,
}) => {
  const itemsPerPage = 16;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = news.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(news.length / itemsPerPage);

  if (!paginatedNews.length) {
    return (
      <div className="text-center py-16 text-gray-500 bg-white/50 rounded-xl border border-gray-100 shadow-sm">
        <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-lg font-medium">No news articles found</p>
        <p className="mt-2">Try a different category or search term</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedNews.map((item, i) => (
          <NewsCard
            key={i}
            url={item.url}
            image={item.urlToImage}
            source={item.source}
            date={item.publishedAt}
            title={item.title}
            summary={item.description}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`px-4 py-2 text-sm rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

const CategoryPills = ({ categories, activeCategory, onCategoryChange }) => (
  <div className="overflow-x-auto py-1">
    <div className="flex gap-2.5 flex-wrap">
      {categories.map((category) => {
        const isActive = activeCategory === category.value;
        const baseStyle = isActive
          ? "bg-slate-900 text-white border border-slate-900"
          : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900";

        const icon = ["technology", "finance", "retail"].includes(
          category.value
        ) ? (
          <TrendingUp className="h-3.5 w-3.5 shrink-0" />
        ) : (
          <Newspaper className="h-3.5 w-3.5 shrink-0" />
        );

        return (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer ${baseStyle}`}
          >
            {icon}
            <span className="capitalize tracking-wide">{category.label}</span>
            <span
              className={`ml-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isActive
                  ? "bg-white/25 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {category.count}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-24">
    <div className="relative">
      <RefreshCw className="h-7 w-7 text-gray-900 animate-spin" />
    </div>
    <p className="mt-6 text-gray-900 text-sm">Fetching latest...</p>
  </div>
);

export default function MANews() {
  const [activeSection, setActiveSection] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [newsData, setNewsData] = useState({
    all: [],
    technology: [],
    finance: [],
    retail: [],
    other: [],
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSection]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/news/fetch-ma-news`
      );
      setNewsData(data);
    } catch {
      toast.error("Failed to load latest news. Please try again.");
      setNewsData({
        all: [],
        technology: [],
        finance: [],
        retail: [],
        other: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = Object.fromEntries(
    Object.entries(newsData).map(([category, articles]) => [
      category,
      articles.filter((item) => {
        return item.description && item.description.trim() !== "";
      }),
    ])
  );

  const categories = Object.keys(filteredNews).map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: filteredNews[cat]?.length || 0,
  }));

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="shrink-0 relative z-10 border-b border-slate-200/50 bg-white px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span>Back</span>
            </Link>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="ptserif text-sm font-bold text-slate-800">Sentilyst</span>
            </div>
          </div>
          
          <div className="flex items-center gap-5 text-xs font-semibold text-slate-400">
            <Link to="/news" className="hover:text-slate-900 transition-colors text-slate-900 font-bold">News</Link>
            <Link to="/about" className="hover:text-slate-900 transition-colors">About</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-screen-2xl w-full mx-auto p-6 md:p-9 space-y-6">
        <div className="mb-2">
          <CategoryPills
            categories={categories}
            activeCategory={activeSection}
            onCategoryChange={setActiveSection}
          />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <NewsGrid
            news={filteredNews[activeSection] || []}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}
