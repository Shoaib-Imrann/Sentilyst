// src/components/Layout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Banner from "./Banner";
import { AlignLeft } from "lucide-react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const isNewsPage = location.pathname === "/ma-news";
  
  return (
    <div className={`flex flex-col h-screen ${isNewsPage ? "" : "pt-6"}`}>
      <Banner />
      
      <div className="flex flex-1 h-full">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
