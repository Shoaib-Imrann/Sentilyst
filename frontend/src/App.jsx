// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SentilystDashboard from "./pages/SentilystDashboard";
import DashboardPage from "./pages/DasboardPage";
import MANews from "./pages/MANews";
import AnalyzedData from "./pages/AnalyzedData";
import Layout from "./components/Layout";
import RestrictedRoute from "./components/RestrictedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import TermsOfService from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function App() {
  return (
      <>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              backgroundColor: "#333",
              color: "#fff",
            },
          }}
        />
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<SentilystDashboard />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/ma-news" element={<MANews />} />
              <Route path="/analyzed/:slug" element={<ProtectedRoute ><AnalyzedData /></ProtectedRoute>} />
              
              {/* <Route path="/calendar" element={<Calendar />} /> */}
            </Route>
            <Route path="/about" element={<><About /></>} />
            <Route path="/terms" element={<><TermsOfService /></>} />
            <Route path="/privacy" element={<><Privacy /></>} />
            <Route path="/login" element={<RestrictedRoute ><Signin /></RestrictedRoute>} />
            <Route path="/signup" element={<RestrictedRoute ><SignUp /></RestrictedRoute>} />
          </Routes>
        </Router>
        <Analytics />
        <SpeedInsights />
      </>
  );
}
