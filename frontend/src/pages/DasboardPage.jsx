// pages/DashboardPage.jsx
import React, {useContext} from "react";
import Dashboard from "./Dasboard";
import { AppContext } from "../Context/AppContext";

export default function DashboardPage() {
  const { analysisData } = useContext(AppContext);
  return <Dashboard analysisData={analysisData} />;
}
