import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Search,
  Calendar,
  TrendingUp,
  Newspaper,
  RefreshCw,
  ArrowRight,
  FileText,
  Menu,
  Filter,
  AlignLeft,
} from "lucide-react";
import { Link} from "react-router-dom";

// NewsCard component - Redesigned with smaller size
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

// NewsGrid component - Enhanced with better spacing and animations
const NewsGrid = ({
  news = [],
  category = "all",
  currentPage,
  onPageChange,
}) => {
  const itemsPerPage = 16;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = news.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(news.length / itemsPerPage);

  if (!paginatedNews.length)
    return (
      <div className="text-center py-16 text-gray-500 bg-white/50 rounded-xl border border-gray-100 shadow-sm">
        <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-lg font-medium">No news articles found</p>
        <p className="mt-2">Try a different category or search term</p>
      </div>
    );

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

      {/* Pagination */}
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

// SearchBar component - Redesigned with a cleaner and more modern look
const SearchBar = ({ placeholder, className, value, onChange }) => (
  <div className={`relative max-w-3xl mx-auto ${className}`}>
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-300 focus:shadow-md text-gray-700"
    />
  </div>
);

// Category Pills - Redesigned with a new look
const CategoryPills = ({ categories, activeCategory, onCategoryChange }) => (
  <div className=" overflow-x-auto p-2 pl-0">
    <div className="flex gap-3 flex-wrap ">
      {categories.map((category) => {
        const isActive = activeCategory === category.value;
        const baseStyle = isActive
          ? "bg-blue-600 text-white shadow-md" // Solid active background
          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-700"; // More opaque inactive styles

        const icon = ["technology", "finance", "retail"].includes(
          category.value
        ) ? (
          <TrendingUp className={`h-3 w-3  ${isActive ? "text-white" : ""}`} /> // Consistent icon color
        ) : (
          <Newspaper className={`h-3 w-3  ${isActive ? "text-white" : ""}`} />
        );

        return (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors duration-200 ease-in-out ${baseStyle}`} // Slightly less rounded, smoother transition
          >
            {icon}
            <span className="capitalize tracking-wide">{category.label}</span>
            <span
              className={`ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isActive
                  ? "bg-gray-100 text-blue-600"
                  : "bg-gray-200 text-gray-700"
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

// Loading Spinner - More elegant and branded
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-24">
    <div className="relative">
      <RefreshCw className="h-7 w-7 text-gray-900 animate-spin" />
    </div>
    <p className="mt-6 text-gray-900 text-sm">Fetching latest...</p>
  </div>
);

// Main component - Redesigned with more premium UI elements
export default function MergerAcquisitionNews() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Notifications & profile dropdowns
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // News & UI state
  const [newsData, setNewsData] = useState({
    all: [],
    technology: [],
    finance: [],
    // energy: [],
    retail: [],
    other: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSection, searchTerm]);

  useEffect(() => {
    // mock notifications or fetch real ones
    setNotifications([
      {
        id: 1,
        type: "info",
        title: "Welcome!",
        message: "Here are today's top M&A headlines.",
        time: "just now",
        read: false,
      },
      {
        id: 2,
        type: "alert",
        title: "New Deal Alert",
        message: "Major tech acquisition announced today.",
        time: "2 hours ago",
        read: false,
      },
    ]);
    fetchNews();
  }, []);

  const markAllNotificationsAsRead = () =>
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  const deleteNotification = (id) =>
    setNotifications((n) => n.filter((x) => x.id !== id));

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        import.meta.env.VITE_API_URL + "/api/news/fetch-ma-news"
      );
      setNewsData(data);
      // toast.success("Latest M&A news loaded successfully!");
    } catch {
      toast.error("Failed to load latest news. Please try again.");
      setNewsData({
        all: [],
        technology: [],
        finance: [],
        // energy: [],
        retail: [],
        other: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // filter by search
  const filteredNews = Object.fromEntries(
  Object.entries(newsData).map(([category, articles]) => [
    category,
    articles.filter((item) => {
      const hasDescription = item.description && item.description.trim() !== "";
      const matchesSearch = searchTerm
        ? item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return hasDescription && matchesSearch;
    }),
  ])
);


  // Create category objects with counts for pills
  const categories = Object.keys(filteredNews).map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: filteredNews[cat]?.length || 0,
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col bg-gray-50">
        <header className="md:hidden fixed top-0 left-0 right-0 z-40 p-4 bg-white shadow-sm flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          >
            {/* <AlignLeft size={20} /> */}
          </button>
          <Link to="/" className="text-xl ptserif font-semibold text-gray-800">Sentilyst</Link>
          <div className="w-8"></div> {/* Empty div for flex spacing */}
        </header>
        <main className="flex-1 p-6 md:p-9 space-y-6 pt-20 md:p-9">
          <SearchBar
            placeholder="Search for M&A news, companies..."
            className="mb-8 mt-3 text-sm"
            value={searchTerm}
            onChange={setSearchTerm}
          />

          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-2 mt-14f">
            <div className="overflow-x-auto pb-2 max-w-full">
              <CategoryPills
                categories={categories}
                activeCategory={activeSection}
                onCategoryChange={setActiveSection}
              />
            </div>
            <button
              onClick={fetchNews}
              className=" hidden md:flex items-center mt-2 px-5 py-2.5 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs hover:shadow md:ml-auto"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div>
                <NewsGrid
                  news={filteredNews[activeSection] || []}
                  category={activeSection}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
