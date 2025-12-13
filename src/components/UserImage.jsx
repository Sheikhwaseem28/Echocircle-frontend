import { Box, CircularProgress, Avatar } from "@mui/material";
import { useState } from "react";
import { 
  User,
  ImageOff,
  CheckCircle,
  Camera
} from "lucide-react";

const UserImage = ({ 
  image, 
  size = "60px",
  showStatus = false,
  isOnline = false,
  border = false,
  borderColor = "white",
  borderSize = "2px",
  elevate = false,
  onClick,
  fallbackType = "icon", // 'icon' or 'initials'
  fallbackInitials = "",
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageUrl, setImageUrl] = useState(image);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Determine image source
  const getImageSource = () => {
    if (!image || hasError) return null;
    
    // Handle different image formats
    if (image.startsWith('http') || image.startsWith('https') || image.startsWith('data:')) {
      return image;
    }
    
    // Default to backend path
    return `https://echocircle-backend.vercel.app/assets/${image}`;
  };

  const imageSource = getImageSource();

  // Calculate border styles
  const borderStyle = border ? {
    border: `${borderSize} solid ${borderColor}`,
    boxShadow: elevate ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
  } : {};

  // Get size in pixels for calculations
  const sizeNum = parseInt(size);
  const statusSize = sizeNum * 0.25;
  const iconSize = sizeNum * 0.4;

  return (
    <Box
      className={`relative ${className}`}
      width={size}
      height={size}
      sx={{
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
          transition: 'transform 0.2s ease-in-out'
        } : {}
      }}
      onClick={onClick}
    >
      {/* Loading state */}
      {isLoading && imageSource && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: '50%',
            zIndex: 1,
          }}
        >
          <CircularProgress size={iconSize} />
        </Box>
      )}

      {/* Image or Fallback */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: hasError || !imageSource 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'transparent',
          ...borderStyle,
        }}
      >
        {imageSource && !hasError ? (
          <img
            src={imageSource}
            alt="User profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: isLoading ? 'none' : 'block'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            {fallbackType === 'initials' && fallbackInitials ? (
              <span style={{ 
                fontSize: sizeNum * 0.4, 
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {fallbackInitials}
              </span>
            ) : (
              <User size={iconSize} />
            )}
          </Box>
        )}
      </Box>

      {/* Online Status Indicator */}
      {showStatus && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: statusSize,
            height: statusSize,
            backgroundColor: isOnline ? '#10B981' : '#9CA3AF',
            border: '2px solid white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          {isOnline && (
            <CheckCircle 
              size={statusSize * 0.6} 
              style={{ color: 'white' }} 
            />
          )}
        </Box>
      )}

      {/* Edit Badge (for profile editing) */}
      {onClick && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: statusSize * 1.2,
            height: statusSize * 1.2,
            backgroundColor: '#3B82F6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out',
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          <Camera size={statusSize * 0.6} style={{ color: 'white' }} />
        </Box>
      )}
    </Box>
  );
};

// Pre-styled variants for common use cases
export const UserImageLarge = (props) => (
  <UserImage size="120px" border elevate {...props} />
);

export const UserImageMedium = (props) => (
  <UserImage size="80px" border showStatus {...props} />
);

export const UserImageSmall = (props) => (
  <UserImage size="40px" showStatus {...props} />
);

export const UserImageSquare = ({ size = "60px", ...props }) => (
  <Box width={size} height={size}>
    <UserImage 
      size={size} 
      {...props} 
      className="rounded-lg"
      style={{ borderRadius: '12px' }}
    />
  </Box>
);

// Component for displaying multiple user images (for group chats, etc.)
export const UserImageGroup = ({ users = [], maxDisplay = 3, size = "40px" }) => {
  const usersToShow = users.slice(0, maxDisplay);
  const remainingCount = users.length - maxDisplay;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {usersToShow.map((user, index) => (
        <Box
          key={user.id || index}
          sx={{
            marginLeft: index > 0 ? '-8px' : 0,
            position: 'relative',
            zIndex: usersToShow.length - index,
            border: '2px solid white',
            borderRadius: '50%',
          }}
        >
          <UserImage
            image={user.image}
            size={size}
            fallbackInitials={user.name?.charAt(0)}
            showStatus={user.isOnline}
          />
        </Box>
      ))}
      
      {remainingCount > 0 && (
        <Box
          sx={{
            marginLeft: '-8px',
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: '#6B7280',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `calc(${size} * 0.4)`,
            fontWeight: 'bold',
            border: '2px solid white',
            zIndex: 1,
          }}
        >
          +{remainingCount}
        </Box>
      )}
    </Box>
  );
};

export default UserImage;


// import { Box } from "@mui/material";

// const UserImage = ({ image, size = "60px" }) => {
//   return (
//     <Box width={size} height={size}>
//       <img
//         style={{ objectFit: "cover", borderRadius: "50%" }}
//         width={size}
//         height={size}
//         alt="user"
//         src={`https://echocircle-backend.vercel.app/assets/${image}`}
//       />
//     </Box>
//   );
// };

// export default UserImage;