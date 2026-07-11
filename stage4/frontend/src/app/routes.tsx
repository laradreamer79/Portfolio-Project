import { createBrowserRouter } from "react-router-dom";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { Centers } from "./pages/Centers";
import { CenterDetail } from "./pages/CenterDetail";
import { Trips } from "./pages/Trips";
import { TripDetail } from "./pages/TripDetail";
import { Courses } from "./pages/Courses";
import { CourseDetail } from "./pages/CourseDetail";
import { About } from "./pages/About";
import { Booking } from "./pages/Booking";
import { Auth } from "./pages/Auth";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CenterDashboard } from "./pages/CenterDashboard";
import { InstructorDashboard } from "./pages/InstructorDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "centers", Component: Centers },
      { path: "centers/:id", Component: CenterDetail },
      { path: "trips", Component: Trips },
      { path: "trips/:id", Component: TripDetail },
      { path: "courses", Component: Courses },
      { path: "courses/:id", Component: CourseDetail },
      { path: "about", Component: About },
      {
        path: "booking/:tripId",
        element: (
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        ),
      },
      { path: "auth", Component: Auth },
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "instructor/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "center/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["diving_center"]}>
            <CenterDashboard />
          </ProtectedRoute>
        ),
      },
      { path: "*", Component: NotFound },
    ],
  },
]);
