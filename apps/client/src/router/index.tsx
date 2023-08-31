import React from "react";
import {
  Navigate,
  Outlet,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import ShowIf from "../components/ShowIf";
import { useAuthContext } from "../hooks/UseAuth";
import GlobalLayout from "../layouts/Global";

const LazyLoginPage = React.lazy(() => import("../pages/login"));
const LazyHomePage = React.lazy(() => import("../pages/home/home"));
// TODO: Change the implementation to use the Router and Layout properly
const LazyAccountPage = React.lazy(() => import("../pages/profile/layout"));
const LazyEmployeesPage = React.lazy(() => import("../pages/employees"));
// TODO: Change the implementation to use the Router and Layout properly
const LazyLeavePage = React.lazy(() => import("../pages/leave/layout"));
const LazyUnderMaintenancePage = React.lazy(
  () => import("../pages/under-maintenance")
);
const LazyProfilePage = React.lazy(
  () => import("../pages/profile/profile-page")
);
const LazyTimeSheetPage = React.lazy(() => import("../pages/time-sheet"));
const LazyHelpDeskPage = React.lazy(() => import("../pages/help-desk"));
const LazyPayRollPage = React.lazy(() => import("../pages/pay-roll"));
const LazyVisitorPassPage = React.lazy(() => import("../pages/visitor-pass"));
// const LazyExpensePage = React.lazy(() => import("../pages/expense"));
// const LazyTravelPage = React.lazy(() => import("../pages/travel"));
// const LazyLoanPage = React.lazy(() => import("../pages/loan"));

const LazyLoginPageWithFallback = () => (
  <React.Suspense fallback={"Loading..."}>
    <LazyLoginPage />
  </React.Suspense>
);
const LazyHomePageWithFallback = () => (
  <React.Suspense fallback={"Loading..."}>
    <ProtectedRoute>
      <ShowIf.Employee>
        <LazyHomePage />
      </ShowIf.Employee>
    </ProtectedRoute>
  </React.Suspense>
);
const LazyAccountPageWithFallback = () => (
  <React.Suspense fallback={"Loading..."}>
    <ProtectedRoute>
      <LazyAccountPage />
    </ProtectedRoute>
  </React.Suspense>
);
const LazyEmployeesPageWithFallback = () => (
  <React.Suspense fallback={"Loading..."}>
    <ProtectedRoute>
      <ShowIf.Admin>
        <LazyEmployeesPage />
      </ShowIf.Admin>
    </ProtectedRoute>
  </React.Suspense>
);
const LazyLeavePageWithFallback = () => (
  <React.Suspense fallback={"Loading..."}>
    <ProtectedRoute>
      <LazyLeavePage />
    </ProtectedRoute>
  </React.Suspense>
);
const LazyProfilePageWithFallback = () => (
  <React.Suspense fallback={"Loading..."}>
    <ProtectedRoute>
      <LazyProfilePage />
    </ProtectedRoute>
  </React.Suspense>
);
const LazyUnderMaintenancePageWithFallback = () => (
  <React.Suspense fallback={"Loading..."}>
    <ProtectedRoute>
      <LazyUnderMaintenancePage />
    </ProtectedRoute>
  </React.Suspense>
);
const LazyTimeSheetPageWithFallback = () => (
  <React.Suspense fallback={"Loading..."}>
    <ProtectedRoute>
      <LazyTimeSheetPage />
    </ProtectedRoute>
  </React.Suspense>
);
const LazyHelpDeskPageWithFallback = () => (
  <React.Suspense fallback={"Loading..."}>
    <ProtectedRoute>
      <LazyHelpDeskPage />
    </ProtectedRoute>
  </React.Suspense>
);
const LazyPayRollPageWithFallback = () => (
  <React.Suspense fallback={"Loading..."}>
    <ProtectedRoute>
      <LazyPayRollPage />
    </ProtectedRoute>
  </React.Suspense>
);
const LazyVisitorPassPageWithFallback = () => (
  <React.Suspense fallback={"Loading..."}>
    <ProtectedRoute>
      <LazyVisitorPassPage />
    </ProtectedRoute>
  </React.Suspense>
);
// const LazyLoanPageWithFallback = () => (
//   <React.Suspense fallback={"Loading..."}>
//     <ProtectedRoute>
//       <LazyLoanPage />
//     </ProtectedRoute>
//   </React.Suspense>
// );
// const LazyExpensePageWithFallback = () => (
//   <React.Suspense fallback={"Loading..."}>
//     <ProtectedRoute>
//       <LazyExpensePage />
//     </ProtectedRoute>
//   </React.Suspense>
// );
// const LazyTravelPageWithFallback = () => (
//   <React.Suspense fallback={"Loading..."}>
//     <ProtectedRoute>
//       <LazyTravelPage />
//     </ProtectedRoute>
//   </React.Suspense>
// );

export type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const auth = useAuthContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (auth.state.user) return;
    if (auth.state.user === undefined) {
      navigate("/login");
      return;
    }
  }, [auth.state.user, navigate]);

  return <>{props.children}</>;
};

export const router = createBrowserRouter([
  {
    path: "login/*",
    element: <Outlet />,
    children: [
      {
        path: "",
        element: <LazyLoginPageWithFallback />,
      },
    ],
  },
  {
    path: "/*",
    element: <GlobalLayout />,
    children: [
      {
        path: "",
        element: (
          <>
            <ShowIf.Employee>
              <Navigate to="home" />
            </ShowIf.Employee>
            <ShowIf.Admin>
              <Navigate to="account" />
            </ShowIf.Admin>
          </>
        ),
      },
      {
        path: "home/*",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <LazyHomePageWithFallback />,
          },
        ],
      },
      {
        path: "account/*",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <LazyAccountPageWithFallback />,
          },
        ],
      },
      {
        path: "employees/*",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <LazyEmployeesPageWithFallback />,
          },
        ],
      },
      {
        path: "leave/*",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <LazyLeavePageWithFallback />,
          },
        ],
      },
      {
        path: "profile-page/*",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <LazyProfilePageWithFallback />,
          },
        ],
      },
      {
        path: "time-sheet/*",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <LazyTimeSheetPageWithFallback />,
          },
        ],
      },
      {
        path: "help-desk/*",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <LazyHelpDeskPageWithFallback />,
          },
        ],
      },
      {
        path: "pay-roll/*",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <LazyPayRollPageWithFallback />,
          },
        ],
      },
      {
        path: "visitor-pass/*",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <LazyVisitorPassPageWithFallback />,
          },
        ],
      },
      // {
      //   path: "loan/*",
      //   element: <Outlet />,
      //   children: [
      //     {
      //       path: "",
      //       element: <LazyLoanPageWithFallback />,
      //     },
      //   ],
      // },
      // {
      //   path: "expense/*",
      //   element: <Outlet />,
      //   children: [
      //     {
      //       path: "",
      //       element: <LazyExpensePageWithFallback />,
      //     },
      //   ],
      // },
      // {
      //   path: "travel/*",
      //   element: <Outlet />,
      //   children: [
      //     {
      //       path: "",
      //       element: <LazyTravelPageWithFallback />,
      //     },
      //   ],
      // },
      {
        path: "*",
        element: <LazyUnderMaintenancePageWithFallback />,
      },
    ],
  },
]);

export default router;
