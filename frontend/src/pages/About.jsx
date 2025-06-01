import React from "react";
import {
  Globe,
  ChevronRight,
  ChartBar,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SentilystPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <header className="max-w-6xl mx-auto px-6 py-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-2xl md:text-3xl font-semibold ptserif">
              Sentilyst
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm bg-blue-800 bg-opacity-40 px-3 py-1 rounded-full hover:bg-opacity-50 cursor-pointer transition-colors">
            <Globe size={14} />
            <span>English</span>
          </div>
        </header>
      </section>

      {/* Description Section */}
      <section className="bg-gray-50 text-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="">
            {/* <h2 className="text-2xl md:text-3xl font-semibold mb-6">About Sentilyst</h2> */}
            <p className="text-gray-600 leading-relaxed">
              Sentilyst is an AI-powered sentiment analysis platform that
              gathers data from sources such as Reddit and Google News to
              evaluate public sentiment around mergers and acquisition (M&A)
              deals. It interprets online discussions to understand how people
              are responding to these transactions. Please note that this is an
              early-stage concept of the search mechanism and may not yield
              fully accurate results. Currently, it utilizes Reddit and Google
              News.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white text-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h3 className="text-blue-800 font-semibold mb-2">HOW IT WORKS</h3>
            <h2 className="text-2xl md:text-3xl font-bold">
              AI-powered sentiment analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm  transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-800 mb-4">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Data Collection</h3>
              <p className="text-gray-600 text-sm">
                Gathers discussions and news from Reddit and Google News.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm  transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-800 mb-4">
                <ChartBar size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sentiment Analysis</h3>
              <p className="text-gray-600 text-sm">
                Interprets online discussions to understand public sentiment
                around M&A deals.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm  transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-800 mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
              <p className="text-gray-600 text-sm">
                Evaluates potential risks and opportunities based on public
                perception.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                    className="text-white hover:text-blue-300 text-sm transition-colors"
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
