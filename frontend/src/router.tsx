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

const LoginDashboard = Loader(
  lazy(() => import("./content/pages/Login_dashboard")),
);

const MailingService = Loader(
  lazy(() => import("./content/pages/MailingService")),
);

const CategoryGallery = Loader(
  lazy(() => import("./content/pages/MailingService/CategoryGallery")),
);
const Profil = Loader(lazy(() => import("./content/applications/profil")));
const Einstellungen = Loader(
  lazy(() => import("./content/applications/einstellungen")),
);
const Zahlungformular = Loader(
  lazy(() => import("./content/applications/formularen/zahlungFormular")),
);
const Produkteigenschaft = Loader(
  lazy(() => import("./content/applications/formularen/produktEigenschaft")),
);
const ZahlungFormular = Loader(
  lazy(() => import("./content/applications/formularen/zahlungFormular")),
);
const AllProducts = Loader(
  lazy(() => import("./content/applications/produkten/allProdukt")),
);
const AddProduct = Loader(
  lazy(() => import("./content/applications/produkten/addProdukt")),
);
const Shipping = Loader(lazy(() => import("./content/applications/shipping")));
const Page1 = Loader(lazy(() => import("./content/applications/pages/page1")));
const Page2 = Loader(lazy(() => import("./content/applications/pages/page2")));
const ZahlungsMethode = Loader(
  lazy(() => import("./content/applications/zahlungsMethode")),
);
const VorZahlung = Loader(lazy(() => import("./content/pages/VorZahlung")));
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
      {
        path: "vorzahlung/:vorzahlungKey",
        element: <VorZahlung />,
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
        path: "page1",
        element: <Page1 />,
      },
      {
        path: "page2",
        element: <Page2 />,
      },
      {
        path: "allProducts",
        element: <AllProducts />,
      },
      {
        path: "addProduct",
        element: <AddProduct />,
      },
      {
        path: "produkteigenschaft",
        element: <Produkteigenschaft />,
      },
      {
        path: "zahlungformular",
        element: <Zahlungformular />,
      },
      {
        path: "zahlungformular",
        element: <ZahlungFormular />,
      },
      {
        path: "shipping",
        element: <Shipping />,
      },
      {
        path: "payment",
        element: <ZahlungsMethode />,
      },
      {
        path: "overview",
        element: <MailingService />,
      },
      {
        path: "settings",
        element: <Einstellungen />,
      },
      {
        path: "profile",
        element: <Profil />,
      },
    ],
  },
  {
    path: "",
    element: <Navigate to="mailing_service" replace />,
  },
];

export default routes;
