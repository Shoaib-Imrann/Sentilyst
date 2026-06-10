import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Zap,
  Newspaper,
  CircleHelp,
  ArrowLeft,
  Search,
  ExternalLink,
  Clock,
  Database,
  Filter,
  ChevronDown,
} from "lucide-react";
import { SiGooglenews } from "react-icons/si";

export default function Results() {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter state for articles feed
  const [selectedSource, setSelectedSource] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("analysisData");
    const storedQuery = sessionStorage.getItem("searchQuery");

    if (storedData) {
      setAnalysisData(JSON.parse(storedData));
    } else {
      navigate("/");
    }

    if (storedQuery) setSearchQuery(storedQuery);
  }, [navigate]);

  if (!analysisData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="relative flex items-center justify-center w-12 h-12 mb-4">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-500">Loading analysis data...</p>
      </div>
    );
  }

  const {
    sentiment_percentages = {},
    source_counts = {},
    scraped_data = [],
    cached = false,
    processing_time,
  } = analysisData;

  const positive = sentiment_percentages.positive || 0;
  const negative = sentiment_percentages.negative || 0;
  
  const googleCount =
    source_counts.google_news ??
    scraped_data.filter((i) =>
      (typeof i === "object" ? i.source : "").includes("google")
    ).length;
  const newsApiCount =
    source_counts.newsapi ??
    scraped_data.filter((i) =>
      (typeof i === "object" ? i.source : "") === "newsapi"
    ).length;
  const totalArticles = scraped_data.length;

  const dominant =
    positive > negative ? "positive" : positive < negative ? "negative" : "mixed";
  const heroValue = dominant === "negative" ? negative : positive;

  // Filtered articles
  const filteredArticles = scraped_data.filter((item) => {
    return (
      selectedSource === "all" ||
      (selectedSource === "google_news" && item.source === "google_news") ||
      (selectedSource === "newsapi" && item.source === "newsapi")
    );
  });

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-slate-50 text-slate-900 font-sans relative flex flex-col">
      {/* Header */}
      <header className="shrink-0 relative z-10 border-b border-slate-200/50 bg-white px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span>New Search</span>
            </Link>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="ptserif text-sm font-bold text-slate-800">Sentilyst</span>
            </div>
          </div>
          
          <div className="flex items-center gap-5 text-xs font-semibold text-slate-400">
            <Link to="/news" className="hover:text-slate-900 transition-colors">News</Link>
            <Link to="/about" className="hover:text-slate-900 transition-colors">About</Link>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="relative z-10 flex-1 max-w-screen-2xl w-full mx-auto px-6 py-6 flex flex-col gap-6 min-h-0">
        
        {/* Deal Title Row */}
        <div className="shrink-0 flex justify-center w-full px-2">
          <div className="inline-flex items-center gap-2.5 px-6 py-3 bg-white border border-slate-200/80 rounded-full max-w-full shadow-sm">
            <Search size={14} className="text-slate-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-800 break-all leading-none">{searchQuery}</span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-8 min-h-0">
          
          {/* LEFT COLUMN: Insights & Statistics */}
          <section className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Disclaimer Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 text-xs text-slate-500 leading-relaxed">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Disclaimer
              </span>
              <p>
                Sentilyst is an independent, non-commercial experiment. Sentiment analysis is inferred solely from public headlines for demonstration purposes. Not financial advice.
              </p>
            </div>

            {/* Cohesive Sentiment Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between min-h-[250px] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sentiment Split
                  </span>
                  {dominant === "positive" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      Bullish Consensus
                    </span>
                  ) : dominant === "negative" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                      Bearish Consensus
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200/80">
                      Split Consensus
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl sm:text-6xl font-light leading-none tracking-tight text-slate-900">
                      {heroValue}
                    </span>
                    <span className="text-2xl sm:text-3xl font-light text-slate-400">%</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-1 capitalize">
                    {dominant === "mixed" ? "Split consensus" : `${dominant} sentiment`}
                  </h3>
                </div>
              </div>

              {/* Visual breakdown progress bar */}
              <div className="mt-8 relative z-10">
                <div className="h-1.5 rounded-full overflow-hidden flex bg-slate-100">
                  <div
                    className="bg-emerald-500 transition-all duration-700"
                    style={{ width: `${positive}%` }}
                    title={`Positive: ${positive}%`}
                  />
                  <div
                    className="bg-rose-500 transition-all duration-700"
                    style={{ width: `${negative}%` }}
                    title={`Negative: ${negative}%`}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2.5 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Positive {positive}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Negative {negative}%
                  </span>
                </div>
              </div>
            </div>

            {/* Source counts and volumes */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Article Sources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <div className="flex items-center gap-2 text-slate-700 mb-2">
                    <SiGooglenews size={18} className="text-blue-600" />
                    <span className="text-sm font-semibold">Google News</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                    {googleCount}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">headlines analyzed</p>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <div className="flex items-center gap-2 text-slate-700 mb-2">
                    <Newspaper size={18} className="text-emerald-600" />
                    <span className="text-sm font-semibold">NewsAPI</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                    {newsApiCount}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">matched titles</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-600">
                <Database size={14} className="text-slate-400 shrink-0" />
                <span>
                  {cached ? (
                    <span className="font-semibold inline-flex items-center gap-0.5 text-slate-700">
                      <Zap size={10} className="fill-slate-500 text-slate-500" /> Cached Result
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" /> Live analysis completed in {processing_time}s
                    </span>
                  )}
                  {" · "}<strong>{totalArticles}</strong>{" articles loaded."}
                </span>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: Scraped Headlines Feed */}
          <section className="lg:col-span-7 flex flex-col bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 min-h-0">
            
            {/* Feed Toolbar / Filter */}
            <div className="shrink-0 pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Fetched Articles</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredArticles.length} of {totalArticles} total headlines
                </p>
              </div>

              {/* Source Filtering Selector */}
              <div className="relative self-start sm:self-auto">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none transition-all cursor-pointer select-none"
                >
                  <Filter size={13} className="text-slate-400" />
                  <span>
                    {selectedSource === "all"
                      ? `All Sources (${totalArticles})`
                      : selectedSource === "google_news"
                      ? `Google News (${googleCount})`
                      : `NewsAPI (${newsApiCount})`}
                  </span>
                  <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <>
                    {/* Overlay to close on outer click */}
                    <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                    
                    <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl py-1 z-40 shadow-xs animate-fadeInUp">
                      {[
                        { value: "all", label: `All Sources (${totalArticles})` },
                        { value: "google_news", label: `Google News (${googleCount})` },
                        { value: "newsapi", label: `NewsAPI (${newsApiCount})` }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedSource(option.value);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer block
                            ${selectedSource === option.value ? 'text-slate-900 bg-slate-50' : 'text-slate-500'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Headline Cards List */}
            <div className="flex-1 overflow-y-auto mt-6 pr-1 space-y-3 min-h-0 scrollbar-thin scrollbar-thumb-slate-200">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article, index) => (
                  <a
                    key={index}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-4 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 hover:border-slate-300 rounded-2xl transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        {/* Source Tag */}
                        <div className="flex items-center gap-1.5">
                          {article.source === "google_news" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 rounded-full">
                              <SiGooglenews size={10} className="text-blue-600" /> GOOGLE NEWS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-full">
                              <Newspaper size={10} className="text-emerald-600" /> NEWSAPI
                            </span>
                          )}
                        </div>
                        
                        {/* Title */}
                        <h4 className="text-xs sm:text-[14px] font-medium text-slate-800 group-hover:text-slate-950 leading-snug transition-colors">
                          {article.title}
                        </h4>
                      </div>

                      <div className="w-7 h-7 rounded-lg bg-white group-hover:bg-slate-900 border border-slate-200/80 group-hover:border-slate-900 flex items-center justify-center text-slate-400 group-hover:text-white transition-all duration-200 shrink-0 self-center">
                        <ExternalLink size={13} strokeWidth={2.5} />
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
                    <Newspaper size={20} />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">No headlines found</h4>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
