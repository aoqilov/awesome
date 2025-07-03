// routes/index.tsx
import { QueryParamProvider } from "@/hooks/useQueryParam";
import DashboardLayout from "@/layout/Dashboard.layout";
import MainMiddleware from "@/middleware/MainMiddleware";
import { PageTransition } from "@/shared/Motion";

// Manager Pages
import MainPage from "@/pages/Routes/MainPage";
import StadiumList from "@/pages/ManagerPages/Stadion/StadionMain";
import StadionDetail from "@/pages/ManagerPages/Stadion/Detail/StadionDetail";
import AddStadionPage from "@/pages/ManagerPages/AddStadion/Stadion";
import AddField from "@/pages/ManagerPages/AddField/AddField";
import Schedule from "@/pages/ManagerPages/Schedule/Schedule";
import Orders from "@/pages/ManagerPages/Orders/Orders";
import Profile from "@/pages/Profile/Profile";

// Player Pages
import MainPlayer from "@/pages/PlayerPages/HomePlayer/MainPlayer";
import MainSearch from "@/pages/PlayerPages/MainSearch/MainSearch";
import StadionFilter from "@/pages/PlayerPages/StadionFilter/StadionFilter";
import MoreArena from "@/pages/PlayerPages/Arena/MoreArena";
import ArenaOrder from "@/pages/PlayerPages/Arena/arena-order/ArenaOrder";
import ArenaConfirmed from "@/pages/PlayerPages/Arena/ArenaConfirmed";
import ArenaSms from "@/pages/PlayerPages/Arena/ArenaSms";
import MainOrder from "@/pages/PlayerPages/MainOrder/MainOrder";
import ProfileUser from "@/pages/PlayerPages/ProfileUser/ProfileUser";
import ProfileEdit from "@/pages/PlayerPages/ProfileUser/ProfileEdit";

// Register & Fallback
import RegisterPage from "@/pages/Register/Register";
import NotFound from "@/pages/Not-found";
import Message from "@/pages/PlayerPages/Message/Message";
import { RegisterProvider } from "@/contexts/RegisterContext";
import { UserProvider } from "@/contexts/UserContext";
import StadionMapSearch from "@/pages/PlayerPages/MapSearch/StadionMapSearch";

export const router = [
  {
    path: "/",
    element: (
      <UserProvider>
        <RegisterProvider>
          <QueryParamProvider>
            <MainMiddleware />
          </QueryParamProvider>
        </RegisterProvider>
      </UserProvider>
    ),
    children: [
      // MANAGER ROUTES
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { path: "home", element: <MainPage /> },
          { path: "stadium", element: <StadiumList /> },
          { path: "stadium/add-stadium", element: <AddStadionPage /> },
          { path: "stadium/:id", element: <StadionDetail /> },
          { path: "stadium/:id/schedule/:fieldId", element: <Schedule /> },
          { path: "stadium/:id/add-field", element: <AddField /> },
          { path: "orders", element: <Orders /> },
          { path: "profile", element: <Profile /> },

          { path: "*", element: <NotFound /> },
        ].map((route) => ({
          ...route,
          element: <PageTransition>{route.element}</PageTransition>,
        })),
      },

      // PLAYER ROUTES
      {
        path: "client",
        element: <DashboardLayout />,
        children: [
          { path: "home", element: <MainPlayer /> },
          { path: "search", element: <MainSearch /> },
          { path: "arena/:id", element: <ArenaOrder /> },
          { path: "arena", element: <MoreArena /> },

          { path: "arenaconfirmed", element: <ArenaConfirmed /> },
          { path: "arenasms", element: <ArenaSms /> },
          { path: "filter", element: <StadionFilter /> },
          { path: "map", element: <StadionMapSearch /> },
          { path: "orders", element: <MainOrder /> },
          { path: "profile", element: <ProfileUser /> },
          { path: "edit", element: <ProfileEdit /> },
          { path: "messages", element: <Message /> },
        ].map((route) => ({
          ...route,
          element: <PageTransition>{route.element}</PageTransition>,
        })),
      },

      // REGISTER
      {
        path: "register",
        element: (
          <PageTransition>
            <RegisterPage />
          </PageTransition>
        ),
      },

      // 404 fallback
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

// import { QueryParamProvider } from "@/hooks/useQueryParam";
// import DashboardLayout from "@/layout/Dashboard.layout";
// import MainMiddleware from "@/middleware/MainMiddleware";
// import AddField from "@/pages/ManagerPages/AddField/AddField";
// import AddStadionPage from "@/pages/ManagerPages/AddStadion/Stadion";
// import Orders from "@/pages/ManagerPages/Orders/Orders";
// import Schedule from "@/pages/ManagerPages/Schedule/Schedule";
// import StadionDetail from "@/pages/ManagerPages/Stadion/Detail/StadionDetail";
// import StadiumList from "@/pages/ManagerPages/Stadion/StadionMain";
// import Profile from "@/pages/Profile/Profile";

// // player pages
// import MainPlayer from "@/pages/PlayerPages/HomePlayer/MainPlayer";
// // REGISETER PAGE
// import RegisterPage from "@/pages/Register/Register";
// import MainSearch from "@/pages/PlayerPages/MainSearch/MainSearch";

// import MainPage from "@/pages/Routes/MainPage";

// import { PageTransition } from "@/shared/Motion";
// import MainOrder from "@/pages/PlayerPages/MainOrder/MainOrder";
// import StadionFilter from "@/pages/PlayerPages/StadionFilter/StadionFilter";
// import ProfileUser from "@/pages/PlayerPages/ProfileUser/ProfileUser";
// import ProfileEdit from "@/pages/PlayerPages/ProfileUser/ProfileEdit";
// import MoreArena from "@/pages/PlayerPages/Arena/MoreArena";
// import ArenaOrder from "@/pages/PlayerPages/Arena/ArenaOrder";
// import ArenaConfirmed from "@/pages/PlayerPages/Arena/ArenaConfirmed";
// import ArenaSms from "@/pages/PlayerPages/Arena/ArenaSms";
// import Til from "@/pages/PlayerPages/auth/til";

// export const router = [
//   {
//     path: "/",

//     element: (
//       <QueryParamProvider>
//         <MainMiddleware />
//       </QueryParamProvider>
//     ),
//     children: [
//       // TODO: Asosiy Router shu yerda yoziladi
//       {
//         path: "dashboard",
//         element: <DashboardLayout />,
//         children: [
//           {
//             path: "home",
//             element: <MainPage />,
//           },

//           {
//             path: "stadium",
//             element: <StadiumList />,
//           },
//           { path: "stadium/add-stadium", element: <AddStadionPage /> },
//           {
//             path: "stadium/:id",
//             element: <StadionDetail />,
//           },
//           {
//             path: "stadium/:id/schedule/:fieldId",
//             element: <Schedule />,
//           },
//           { path: "stadium/:id/add-field", element: <AddField /> },
//           { path: "orders", element: <Orders /> },
//           { path: "profile", element: <Profile /> },
//           {
//             path: "*",
//             element: "404",
//           },
//         ].map((route) => ({
//           ...route,
//           element: <PageTransition>{route.element}</PageTransition>,
//         })),
//       },
//       {
//         path: "client",
//         element: <DashboardLayout />,
//         children: [
//           {
//             path: "til",
//             element: <Til />,
//           },
//           {
//             path: "home",
//             element: <MainPlayer />,
//           },
//           {
//             path: "search",
//             element: <MainSearch />,
//           },
//           {
//             path: "arena",
//             element: <MoreArena />,
//           },
//           {
//             path: "arenaconfirmed",
//             element: <ArenaConfirmed />,
//           },
//           {
//             path: "arenasms",
//             element: <ArenaSms />,
//           },
//           {
//             path: "arenaorder",
//             element: <ArenaOrder />,
//           },
//           {
//             path: "filter",
//             element: <StadionFilter />,
//           },
//           {
//             path: "orders",
//             element: <MainOrder />,
//           },
//           {
//             path: "profile",
//             element: <ProfileUser />,
//           },
//           {
//             path: "edit",
//             element: <ProfileEdit />,
//           },
//         ],
//       },
//       {
//         path: "register",
//         element: (
//           <PageTransition>
//             <RegisterPage />
//           </PageTransition>
//         ),
//       },
//     ],
//   },
// ];
