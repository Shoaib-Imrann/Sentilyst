import React from "react";
import { ChevronLeft, BarChart, Shield } from "lucide-react";

export default function SimplifiedPrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <span className="bg-blue-600 text-white p-2 rounded-lg">
              <BarChart size={20} />
            </span> */}
            <h1 className="text-2xl font-semibold ptserif">Sentilyst</h1>
          </div>
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all font-medium text-xs"
          >
            <ChevronLeft size={16} />
            <span>Home</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-18">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <Shield size={24} className="text-white" />
            <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">
              Privacy Policy
            </h1>
          </div>
          <p className="mt-4 inline-block bg-gray-700 bg-opacity-30 px-4 py-2 rounded-full text-xs">
            Last Updated: May 17, 2025
          </p>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-yellow-50 border-b border-yellow-100">
        <div className="max-w-4xl mx-auto px-6 py-3 text-center">
          <p className="text-yellow-800 font-medium text-xs">
            <strong>DISCLAIMER:</strong> This is for demonstration purposes only
            as part of a project. The information provided is a rough idea and
            not legally binding.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="">
            {/* Section 1 */}
            <div className="p-6 flex gap-4">
              <div className="shrink-0 mt-1">
                <span className=" p-2 rounded-lg">1</span>
              </div>
              <div className="mt-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Information We Collect
                </h2>
                <p className="text-gray-700 text-sm">
                  We may collect personal information (name, email), usage data
                  (IP address, browser type), and analytics data related to your
                  M&A searches.
                </p>
              </div>
            </div>
            {/* Section 2 */}
            <div className="p-6 flex gap-4">
              <div className="shrink-0 mt-1">
                <span className=" p-2 rounded-lg">2</span>
              </div>
              <div className="mt-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  How We Use Your Information
                </h2>
                <p className="text-gray-700 text-sm">
                  We use collected information to provide and improve our
                  platform, understand usage patterns, develop new features,
                  communicate updates, and process transactions.
                </p>
              </div>
            </div>
            {/* Section 3 */}
            <div className="p-6 flex gap-4">
              <div className="shrink-0 mt-1">
                <span className=" p-2 rounded-lg">3</span>
              </div>
              <div className="mt-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Data Collection and Analysis
                </h2>
                <p className="text-gray-700 text-sm">
                  Sentilyst collects publicly available data from sources like
                  Reddit and Google News to analyze sentiment around M&A deals.
                  We only use information that is publicly accessible.
                </p>
              </div>
            </div>
            {/* Section 4 */}
            <div className="p-6 flex gap-4">
              <div className="shrink-0 mt-1">
                <span className=" p-2 rounded-lg">4</span>
              </div>
              <div className="mt-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Information Sharing
                </h2>
                <p className="text-gray-700 text-sm">
                  We may share information with service providers who help
                  operate our platform, during business transfers, or when
                  required by law.
                </p>
              </div>
            </div>
            {/* Section 5 */}
            <div className="p-6 flex gap-4">
              <div className="shrink-0 mt-1">
                <span className=" p-2 rounded-lg">5</span>
              </div>
              <div className="mt-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Data Security
                </h2>
                <p className="text-gray-700 text-sm">
                  We implement security measures to protect your information,
                  but internet transmission is never 100% secure. We retain your
                  data only as long as necessary or required by law.
                </p>
              </div>
            </div>
            {/* Section 6 */}
            <div className="p-6 flex gap-4">
              <div className="shrink-0 mt-1">
                <span className=" p-2 rounded-lg">6</span>
              </div>
              <div className="mt-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Your Privacy Rights
                </h2>
                <p className="text-gray-700 text-sm">
                  You can review or change account information, opt out of
                  marketing communications, and may have additional rights
                  depending on your location (access, correction, deletion,
                  objection to processing).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex flex-col justify-center items-center md:items-start w-full">
              <div className="flex items-center gap-2 mb-4">
                {/* <FileText size={20} /> */}
                <h3 className="text-xl font-semibold ptserif">Sentilyst</h3>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered sentiment analysis for M&A intelligence
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 w-full md:justify-end">
              <ul className="space-y-2 flex flex-col items-center w-full md:w-fit md:items-start justify-center ">
                <li>
                  <a
                    href="/about"
                    className="text-gray-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-gray-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-white hover:text-blue-300 text-sm transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
