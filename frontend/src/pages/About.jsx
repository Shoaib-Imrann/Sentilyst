import React from "react";
import { ChartBar, Newspaper, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="shrink-0 relative z-10 border-b border-slate-200/50 bg-white px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span>Back</span>
            </Link>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="ptserif text-sm font-bold text-slate-800">Sentilyst</span>
            </div>
          </div>
          
          <div className="flex items-center gap-5 text-xs font-semibold text-slate-400">
            <Link to="/news" className="hover:text-slate-900 transition-colors">News</Link>
            <Link to="/about" className="hover:text-slate-900 transition-colors text-slate-900 font-bold">About</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl ptserif text-slate-800 tracking-tight mt-0.5">Sentilyst</h1>
        </div>

        <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
          A sentiment analysis tool that searches M&A-related news, classifies headline sentiment with a pre-trained DistilBERT model, and visualizes the overall tone.
        </p>

        <div className="h-px bg-slate-200/60 my-4" />

        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          How it works
        </h2>
        <div className="space-y-4">
          {[
            {
              icon: Newspaper,
              title: "News collection",
              text: "Fetches M&A-related headlines from Google News and NewsAPI for your search query.",
            },
            {
              icon: ChartBar,
              title: "Sentiment analysis",
              text: "Classifies each headline as positive or negative with a pre-trained DistilBERT model.",
            },
            {
              icon: TrendingUp,
              title: "Visualization",
              text: "Shows a consolidated sentiment split breakdown and lists all the matching headlines with link sources.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex gap-4 p-5 bg-white border border-slate-200/80 rounded-2xl"
            >
              <div className="w-10 h-10 shrink-0 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                <Icon size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
