// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { SocketProvider } from "./context/SocketContext";
// import { lazy, Suspense } from "react";
// import Spinner from "./components/Spinner";
// import Header from "./components/Header";
// import Home from "./pages/Home";
// import EmergencyAlert from "./components/EmergencyAlert";
// const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
// const ResetPassword = lazy(() => import("./pages/ResetPassword"));
// const HomeShelter = lazy(() => import("./pages/HomeShelter"));
// const HomeHospital = lazy(() => import("./pages/HomeHospital"));
// const SignUp = lazy(() => import("./pages/SignUp"));
// const Login = lazy(() => import("./pages/Login"));
// const About = lazy(() => import("./pages/About"));
// const Dashboard = lazy(() => import("./pages/Dashboard"));
// const UpdatePage = lazy(() => import("./pages/UpdatePage"));
// const AddShelter = lazy(() => import("./components/Shelters/AddShelter"));
// const ShowShelter = lazy(() => import("./components/Shelters/ShowShelter"));
// const AddHospital = lazy(() => import("./components/Hospital/AddHospital"));
// const ShowHospital = lazy(() => import("./components/Hospital/ShowHospital"));
// const AllVolunteers = lazy(() => import("./pages/AllVolunteers"));
// const AssignTask = lazy(() =>
//   import("./components/VolunteerComponent/AssignTask")
// );

// // const CreateResponder = lazy(() => import("./pages/CreateResponder"));
// // const AllResponders = lazy(() => import("./pages/AllResponders"));
// const ShowTask = lazy(() => import("./components/VolunteerComponent/ShowTask"));
// const AllTasks = lazy(() => import("./components/VolunteerComponent/AllTasks"));
// const CreateTask = lazy(() =>
//   import("./components/VolunteerComponent/CreateTask")
// );
// const EditTask = lazy(() => import("./components/VolunteerComponent/EditTask"));
// const GetPlan = lazy(() => import("./pages/GetPlan"));
// const CreatePlan = lazy(() => import("./pages/CreatePlan"));
// const UpdatePlan = lazy(() => import("./pages/UpdatePlan"));
// const EmergencyPage = lazy(() => import("./pages/EmergencyPage"));

// const AlertPage = lazy(() => import("./pages/AlertPage"));
// const CommunityPage = lazy(() => import("./pages/CommunityPage"));
// const DonateMoney = lazy(() => import("./pages/DonateMoney"));
// const DonateSupplies = lazy(() => import("./pages/DonateSupplies"));
// const ShowEmergencies = lazy(() =>
//   import("./components/Emergency/ShowEmergencies")
// );
// const HeroPage = lazy(() => import("./pages/HeroPage"));
// const DashShelters = lazy(() => import("./pages/DashShelters"));
// const DashHospital = lazy(() => import("./pages/DashHospital"));

// function App() {
//   const currentUser = useSelector((state) => state.user.currentUser);

//   return (
//     <SocketProvider>
//       <Router>
//         <Header />
//         <ToastContainer />
//         <EmergencyAlert />
//         <Suspense fallback={<Spinner />}>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/forgotpassword" element={<ForgotPassword />} />
//             <Route path="/resetpassword/:token" element={<ResetPassword />} />
//             <Route path="/shelter/:shelterId" element={<HomeShelter />} />
//             <Route path="/hospital/:hospitalId" element={<HomeHospital />} />
//             {currentUser ? (
//               <Route path="/" element={<HeroPage />}>
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/profile" element={<UpdatePage />} />
//                 <Route path="/add-shelter" element={<AddShelter />} />
//                 <Route path="/add-hospital" element={<AddHospital />} />
//                 <Route path="/shelter/:shelterId" element={<ShowShelter />} />
//                 <Route path="/hospital/:hospitalId" element={<ShowHospital />} />
//                 <Route path="/volunteers" element={<AllVolunteers />} />
//                 <Route path="/admin/assign-task/:id" element={<AssignTask />} />
//                 <Route path="/admin/tasks" element={<AllTasks />} />
//                 <Route path="/tasks" element={<ShowTask />} />
//                 <Route path="/incidents" element={<ShowEmergencies />} />
//                 <Route path="/create-task" element={<CreateTask />} />

//                 <Route path="/update-task/:taskId" element={<EditTask />} />
//                 {/* <Route
//                   path="/allocate/:incidentId"
//                   element={<AllResponders />}
//                 /> */}
//                 {/* <Route path="/create-responder" element={<CreateResponder />} /> */}
//                 {/* <Route path="/allresponders" element={<AllResponders />} /> */}
//                 <Route path="/shelter" element={<DashShelters />} />
//                 <Route path="/hospital" element={<DashHospital />} />
//                 <Route path="/plans" element={<GetPlan />} />
//                 <Route path="/createplan" element={<CreatePlan />} />
//                 <Route path="/updateplan" element={<UpdatePlan />} />
//                 <Route path="/emergencies" element={<EmergencyPage />} />
//                 <Route path="/alerts" element={<AlertPage />} />
//                 <Route path="/community" element={<CommunityPage />} />
//                 <Route path="/donatemoney" element={<DonateMoney />} />

//                 <Route path="/donatesupplies" element={<DonateSupplies />} />
//               </Route>
//             ) : null}
//           </Routes>
//         </Suspense>
//       </Router>
//     </SocketProvider>
//   );
// }

// export default App;

import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from "./context/SocketContext";
import Spinner from "./components/Spinner";
import Header from "./components/Header";
import Home from "./pages/Home";
import EmergencyAlert from "./components/EmergencyAlert";
import DashSidebar from "./components/DashSidebar";

// Lazy-loaded components
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const HomeShelter = lazy(() => import("./pages/HomeShelter"));
const HomeHospital = lazy(() => import("./pages/HomeHospital"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));
const About = lazy(() => import("./pages/About"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UpdatePage = lazy(() => import("./pages/UpdatePage"));
const AddShelter = lazy(() => import("./components/Shelters/AddShelter"));
const ShowShelter = lazy(() => import("./components/Shelters/ShowShelter"));
const AddHospital = lazy(() => import("./components/Hospital/AddHospital"));
const ShowHospital = lazy(() => import("./components/Hospital/ShowHospital"));
const AllVolunteers = lazy(() => import("./pages/AllVolunteers"));
const AssignTask = lazy(() => import("./components/VolunteerComponent/AssignTask"));
const ShowTask = lazy(() => import("./components/VolunteerComponent/ShowTask"));
const AllTasks = lazy(() => import("./components/VolunteerComponent/AllTasks"));
const CreateTask = lazy(() => import("./components/VolunteerComponent/CreateTask"));
const EditTask = lazy(() => import("./components/VolunteerComponent/EditTask"));
const GetPlan = lazy(() => import("./pages/GetPlan"));
const CreatePlan = lazy(() => import("./pages/CreatePlan"));
const UpdatePlan = lazy(() => import("./pages/UpdatePlan"));
const EmergencyPage = lazy(() => import("./pages/EmergencyPage"));
const AlertPage = lazy(() => import("./pages/AlertPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const DonateMoney = lazy(() => import("./pages/DonateMoney"));
const DonateSupplies = lazy(() => import("./pages/DonateSupplies"));
const ShowEmergencies = lazy(() => import("./components/Emergency/ShowEmergencies"));
const HeroPage = lazy(() => import("./pages/HeroPage"));
const DashShelters = lazy(() => import("./pages/DashShelters"));
const DashHospital = lazy(() => import("./pages/DashHospital"));

function AppLayout() {
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.currentUser);

  const hideSidebarPaths = ["/", "/about"];
  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);

  return (
    <>
      <Header />
      <ToastContainer />
      <EmergencyAlert />
      <div className="flex">
        {!shouldHideSidebar && <DashSidebar />}
        <div className="flex-grow">
          <Suspense fallback={<Spinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/resetpassword/:token" element={<ResetPassword />} />
              <Route path="/shelter/:shelterId" element={<HomeShelter />} />
              <Route path="/hospital/:hospitalId" element={<HomeHospital />} />

              {/* Protected Routes */}
              {currentUser && (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<UpdatePage />} />

                  {/* Shelter Routes */}
                  <Route path="/shelters" element={<DashShelters />} />
                  <Route path="/add-shelter" element={<AddShelter />} />
                  <Route path="/shelters/view/:shelterId" element={<ShowShelter />} />
                  {/* <Route path="/shelter/:shelterId" element={<ShowShelter />} /> */}

                  {/* Hospital Routes */}
                  <Route path="/hospitals" element={<DashHospital />} />
                  <Route path="/add-hospital" element={<AddHospital />} />
                  <Route path="/hospital/:hospitalId" element={<ShowHospital />} />

                  {/* Volunteer & Task Routes */}
                  <Route path="/volunteers" element={<AllVolunteers />} />
                  <Route path="/admin/assign-task/:id" element={<AssignTask />} />
                  <Route path="/admin/tasks" element={<AllTasks />} />
                  <Route path="/create-task" element={<CreateTask />} />
                  <Route path="/update-task/:taskId" element={<EditTask />} />
                  <Route path="/tasks" element={<ShowTask />} />

                  {/* Plans & Emergencies */}
                  <Route path="/plans" element={<GetPlan />} />
                  <Route path="/createplan" element={<CreatePlan />} />
                  <Route path="/updateplan" element={<UpdatePlan />} />
                  <Route path="/emergencies" element={<EmergencyPage />} />
                  <Route path="/incidents" element={<ShowEmergencies />} />

                  {/* Community */}
                  <Route path="/alerts" element={<AlertPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/donatemoney" element={<DonateMoney />} />
                  <Route path="/donatesupplies" element={<DonateSupplies />} />

                  {/* Fallback */}
                  <Route path="/hero" element={<HeroPage />} />
                </>
              )}
            </Routes>
          </Suspense>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <SocketProvider>
      <Router>
        <AppLayout />
      </Router>
    </SocketProvider>
  );
}

export default App;
