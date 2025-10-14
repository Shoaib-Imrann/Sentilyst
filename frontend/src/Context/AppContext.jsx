// src/Context/AppContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [analyzedTabs, setAnalyzedTabs] = useState([]);
  const [analysisData, setAnalysisData] = useState(() => {
    try {
      const stored = localStorage.getItem("analysisData");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const backendUrl = import.meta.env.VITE_API_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking'); // 'online', 'offline', 'checking'

  useEffect(() => {
    getAuthState();
    // Check server status immediately
    checkServerStatus();
  }, [backendUrl]);

  const checkServerStatus = async () => {
    try {
      await axios.get(backendUrl, { timeout: 5000 });
      setServerStatus('online');
    } catch {
      setServerStatus('offline');
    }
  };

  const getAuthState = async () => {
    try {
      setGlobalLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      const response = await axios.get(backendUrl + "/api/email/is-auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
      }
    } catch {
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
    } finally {
      setGlobalLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const response = await axios.get(backendUrl + "/api/email/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        await fetchAnalyzedTabs();
        const user = response.data.userData;
        
        setUserData({
          fullName: user.full_name,
          email: user.email,
          profileUrl: user.profile_url
        });
      } else {
        toast.error("Failed to load user data");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [searchQuery, setSearchQuery] = useState(() => {
    // optional: persist last query too
    try {
      const stored = localStorage.getItem("searchQuery");
      return stored || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    if (analysisData) {
      try {
        localStorage.setItem("analysisData", JSON.stringify(analysisData));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [analysisData]);

  useEffect(() => {
    try {
      localStorage.setItem("searchQuery", searchQuery);
    } catch {
      // Ignore localStorage errors
    }
  }, [searchQuery]);

  const fetchAnalyzedTabs = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No user found");
      }

      const res = await axios.get(backendUrl + `/api/getdata`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnalyzedTabs(res.data.data);
    } catch (error) {
      // console.error("Error");
      // toast.error('Failed to fetch analyzed data ');
    }
  };

  const value = {
    backendUrl,
    globalLoading,
    setGlobalLoading,
    userData,
    setUserData,
    getUserData,
    setIsLoggedIn,
    isLoggedIn,
    analysisData,
    setAnalysisData,
    searchQuery,
    setSearchQuery,
    analyzedTabs,
    setAnalyzedTabs,
    fetchAnalyzedTabs,
    serverStatus,
    checkServerStatus,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
