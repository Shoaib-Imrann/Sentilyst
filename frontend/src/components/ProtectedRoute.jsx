import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, globalLoading } = useContext(AppContext);

  if (globalLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="relative">
          <div className="w-16 h-16 border-[1px] border-transparent border-t-[#248fef] border-r-[#248fef] rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img
              src="/logo.png"
              alt="Sentilyst"
              className="w-11.5 h-12 object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  // Let in only if logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
