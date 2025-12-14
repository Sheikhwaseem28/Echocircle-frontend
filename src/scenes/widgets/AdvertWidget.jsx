import { useState } from "react";
import { TrendingUp, Sparkles, Target, Zap, Award, Shield, Star, ExternalLink, X, ChevronRight } from "lucide-react";

const AdvertWidget = () => {
  const [dismissedAds, setDismissedAds] = useState([]);
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  const ads = [
    {
      id: 1,
      title: "EchoCircle Pro",
      company: "EchoCircle",
      description: "Upgrade to Pro for advanced analytics, unlimited circles, and priority support.",
      cta: "Try Free for 30 Days",
      url: "#pro",
      icon: <Award size={24} className="text-amber-400" />,
      color: "from-amber-500/10 to-amber-600/10",
      borderColor: "border-amber-500/20",
      stats: "Join 5K+ professionals",
      tag: "RECOMMENDED",
      features: ["Advanced Analytics", "Unlimited Circles", "Priority Support", "Custom Themes"]
    },
    {
      id: 2,
      title: "Design Masterclass",
      company: "CreativeMinds",
      description: "Learn UI/UX design from industry experts. Limited spots available.",
      cta: "Enroll Now",
      url: "#design",
      icon: <Sparkles size={24} className="text-purple-400" />,
      color: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      stats: "4.9/5 ★ from 2.3K reviews",
      tag: "POPULAR",
      features: ["60+ Lessons", "Certificate", "Mentorship", "Projects"]
    },
    {
      id: 3,
      title: "Secure Cloud Storage",
      company: "SafeVault",
      description: "End-to-end encrypted cloud storage with 2TB free for EchoCircle users.",
      cta: "Claim Free Storage",
      url: "#storage",
      icon: <Shield size={24} className="text-blue-400" />,
      color: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20",
      stats: "Trusted by 50K+ users",
      tag: "EXCLUSIVE",
      features: ["2TB Free", "End-to-End Encrypted", "File Sharing", "Cross-Platform"]
    },
    {
      id: 4,
      title: "Productivity Suite",
      company: "FlowState",
      description: "All-in-one productivity tools designed for remote teams and creators.",
      cta: "Start Free Trial",
      url: "#productivity",
      icon: <Zap size={24} className="text-green-400" />,
      color: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
      stats: "3x productivity boost",
      tag: "TRENDING",
      features: ["Task Management", "Time Tracking", "Team Collaboration", "Automations"]
    }
  ];

  const activeAd = ads[activeAdIndex];
  const isSponsored = activeAd.company !== "EchoCircle";

  const handleDismiss = (adId) => {
    setDismissedAds([...dismissedAds, adId]);
    setActiveAdIndex((prev) => (prev + 1) % ads.length);
  };

  const handleNextAd = () => {
    setActiveAdIndex((prev) => (prev + 1) % ads.length);
  };

  if (ads.length === dismissedAds.length) {
    return (
      <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-6">
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No ads to show</h3>
          <p className="text-gray-400">You've seen all available promotions</p>
          <button
            onClick={() => setDismissedAds([])}
            className="mt-4 px-4 py-2 text-sm text-rose-400 hover:text-rose-300"
          >
            Reset ads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-rose-500/20 to-red-500/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Discover</h2>
              <p className="text-sm text-gray-400">Promotions & offers</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs px-3 py-1 rounded-full bg-gray-800/50 text-gray-300 border border-gray-700">
              {activeAdIndex + 1}/{ads.length}
            </button>
            <button
              onClick={() => handleDismiss(activeAd.id)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/30 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex gap-1 mt-4">
          {ads.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all ${
                index === activeAdIndex
                  ? "bg-rose-500"
                  : index < activeAdIndex
                  ? "bg-gray-700"
                  : "bg-gray-800/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Ad Content */}
      <div className="p-6">
        {/* Tag */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-rose-500/10 to-red-500/10 text-rose-400 border border-rose-500/20">
            {activeAd.tag}
          </span>
          {isSponsored && (
            <span className="text-xs text-gray-500">Sponsored</span>
          )}
        </div>

        {/* Ad Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`h-16 w-16 rounded-xl ${activeAd.color} border ${activeAd.borderColor} flex items-center justify-center flex-shrink-0`}>
            {activeAd.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{activeAd.title}</h3>
            <p className="text-sm text-gray-400">{activeAd.company}</p>
            <div className="flex items-center gap-2 mt-2">
              <Star size={12} className="text-amber-400 fill-current" />
              <span className="text-xs text-gray-300">{activeAd.stats}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 leading-relaxed mb-6">
          {activeAd.description}
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {activeAd.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
              <div className="h-5 w-5 rounded-full bg-gray-800/50 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-400"></div>
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href={activeAd.url}
          className="block w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all text-center mb-4"
        >
          {activeAd.cta}
        </a>

        {/* Legal */}
        <p className="text-xs text-gray-500 text-center">
          By clicking, you agree to our terms. We never share your data.
        </p>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-gray-800/50 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleDismiss(activeAd.id)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Not interested
          </button>
          <button
            onClick={handleNextAd}
            className="flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300 transition-colors"
          >
            Next offer
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Ad Indicator */}
      <div className="px-6 py-3 bg-gradient-to-r from-gray-900/80 to-black/80 border-t border-gray-800/50">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-green-400" />
            <span className="text-gray-400">Verified partner • Safe & secure</span>
          </div>
          <span className="text-gray-500">Advertisement</span>
        </div>
      </div>
    </div>
  );
};

export default AdvertWidget;