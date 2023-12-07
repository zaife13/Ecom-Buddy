import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import { useAuth } from "./hooks/auth-hook";

import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";

// User Routes
const Login = lazy(() => import("./pages/authentication/Login"));
const Signup = lazy(() => import("./pages/authentication/Signup"));
const ForgetPassword = lazy(() => import("./pages/authentication/ForgetPassword"));
const Homepage = lazy(() => import("./pages/landing/Homepage"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Blackbox = lazy(() => import("./pages/dashboard/blackbox/Blackbox"));
const ProductList = lazy(() => import("./pages/dashboard/blackbox/ProductList"));
const Profile = lazy(() => import("./pages/dashboard/profile/Profile"));
const SideBarLayout = lazy(() => import("./Component/Layout/SideBarLayout"));
const ResetPassword = lazy(() => import("./pages/authentication/ResetPassword"));
const Product = lazy(() => import("./pages/dashboard/blackbox/Product"));
const SuppliersList = lazy(() => import("./pages/dashboard/supplier/SuppliersList"));
const Favorites = lazy(() => import("./pages/dashboard/supplier/Favorites"));
const SupplierDetails = lazy(() =>
  import("./pages/dashboard/supplier/SupplierDetails")
);
const SupplierProductDetails = lazy(() =>
  import("./pages/dashboard/supplier/SupplierProductDetails")
);
const Trends = lazy(() => import("./pages/dashboard/trends/Trends"));
const ProductListing = lazy(() =>
  import("./pages/dashboard/listings/ProductListing")
);

// Admin Routes
const Admin = lazy(() => import("./pages/admin/Admin"));
const AdminDashboard = lazy(() => import("./pages/admin/dashboard/AdminDashboard"));
const ViewUsers = lazy(() => import("./pages/admin/view-items/ViewUsers"));
const AddUser = lazy(() => import("./pages/admin/add-items/AddUser"));

// Invalid URL
const Page404 = lazy(() => import("./utils/404"));

const App = () => {
  let { token, login, logout, userId, role, name } = useAuth();
  const isUser = role === "user";

  let routes;
  if (!token) {
    routes = (
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/recover-password" element={<ForgetPassword />} />
        <Route exact path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    );
  } else if (isUser) {
    routes = (
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route path="/" element={<SideBarLayout />}>
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/blackbox" element={<Blackbox />} />
          <Route exact path="/blackbox/products" element={<ProductList />} />
          <Route exact path="/blackbox/products/:asin" element={<Product />} />
          <Route exact path="/suppliers" element={<SuppliersList />} />
          <Route exact path="/suppliers/favorites" element={<Favorites />} />
          <Route
            exact
            path="/suppliers/:sId/details"
            element={<SupplierDetails />}
          />
          <Route
            exact
            path="/suppliers/product/details"
            element={<SupplierProductDetails />}
          />
          <Route exact path="/product-listing" element={<ProductListing />} />
          <Route exact path="/trends" element={<Trends />} />
          <Route exact path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route
          exact
          path="/admin"
          element={token ? <Admin /> : <Navigate to="/login" />}
        >
          <Route exact path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            exact
            path="/admin/view-users"
            element={<ViewUsers type="user" />}
          />
          <Route
            exact
            path="/admin/view-admins"
            element={<ViewUsers type="admin" />}
          />
          <Route
            exact
            path="/admin/add-user"
            element={<AddUser userType="user" />}
          />
          <Route
            exact
            path="/admin/edit-user/:id"
            element={<AddUser userType="user" edit={true} />}
          />
          <Route
            exact
            path="/admin/add-admin"
            element={<AddUser userType="admin" />}
          />
          <Route
            exact
            path="/admin/edit-admin/:id"
            element={<AddUser userType="admin" edit={true} />}
          />
        </Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        userId,
        login,
        logout,
        name,
      }}
    >
      <BrowserRouter>
        <Suspense fallback={<CircularProgress />}>{routes}</Suspense>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
