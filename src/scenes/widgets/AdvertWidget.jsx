import { Typography, useTheme, IconButton, Box } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import {
  TrendingUp,
  ExternalLink,
  Star,
  ChevronRight,
  Zap,
  Target,
  Award,
  Sparkles,
  ShoppingBag,
  Tag,
  X,
  Info,
} from "lucide-react";
import { useState } from "react";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const { dark, main, medium } = palette.neutral;
  const [isClosed, setIsClosed] = useState(false);

  // Mock ad data
  const ads = [
    {
      id: 1,
      title: "Premium Protein Supplement",
      description: "Fuel your muscles with the highest quality whey protein on the market. Scientifically formulated for maximum results.",
      url: "supplements.com",
      category: "Fitness",
      rating: 4.8,
      sponsoredBy: "EchoCircle Verified",
      imageColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
      icon: <Target size={20} />,
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      id: 2,
      title: "Smart Home Bundle",
      description: "Transform your home with our smart device bundle. Easy setup, seamless integration.",
      url: "smarthome.com",
      category: "Technology",
      rating: 4.9,
      sponsoredBy: "Partner",
      imageColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      icon: <Zap size={20} />,
      badgeColor: "bg-purple-100 text-purple-700",
    },
    {
      id: 3,
      title: "Eco-Friendly Essentials",
      description: "Sustainable products for a greener lifestyle. Join the movement towards zero waste.",
      url: "ecofriendly.com",
      category: "Lifestyle",
      rating: 4.7,
      sponsoredBy: "Eco Partner",
      imageColor: "bg-gradient-to-r from-emerald-500 to-green-500",
      icon: <Sparkles size={20} />,
      badgeColor: "bg-emerald-100 text-emerald-700",
    },
  ];

  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const currentAd = ads[currentAdIndex];

  const handleNextAd = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  const handleClose = () => {
    setIsClosed(true);
    // In a real app, you might want to save this preference
    localStorage.setItem('adWidgetClosed', 'true');
  };

  if (isClosed) {
    return (
      <WidgetWrapper>
        <div className="text-center py-6">
          <ShoppingBag size={24} className="mx-auto text-gray-400 mb-2" />
          <Typography color={medium} className="text-sm">
            Advertisement content is currently hidden
          </Typography>
          <button
            onClick={() => setIsClosed(false)}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Show ads
          </button>
        </div>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper className="relative group">
      {/* Close button */}
      <IconButton
        size="small"
        onClick={handleClose}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        sx={{ zIndex: 10 }}
      >
        <X size={16} />
      </IconButton>

      {/* Header */}
      <FlexBetween className="mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <Typography variant="h6" fontWeight="600" color={dark}>
              Sponsored
            </Typography>
            <Typography variant="caption" color={medium}>
              Advertisement • {ads.length} available
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <Info size={14} />
          <Typography variant="caption">Promoted</Typography>
        </div>
      </FlexBetween>

      {/* Ad Image/Placeholder */}
      <div className="relative mb-4">
        <div
          className={`${currentAd.imageColor} rounded-xl h-40 overflow-hidden relative`}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          
          {/* Ad content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <div className="flex items-center justify-between">
              <div className={`px-3 py-1 ${currentAd.badgeColor} text-xs font-medium rounded-full`}>
                {currentAd.category}
              </div>
              <div className="flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded-lg">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-medium">{currentAd.rating}</span>
              </div>
            </div>
          </div>
          
          {/* Ad icon */}
          <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-lg">
            {currentAd.icon}
          </div>
        </div>
        
        {/* Ad navigation dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAdIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentAdIndex
                  ? 'w-6 bg-blue-500'
                  : 'w-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Ad Content */}
      <div className="space-y-3">
        <div>
          <FlexBetween className="mb-1">
            <Typography variant="h6" fontWeight="600" color={dark}>
              {currentAd.title}
            </Typography>
            <button
              onClick={handleNextAd}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              Next ad
              <ChevronRight size={12} />
            </button>
          </FlexBetween>
          
          <Typography variant="body2" color={medium} className="mb-2">
            {currentAd.description}
          </Typography>
        </div>

        {/* URL and Sponsor */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-gray-600">
              <ExternalLink size={14} />
              <Typography variant="caption" fontWeight="500">
                {currentAd.url}
              </Typography>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <Tag size={14} className="text-gray-400" />
              <Typography variant="caption" color={medium}>
                {currentAd.sponsoredBy}
              </Typography>
            </div>
          </div>
          
          <button className="text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
            Learn More
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg transition-colors text-sm font-medium">
            <ShoppingBag size={16} />
            Visit Store
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition-colors text-sm font-medium">
            <Award size={16} />
            Get Offer
          </button>
        </div>

        {/* Footer note */}
        <div className="pt-2">
          <Typography variant="caption" color={medium} className="text-center block">
            Advertisement • Your support helps keep EchoCircle free
          </Typography>
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default AdvertWidget;


// import { Typography, useTheme } from "@mui/material";
// import FlexBetween from "../../components/FlexBetween";
// import WidgetWrapper from "../../components/WidgetWrapper";

// const AdvertWidget = () => {
//   const { palette } = useTheme();
//   const { dark, main, medium } = palette.neutral;

//   return (
//     <WidgetWrapper>
//       <FlexBetween>
//         <Typography color={dark} variant="h5" fontWeight="500">
//           Sponsored
//         </Typography>
//         <Typography color={medium}>Create Ad</Typography>
//       </FlexBetween>
      
//       {/* Replace with a local image or shorter URL */}
//       <div style={{
//         backgroundColor: palette.neutral.light,
//         borderRadius: "0.75rem",
//         margin: "0.75rem 0",
//         height: "200px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center"
//       }}>
//         <Typography color={medium}>Ad Space</Typography>
//       </div>
      
//       <FlexBetween>
//         <Typography color={main}>Protien</Typography>
//         <Typography color={medium}>supplements.com</Typography>
//       </FlexBetween>
      
//       <Typography color={medium} m="0.5rem 0">
//         Fuel your muscles with the highest quality whey protein on the market...
//       </Typography>
//     </WidgetWrapper>
//   );
// };

// export default AdvertWidget;