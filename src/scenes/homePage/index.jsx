import { useSelector } from "react-redux";
import Navbar from "../../scenes/navbar/index";
import UserWidget from "../../scenes/widgets/UserWidget";
import MyPostWidget from "../../scenes/widgets/MyPostWidget";
import PostsWidget from "../../scenes/widgets/PostsWidget";
import AdvertWidget from "../../scenes/widgets/AdvertWidget";
import FriendListWidget from "../../scenes/widgets/FriendListWidget";

const HomePage = () => {
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <Navbar />

      {/* Mobile-first main feed */}
      <main className="mx-auto w-full max-w-6xl px-3 pb-20 pt-3 sm:px-4 lg:px-6">
        {/* Mobile heading */}
        <header className="mb-3 flex items-center justify-between border-b border-red-900/60 pb-2">
          <h1 className="text-base font-semibold text-neutral-50">
            Home
          </h1>
          <p className="text-[11px] text-neutral-500">
            Echoes from your circle
          </p>
        </header>

        {/* Feed first on mobile */}
        <section className="space-y-3 sm:space-y-4 lg:space-y-5">
          {/* Composer always on top */}
          <div className="rounded-2xl border border-red-900/70 bg-neutral-950/90 p-3 sm:p-4 shadow-[0_0_24px_rgba(127,29,29,0.45)]">
            <MyPostWidget picturePath={picturePath} />
          </div>

          {/* Posts feed - single column on mobile */}
          <div className="space-y-3 sm:space-y-4">
            <PostsWidget userId={_id} />
          </div>
        </section>

        {/* Supporting content under feed on mobile, in columns on desktop */}
        <section className="mt-5 grid grid-cols-1 gap-4 lg:mt-8 lg:grid-cols-[1.1fr,1.1fr]">
          {/* Profile + friends */}
          <div className="space-y-3 lg:space-y-4">
            <div className="rounded-2xl border border-red-900/70 bg-neutral-950/85 p-3 sm:p-4">
              <UserWidget userId={_id} picturePath={picturePath} />
            </div>
            <div className="rounded-2xl border border-red-900/70 bg-neutral-950/85 p-3 sm:p-4">
              <FriendListWidget userId={_id} />
            </div>
          </div>

          {/* Ads / extra */}
          <div className="space-y-3 lg:space-y-4">
            <div className="rounded-2xl border border-red-900/70 bg-neutral-950/85 p-3 sm:p-4">
              <AdvertWidget />
            </div>
          </div>
        </section>
      </main>

      {/* (Optional) bottom space reserved if you later add a bottom nav */}
      <div className="h-0 lg:h-0" />
    </div>
  );
};

export default HomePage;



// import { Box, useMediaQuery } from "@mui/material";
// import { useSelector } from "react-redux";
// import Navbar from "../../scenes/navbar/index";
// import UserWidget from "../../scenes/widgets/UserWidget";
// import MyPostWidget from "../../scenes/widgets/MyPostWidget";
// import PostsWidget from "../../scenes/widgets/PostsWidget";
// import AdvertWidget from "../../scenes/widgets/AdvertWidget";
// import FriendListWidget from "../../scenes/widgets/FriendListWidget";

// const HomePage = () => {
//   const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
//   const { _id, picturePath } = useSelector((state) => state.user);

//   return (
//     <Box>
//       <Navbar />
//       <Box
//         width="100%"
//         padding="2rem 6%"
//         display={isNonMobileScreens ? "flex" : "block"}
//         gap="0.5rem"
//         justifyContent="space-between"
//       >
//         <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
//           <UserWidget userId={_id} picturePath={picturePath} />
//         </Box>
//         <Box
//           flexBasis={isNonMobileScreens ? "42%" : undefined}
//           mt={isNonMobileScreens ? undefined : "2rem"}
//         >
//           <MyPostWidget picturePath={picturePath} />
//           <PostsWidget userId={_id} />
//         </Box>
//         {isNonMobileScreens && (
//           <Box flexBasis="26%">
//             <AdvertWidget />
//             <Box m="2rem 0" />
//             <FriendListWidget userId={_id} />
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };


// export default HomePage;