import React from "react";
import { ChevronLeft, FileText, Shield } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <span className="bg-blue-600 text-white p-2 rounded-lg">
              <FileText size={20} />
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
              Terms of Service
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
                <span className="p-2 rounded-lg">1</span>
              </div>
              <div className="mt-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Acceptance of Terms
                </h2>
                <p className="text-gray-700 text-sm">
                  By using our platform, you agree to be bound by these Terms
                  and our Privacy Policy.
                </p>
              </div>
            </div>
            {/* Section 2 */}
            <div className="p-6 flex gap-4">
              <div className="shrink-0 mt-1">
                <span className="p-2 rounded-lg">2</span>
              </div>
              <div className="mt-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Description of Services
                </h2>
                <p className="text-gray-700 text-sm">
                  Sentilyst is an AI-powered sentiment analysis platform for M&A
                  deals that gathers data from online sources.
                </p>
              </div>
            </div>
            {/* Section 3 */}
            <div className="p-6 flex gap-4">
              <div className="shrink-0 mt-1">
                <span className="p-2 rounded-lg">3</span>
              </div>
              <div className="mt-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  User Accounts
                </h2>
                <p className="text-gray-700 text-sm">
                  When creating an account, you must provide accurate
                  information and are responsible for all activities under your
                  account.
                </p>
              </div>
            </div>
            {/* Section 4 */}
            <div className="p-6 flex gap-4">
              <div className="shrink-0 mt-1">
                <span className="p-2 rounded-lg">4</span>
              </div>
              <div className="mt-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Data and Analytics
                </h2>
                <p className="text-gray-700 text-sm">
                  The information provided is for informational purposes only
                  and not financial advice.
                </p>
              </div>
            </div>
            {/* Section 5 */}
            <div className="p-6 flex gap-4">
              <div className="shrink-0 mt-1">
                <span className="p-2 rounded-lg">5</span>
              </div>
              <div className="mt-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  User Conduct
                </h2>
                <p className="text-gray-700 text-sm">
                  You agree not to use our service for illegal purposes, attempt
                  unauthorized access, interfere with the service, or extract
                  data from our platform.
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
                    className="text-white hover:text-blue-300 text-sm transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-400 hover:text-blue-300 text-sm transition-colors"
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
