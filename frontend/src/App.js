

// import React from "react";
// import { ConfigProvider } from "antd";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import Login from "./component/Login";
// import { AdminDashboard, UserDashboard } from "./component/Dashboard";

// import "./App.css";
// // import "../App.css"

// // Ant Design Theme
// const antTheme = {
//   token: {
//     colorPrimary: "#6366f1",
//     colorSuccess: "#10b981",
//     colorWarning: "#f59e0b",
//     colorError: "#ef4444",
//     colorInfo: "#3b82f6",
//     borderRadius: 10,
//     fontFamily:
//       "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
//   },

//   components: {
//     Button: {
//       borderRadius: 10,
//       controlHeight: 40,
//     },

//     Input: {
//       borderRadius: 10,
//       controlHeight: 42,
//     },

//     Select: {
//       borderRadius: 10,
//       controlHeight: 42,
//     },

//     Modal: {
//       borderRadiusLG: 20,
//     },

//     Table: {
//       borderRadiusLG: 16,
//     },
//   },
// };


// // Protected Route
// const ProtectedRoute = ({
//   children,
//   allowedRole,
// }) => {

//   const user = JSON.parse(
//     sessionStorage.getItem(
//       "user"
//     )
//   );

//   const token =
//     sessionStorage.getItem(
//       "token"
//     );

//   // not logged in
//   if (!user || !token) {
//     return (
//       <Navigate
//         to="/"
//         replace
//       />
//     );
//   }

//   // wrong role
//   if (
//     user.role !==
//     allowedRole
//   ) {

//     return (
//       <Navigate
//         to="/"
//         replace
//       />
//     );
//   }

//   return children;
// };


// export default function App() {

//   return (
//     <ConfigProvider>

//       <Router>

//         <Routes>

//           {/* Login */}
//           <Route
//             path="/"
//             element={<Login />}
//           />

//           {/* Admin */}
//           <Route
//             path="/admin-dashboard"
//             element={
//               <ProtectedRoute
//                 allowedRole="admin"
//               >
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* User */}
//           <Route
//             path="/user-dashboard"
//             element={
//               <ProtectedRoute
//                 allowedRole="user"
//               >
//                 <UserDashboard />
//               </ProtectedRoute>
//             }
//           />

//         </Routes>

//       </Router>

//     </ConfigProvider>
//   );
// }



import React from "react";
import { ConfigProvider } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./component/Login";
import { AdminDashboard, UserDashboard } from "./component/Dashboard";

import "./App.css";

// ── Ant Design Theme ──────────────────────────────────────────────────────────
const antTheme = {
  token: {
    colorPrimary: "#6366f1",
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    colorError:   "#ef4444",
    colorInfo:    "#3b82f6",
    borderRadius: 10,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    Button:  { borderRadius: 10, controlHeight: 40 },
    Input:   { borderRadius: 10, controlHeight: 42 },
    Select:  { borderRadius: 10, controlHeight: 42 },
    Modal:   { borderRadiusLG: 20 },
    Table:   { borderRadiusLG: 16 },
  },
};

// ── Protected Route ───────────────────────────────────────────────────────────
// const ProtectedRoute = ({ children, allowedRole }) => {
//   const user  = JSON.parse(sessionStorage.getItem("user")  || "null");
//   const token = sessionStorage.getItem("token");

//   // not logged in → back to login
//   if (!user || !token) {
//     return <Navigate to="/" replace />;
//   }

//   // wrong role → back to login
//   if (user.role !== allowedRole) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };



const ProtectedRoute = ({
  children,
  allowedRole,
}) => {

  const user = JSON.parse(
    sessionStorage.getItem(
      "user"
    )
  );

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  if (
    user.role !== allowedRole
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};
// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ConfigProvider theme={antTheme}>   {/* ← antTheme was missing here */}
      <Router>
        <Routes>

          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* Admin dashboard */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* User dashboard */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute allowedRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all → login */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </ConfigProvider>
  );
}