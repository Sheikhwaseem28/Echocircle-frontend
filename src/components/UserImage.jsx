const UserImage = ({ image, size = "60px" }) => {
  return (
    <div 
      className="flex h-[60px] w-[60px] overflow-hidden rounded-full" 
      style={{ width: size, height: size }}
    >
      <img
        src={`https://echocircle-backend.vercel.app/assets/${image}`}
        alt="user"
        className="h-full w-full object-cover"
        style={{ width: size, height: size }}
      />
    </div>
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