// router.js
import { ComponentType, Suspense, lazy } from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import SuspenseLoader from "./components/SuspenseLoader/SuspenseLoader";
import BaseLayout from "./layouts/BaseLayout";
import SidebarLayout from "./layouts/SidebarLayout";
// Importez vos autres composants de page ici

const Loader =
  <P extends object>(Component: ComponentType<P>): ComponentType<P> =>
  (props: P) => (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );
// Applications

const CardEditor = Loader(
  lazy(() => import("./content/applications/CardEditor"))
);
const LoginDashboard = Loader(
  lazy(() => import("./content/pages/Login_dashboard"))
);

const MailingService = Loader(
  lazy(() => import("./content/pages/MailingService"))
);
const CategoryGallery = Loader(
  lazy(() => import("./content/pages/MailingService/CategoryGallery"))
);
const routes: RouteObject[] = [
  {
    path: "status",
    element: <BaseLayout />,
    children: [
      // Ajoutez vos autres routes ici
      {
        path: "status",
        children: [
          {
            path: "404",
            element: <div>NotFound</div>,
          },
          {
            path: "500",
            element: <div>Server Error</div>,
          },
        ],
      },
    ],
  },

  {
    path: "login_dashboard",
    element: <BaseLayout />,
    children: [
      {
        path: "",
        element: <LoginDashboard />,
      },
    ],
  },

  {
    path: "mailing_service",
    element: <BaseLayout />,
    children: [
      {
        path: "",
        element: <MailingService />,
      },
    ],
  },
  {
    path: "gallery/:categoryKey",
    element: <BaseLayout />,
    children: [
      {
        path: "",
        element: <CategoryGallery />,
      },
    ],
  },

  {
    path: "dashboards",
    element: (
      <ProtectedRoute>
        {(isAuthenticated) => (
          <SidebarLayout activePage={""}>
            <Outlet />
          </SidebarLayout>
        )}
      </ProtectedRoute>
    ), // sera remplacé dans App.js
    children: [
      {
        path: "",
        element: <div>Home Page</div>,
      },
      {
        path: "cardEditor",
        element: <CardEditor />,
      },
    ],
  },
  {
    path: "",
    element: <Navigate to="dashboards" replace />,
  },
];

export default routes;
