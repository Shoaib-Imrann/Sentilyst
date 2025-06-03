import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  PanelLeft,
  Home,
  ArrowLeftRight,
  Newspaper,
  Database,
  ChevronDown,
  ChevronRight,
  FileText,
  SeparatorHorizontal,
  User,
  LogOut,
  LogIn,
  Trash2,
  UserPlus,
  Plus,
  AlignLeft,
  X,
} from "lucide-react";
import { AppContext } from "../Context/AppContext";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
  profileOpen,
  setProfileOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardOrHome = location.pathname === "/dashboard" || location.pathname === "/" || location.pathname.startsWith("/analyzed");
  const {
    analyzedTabs,
    isLoggedIn,
    userData,
    setIsLoggedIn,
    backendUrl,
    setAnalyzedTabs,
    setSearchQuery,
  } = useContext(AppContext);
  const [darkMode, setDarkMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [analyzedDataOpen, setAnalyzedDataOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const isDisabled = profileOpen;

  const handleAnalyzedItemClick = (id) => {
    if (isDisabled) return;
    
    // Find the tab to get the query for the slug
    const tab = analyzedTabs.find(tab => tab.id === id);
    if (!tab) return;
    
    // Create a slug from the query
    const slug = tab.query
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .substring(0, 50); // Limit length
    
    setActiveSection(`analyzed-${id}`);
    navigate(`/analyzed/${slug}`);
    // Close mobile sidebar after selection on small screens
    setMobileSidebarOpen(false);
  };

  useEffect(() => {
    if (activeSection.startsWith("analyzed")) {
      setAnalyzedDataOpen(true);
    }
  }, [activeSection]);

  const handleSignOut = () => {
    localStorage.removeItem("accessToken"); // or however you're managing session
    navigate("/");
    setIsLoggedIn(false);
  };

  const handleDeleteTab = async (id) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("You ain't even logged in");
      return;
    }

    try {
      const response = await axios.delete(`${backendUrl}/api/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        toast.success("Deleted");
        // Now remove it from the local state so it disappears instantly
        setAnalyzedTabs(analyzedTabs.filter((tab) => tab.id !== id));

        // If you want to reset activeSection if it was that tab, do that too
        if (activeSection === `analyzed-${id}`) {
          setActiveSection("dashboard"); // or whatever fallback you want
        }
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      // console.error("Delete error:", error);
      toast.error("Something wrong deleting");
    }
  };

  // Function to close mobile sidebar
  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger button (only visible on mobile) */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className={`md:hidden fixed ${isDashboardOrHome ? "top-9" : "top-3"} left-3 z-40 p-2 rounded-md bg-transparent hover:bg-gray-100`}
      >
        <AlignLeft size={20} />
      </button>

      {/* Mobile overlay backdrop */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-60"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`
          md:hidden fixed inset-y-0 left-0 z-70 w-[80%] max-w-[280px] flex flex-col
          transition-all duration-300 ease-in-out transform
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}
          shadow-xl
        `}
      >
        {/* Mobile sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold ptserif">Sentilyst</h1>
          <button
            onClick={closeMobileSidebar}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* New Analysis button */}
        <div className="p-4">
          <button
            onClick={() => {
              navigate("/");
              setActiveSection("all");
              setSearchQuery("");
              closeMobileSidebar();
            }}
            className="flex items-center justify-center gap-2 w-full p-3 border rounded-md border-gray-300 hover:bg-gray-100"
          >
            <Plus size={16} />
            <span>New Analysis</span>
          </button>
        </div>

        {/* Navigation sections */}
        <nav className="flex-1 overflow-y-auto px-1 py-2 space-y-2">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            onClick={() => {
              setActiveSection("dashboard");
              closeMobileSidebar();
            }}
            className={({ isActive }) =>
              `flex items-center rounded-md p-3 text-sm font-medium ${
                isActive
                  ? darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700"
                  : darkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Home size={18} className="mr-3" />
            Dashboard
          </NavLink>

          {/* M&A News */}
          <NavLink
            to="/ma-news"
            onClick={() => {
              setActiveSection("all");
              closeMobileSidebar();
            }}
            className={({ isActive }) =>
              `flex items-center rounded-md p-3 text-sm font-medium ${
                isActive
                  ? darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700"
                  : darkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Newspaper size={18} className="mr-3" />
            M&A News
          </NavLink>

          {/* Analyzed section header */}
          <div className="px-3 pt-5 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Your analyses
          </div>

          {/* Analyzed Items list */}
          <div className={`${!isLoggedIn ? "opacity-50" : ""}`}>
            {isLoggedIn ? (
              <div className="space-y-1">
                {analyzedTabs && analyzedTabs.length > 0 ? (
                  analyzedTabs.map((tab) => {
                    // get first 20 words
                    const words = tab.query.split(" ");
                    const excerpt =
                      words.slice(0, 20).join(" ") +
                      (words.length > 20 ? "..." : "");

                    return (
                      <div
                        key={tab.id}
                        onClick={() => handleAnalyzedItemClick(tab.id)}
                        className={`
                          flex items-center justify-between rounded-md p-3 text-sm cursor-pointer
                          ${
                            activeSection === `analyzed-${tab.id}`
                              ? darkMode
                                ? "bg-blue-500 text-white"
                                : "bg-blue-50 text-blue-600"
                              : darkMode
                              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }
                        `}
                      >
                        {/* Icon and text */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Database size={16} />
                          <span className="truncate">{excerpt}</span>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTab(tab.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No analysis yet
                  </div>
                )}
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                Sign in to view your analyses
              </div>
            )}
          </div>
        </nav>

        {/* Profile section */}
        <div className="mt-auto border-t border-gray-200 p-4">
          {isLoggedIn ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {userData?.profileUrl ? (
                <img 
                  src={userData.profileUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-medium">
                  {userData?.fullName ? (
                    userData.fullName.charAt(0).toUpperCase()
                  ) : (
                    <User size={16} />
                  )}
                </div>
              )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {userData?.fullName || "Guest"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userData?.email || "Not signed in"}
                  </p>
                </div>
              </div>
              {isLoggedIn ? (
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <LogOut size={18} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    closeMobileSidebar();
                  }}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <LogIn size={18} />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                closeMobileSidebar();
              }}
              className="w-full px-3 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-md text-sm cursor-pointer"
            >
              Sign In / Sign Up
            </button>
          )}
        </div>
      </div>

      {/* Desktop sidebar (unchanged) */}
      <div
        className={`
          hidden md:flex flex-col h-full justify-between transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-[49px]"}
          ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}
          border-r ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm
        `}
      >
        {/* Logo & Toggle */}
        <div
          className={`p-3 flex items-center ${
            sidebarOpen ? "justify-start" : "justify-center"
          } mb-2`}
        >
          <button
            onClick={() => !isDisabled && setSidebarOpen(!sidebarOpen)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isDisabled}
            className={`
              p-2 rounded-md transition-all duration-300 cursor-pointer
              ${
                darkMode
                  ? "text-gray-400 hover:bg-gray-700"
                  : "text-gray-500 hover:bg-gray-100"
              }
              ${sidebarOpen ? "mx-0" : "mx-1"}
              ${isDisabled ? "pointer-events-none opacity-20" : ""}
            `}
          >
            {isHovered ? <ArrowLeftRight size={18} /> : <PanelLeft size={18} />}
          </button>
          {sidebarOpen && (
            <h1 className="ml-2 text-xl font-semibold ptserif">Sentilyst</h1>
          )}
        </div>
        
        {/* New Analysis button for desktop */}
        <div className={`px-3 mb-3 ${!sidebarOpen && "flex justify-center"}`}>
          <button
            onClick={() => {
              navigate("/");
              setActiveSection("all");
              setSearchQuery("");
            }}
            className={`
              ${sidebarOpen 
                ? "flex items-center justify-center gap-2 w-full p-3 border rounded-md border-gray-300 hover:bg-gray-100" 
                : "p-2 rounded-md hover:bg-gray-100"}
            `}
            title={!sidebarOpen ? "New Analysis" : ""}
          >
            <Plus size={sidebarOpen ? 16 : 18} className={!sidebarOpen ? "mx-auto" : ""} />
            {sidebarOpen && <span className="text-sm">New Analysis</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 overflow-y-auto px-1 py-2 space-y-2 ${
            isDisabled ? "pointer-events-none opacity-20 bg-gray-400" : ""
          }`}
        >
          <NavLink
            to="/dashboard"
            onClick={() => sidebarOpen && setActiveSection("dashboard")}
            className={({ isActive }) =>
              `flex items-center rounded-md p-3 text-sm font-medium ${
                isActive
                  ? darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700"
                  : darkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } ${!sidebarOpen ? "pointer-events-none opacity-20" : ""}`
            }
          >
            <Home size={18} className={sidebarOpen ? "mr-3" : "mx-auto"} />
            {sidebarOpen && "Dashboard"}
          </NavLink>

          <NavLink
            to="/ma-news"
            onClick={() => sidebarOpen && setActiveSection("all")}
            className={({ isActive }) =>
              `flex items-center rounded-md p-3 text-sm font-medium ${
                isActive
                  ? darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700"
                  : darkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } ${!sidebarOpen ? "pointer-events-none opacity-20" : ""}`
            }
          >
            <Newspaper size={18} className={sidebarOpen ? "mr-3" : "mx-auto"} />
            {sidebarOpen && "M&A News"}
          </NavLink>

          {/* Analyzed section header for desktop - only shown when not signed in */}
          {sidebarOpen && !isLoggedIn && (
            <div className="px-3 pt-5 pb-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Your analyses
            </div>
          )}
          
          {/* Analyzed Data */}
          <div>
            {isLoggedIn ? (
              <>
                <div
                  onClick={() => {
                    if (!isDisabled && sidebarOpen) {
                      setAnalyzedDataOpen(!analyzedDataOpen);
                    }
                  }}
                  className={`
                  flex items-center rounded-md p-3 text-sm font-medium
                  ${
                    activeSection.startsWith("analyzed")
                      ? darkMode
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-700"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  ${isDisabled ? "opacity-20 pointer-events-none cursor-not-allowed" : ""}
                  ${!sidebarOpen ? "cursor-default" : "cursor-pointer"}
                `}
                >
                  <Database
                    size={18}
                    className={sidebarOpen ? "mr-3" : "mx-auto"}
                  />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1">Analyzed</span>
                      {analyzedDataOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </>
                  )}
                </div>

                {sidebarOpen && analyzedDataOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {analyzedTabs && analyzedTabs.length > 0 ? (
                      analyzedTabs.map((tab) => {
                        // get first 20 words
                        const words = tab.query.split(" ");
                        const excerpt =
                          words.slice(0, 20).join(" ") +
                          (words.length > 20 ? "..." : "");

                        return (
                          <div
                            key={tab.id}
                            onMouseEnter={() => setHoveredTab(tab.id)}
                            onMouseLeave={() => setHoveredTab(null)}
                            onClick={() => handleAnalyzedItemClick(tab.id)}
                            className={`
                            flex items-center justify-between rounded-md p-3 text-sm cursor-pointer
                            ${
                              activeSection === `analyzed-${tab.id}`
                                ? darkMode
                                  ? "bg-blue-500 text-white"
                                  : "bg-blue-50 text-blue-600"
                                : darkMode
                                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }
                          `}
                          >
                            {/* Excerpted text */}
                            <span className="flex-1 text-xs font-medium truncate">
                              {excerpt}
                            </span>

                            {/* Trash icon on hover */}
                            {hoveredTab === tab.id && (
                              <Trash2
                                size={14}
                                className="ml-2 text-gray-400 hover:text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTab(tab.id);
                                }}
                              />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-600">
                        No analyses yet
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
              <div className={`flex items-center rounded-md p-3 text-sm ${sidebarOpen ? "" : "justify-center"}`}>
                {sidebarOpen && (
                  <span className="text-gray-500 text-sm">Sign in to view your analyses</span>
                )}
              </div>
              </>
            )}
          </div>
        </nav>

        {/* Profile Section */}
        <div className="relative px-1 py-2">
          {/* When sidebar is closed or user is logged in, show profile button */}
          {(!sidebarOpen || isLoggedIn) ? (
            <>
              <div
                onClick={() => sidebarOpen && setProfileOpen(!profileOpen)}
                className={`
                flex items-center ${
                  sidebarOpen ? "justify-between px-3" : "justify-center"
                } gap-3 py-2 rounded-md w-full
                transition-all duration-200 cursor-pointer
                ${profileOpen ? "bg-gray-300" : "hover:bg-gray-200"}
              `}
              >
                {isLoggedIn && userData?.profileUrl ? (
                  <img 
                    src={userData.profileUrl} 
                    alt="Profile" 
                    className={`${
                      sidebarOpen ? "w-8 h-8" : "w-7 h-7"
                    } rounded-full object-cover transition-all duration-300`}
                  />
                ) : (
                  <div
                    className={`
                    ${
                      sidebarOpen ? "w-8 h-8" : "w-7 h-7"
                    } rounded-full bg-gray-800 text-white flex items-center justify-center font-medium
                    transition-all duration-300
                  `}
                  >
                    {isLoggedIn && userData?.fullName ? (
                      userData.fullName.charAt(0).toUpperCase()
                    ) : (
                      <User size={sidebarOpen ? 17 : 15} />
                    )}
                  </div>
                )}

                {sidebarOpen && (
                  <div className="flex flex-1 justify-between items-center text-sm">
                    {isLoggedIn && userData?.fullName
                      ? userData.fullName
                      : "Profile"}
                    {profileOpen ? (
                      <ChevronDown size={16} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-500" />
                    )}
                  </div>
                )}
              </div>

              {/* Profile Popup */}
              {profileOpen && sidebarOpen && isLoggedIn && (
                <div className="absolute bottom-full left-2 right-2 mb-1 bg-white rounded-lg shadow-xl">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-3 px-4 pt-4 pb-3 rounded-t-lg">
                      {userData?.profileUrl ? (
                        <img 
                          src={userData.profileUrl} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm">
                          {userData.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-xs mb-[2px] font-medium text-gray-900">
                          {userData.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userData.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-2 w-full p-3 hover:bg-gray-200 border-t border-gray-300 rounded-b-lg text-xs shadow-md"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* When sidebar is open and user is not logged in, show sign in button directly */
            <button
              onClick={() => navigate("/login")}
              className="w-full px-3 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-md text-sm cursor-pointer"
            >
              Sign In / Sign Up
            </button>
          )}
        </div>
      </div>
    </>
  );
}
