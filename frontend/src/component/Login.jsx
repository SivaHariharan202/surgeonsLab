// // import { useEffect, useState } from "react";
// // import { Form, Input, Button, message } from "antd";
// // import {
// //   UserOutlined, LockOutlined, ThunderboltOutlined,
// //   TeamOutlined, SafetyOutlined, BarChartOutlined, ArrowRightOutlined,
// // } from "@ant-design/icons";
// // import "../App.css";
// // import { useDispatch, useSelector } from "react-redux";
// // import { loginUser } from "../appRedux/actions/User";
// // import { useNavigate } from "react-router-dom";

// // const FEATURES = [
// //   { icon: <ThunderboltOutlined />, title: "Real-time Task Tracking", desc: "Monitor progress across all teams instantly" },
// //   { icon: <TeamOutlined />,        title: "Smart Assignments",       desc: "Assign tasks with role-based access control" },
// //   { icon: <SafetyOutlined />,      title: "Secure by Default",       desc: "JWT authentication on every request" },
// //   { icon: <BarChartOutlined />,    title: "Insightful Analytics",    desc: "Admin dashboards with full visibility" },
// // ];

// // export default function Login() {
// //   const dispatch  = useDispatch();
// //   const navigate  = useNavigate();
// //   const [loading, setLoading] = useState(false);
// //   const [form]    = Form.useForm();

// //   // Redux state shape from your API:
// //   // loginUserState = { status: "Ok", data: { id, full_name, email, role, access_token, refresh_token } }
// //   const loginUserState = useSelector((state) => state.user.login_user || {});

// //   // ── Submit ──────────────────────────────────────────────────────────────────
// //   const handleSubmit = (values) => {
// //     setLoading(true);
// //     dispatch(loginUser({ email: values.email, password: values.password }));
// //   };

// //   // ── Watch Redux for login response ──────────────────────────────────────────
// //   useEffect(() => {
// //     if (!loginUserState || Object.keys(loginUserState).length === 0) return;

// //     const status = loginUserState?.status;   // "Ok" or error string
// //     const user   = loginUserState?.data;     // user object from API

// //     // SUCCESS: API returned status "Ok" and user has an access_token
// //     if (status === "Ok" && user?.access_token) {
// //       sessionStorage.setItem("user",          JSON.stringify(user));
// //       sessionStorage.setItem("token",         user.access_token);
// //       sessionStorage.setItem("refresh_token", user.refresh_token || "");

// //       message.success("Welcome back, " + user.full_name + "!");
// //       setLoading(false);

// //       if (user.role === "admin") {
// //         navigate("/admin-dashboard", { replace: true });
// //       } else {
// //         navigate("/user-dashboard", { replace: true });
// //       }
// //       return;
// //     }

// //     // ERROR: API returned but not Ok
// //     if (status && status !== "Ok") {
// //       message.error(loginUserState?.message || loginUserState?.error || "Invalid email or password");
// //       setLoading(false);
// //       return;
// //     }

// //     // MISSING TOKEN: login succeeded but no token in response — log for debug
// //     if (status === "Ok" && user && !user.access_token) {
// //       console.warn("Login API succeeded but no access_token found:", loginUserState);
// //       message.error("Login succeeded but no token received. Check your API.");
// //       setLoading(false);
// //     }

// //   }, [loginUserState, navigate]);

// //   const fillDemo = (email, password) => form.setFieldsValue({ email, password });

// //   return (
// //     <div className="login-page">

// //       {/* LEFT PANEL */}
// //       <div className="login-left">
// //         <div className="login-left-content">
// //           <div className="login-brand">
// //             <div className="login-brand-icon">&#10022;</div>
// //             <span className="login-brand-name">TaskFlow</span>
// //           </div>

// //           <h1 className="login-hero-title">
// //             Manage Tasks<br />
// //             Like a Pro Team
// //           </h1>
// //           <p className="login-hero-sub">
// //             A unified workspace for admins and team members — assign, track, and
// //             complete tasks with full role-based control.
// //           </p>

// //           <div className="login-features">
// //             {FEATURES.map((f) => (
// //               <div className="login-feature-item" key={f.title}>
// //                 <div className="login-feature-icon">{f.icon}</div>
// //                 <div>
// //                   <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14, marginBottom: 1 }}>{f.title}</div>
// //                   <div style={{ color: "#64748b", fontSize: 13 }}>{f.desc}</div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>

// //           <div style={{ display: "flex", gap: 12, marginTop: 48 }}>
// //             {[{ val: "99%", label: "Uptime" }, { val: "2x", label: "Faster delivery" }, { val: "100%", label: "Secure" }].map((s) => (
// //               <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 18px", textAlign: "center" }}>
// //                 <div style={{ color: "#a5b4fc", fontWeight: 800, fontSize: 20 }}>{s.val}</div>
// //                 <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{s.label}</div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* RIGHT PANEL */}
// //       <div className="login-right">
// //         <div className="login-form-wrapper">
// //           <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 20, boxShadow: "0 6px 20px rgba(99,102,241,0.4)" }}>
// //             &#10022;
// //           </div>

// //           <h2 className="login-form-title">Sign in</h2>
// //           <p className="login-form-sub">Enter your credentials to continue</p>

// //           <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
// //             <Form.Item
// //               name="email"
// //               label="Email"
// //               rules={[
// //                 { required: true, message: "Please enter your email" },
// //                 { type: "email",  message: "Enter a valid email address" },
// //               ]}
// //             >
// //               <Input
// //                 prefix={<UserOutlined style={{ color: "#475569", marginRight: 6 }} />}
// //                 placeholder="admin@gmail.com"
// //                 size="large"
// //                 autoComplete="email"
// //               />
// //             </Form.Item>

// //             <Form.Item
// //               name="password"
// //               label="Password"
// //               rules={[{ required: true, message: "Please enter your password" }]}
// //             >
// //               <Input.Password
// //                 prefix={<LockOutlined style={{ color: "#475569", marginRight: 6 }} />}
// //                 placeholder="password"
// //                 size="large"
// //                 autoComplete="current-password"
// //               />
// //             </Form.Item>

// //             <Form.Item style={{ marginTop: 8 }}>
// //               <Button
// //                 type="primary"
// //                 htmlType="submit"
// //                 loading={loading}
// //                 block
// //                 size="large"
// //                 style={{ height: 48, fontSize: 15, fontWeight: 600 }}
// //                 icon={!loading ? <ArrowRightOutlined /> : null}
// //                 iconPosition="end"
// //               >
// //                 {loading ? "Signing in..." : "Sign In"}
// //               </Button>
// //             </Form.Item>
// //           </Form>

// //           {/* Demo credentials */}
// //           <div className="login-demo-box">
// //             <div className="login-demo-title">Demo Credentials — click to fill</div>
// //             {[
// //               { badge: "admin", label: "ADMIN", email: "admin@gmail.com",  pass: "admin123"  },
// //               { badge: "user",  label: "USER",  email: "john@gmail.com",   pass: "john123"   },
// //               { badge: "user",  label: "USER",  email: "sarah@gmail.com",  pass: "sarah123"  },
// //             ].map((c) => (
// //               <div
// //                 key={c.email}
// //                 className="login-demo-row"
// //                 onClick={() => fillDemo(c.email, c.pass)}
// //                 style={{ cursor: "pointer", borderRadius: 8, padding: "5px 6px", transition: "background 0.15s" }}
// //                 onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
// //                 onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
// //               >
// //                 <span className={"login-demo-badge " + c.badge}>{c.label}</span>
// //                 <span className="login-demo-cred"><span>{c.email}</span> / {c.pass}</span>
// //                 <ArrowRightOutlined style={{ color: "#334155", fontSize: 11, marginLeft: "auto" }} />
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }



// // src/containers/Login.jsx
// import { useEffect, useState } from "react";
// import { Form, Input, Button, message } from "antd";
// import { UserOutlined, LockOutlined, ArrowRightOutlined } from "@ant-design/icons";
// import "../App.css";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../appRedux/actions/User";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const dispatch  = useDispatch();
//   const navigate  = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [form]    = Form.useForm();

//   // Same selector pattern as the existing login
//   const loginUserState = useSelector((state) => state.user.login_user || {});

//   // ── Submit ──────────────────────────────────────────────────────────────────
//   const handleSubmit = (values) => {
//     setLoading(true);
//     dispatch(loginUser({ email: values.email, password: values.password }));
//   };

//   // ── Watch Redux for login response ──────────────────────────────────────────
//   useEffect(() => {
//     if (!loginUserState || Object.keys(loginUserState).length === 0) return;

//     const status = loginUserState?.status;
//     const user   = loginUserState?.data;

//     if (status === "Ok" && user?.access_token) {
//       sessionStorage.setItem("user",          JSON.stringify(user));
//       sessionStorage.setItem("token",         user.access_token);
//       sessionStorage.setItem("refresh_token", user.refresh_token || "");

//       message.success(`Welcome back, ${user.full_name}!`);
//       setLoading(false);

//       if (user.role === "admin") {
//         navigate("/admin-dashboard", { replace: true });
//       } else {
//         navigate("/user-dashboard",  { replace: true });
//       }
//       return;
//     }

//     if (status && status !== "Ok") {
//       message.error(loginUserState?.message || loginUserState?.error || "Invalid email or password");
//       setLoading(false);
//       return;
//     }

//     if (status === "Ok" && user && !user.access_token) {
//       console.warn("Login succeeded but no access_token:", loginUserState);
//       message.error("Login succeeded but no token received.");
//       setLoading(false);
//     }
//   }, [loginUserState, navigate]);

//   const fillDemo = (email, password) => form.setFieldsValue({ email, password });

//   return (
//     <div className="login-page-v2">
//       {/* Background decoration */}
//       <div className="login-bg-orb login-bg-orb-1" />
//       <div className="login-bg-orb login-bg-orb-2" />
//       <div className="login-bg-orb login-bg-orb-3" />

//       <div className="login-card-v2">
//         {/* Brand */}
//         <div className="lv2-brand">
//           <div className="lv2-brand-icon">✦</div>
//           <span className="lv2-brand-name">TaskFlow</span>
//         </div>

//         <h2 className="lv2-title">Welcome back</h2>
//         <p className="lv2-sub">Sign in to your workspace</p>

//         <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false} style={{ marginTop: 28 }}>
//           <Form.Item
//             name="email"
//             label="Email"
//             rules={[
//               { required: true, message: "Email is required" },
//               { type: "email",  message: "Enter a valid email" },
//             ]}
//           >
//             <Input
//               prefix={<UserOutlined style={{ color: "#475569", marginRight: 6 }} />}
//               placeholder="you@company.com"
//               size="large"
//               autoComplete="email"
//             />
//           </Form.Item>

//           <Form.Item
//             name="password"
//             label="Password"
//             rules={[{ required: true, message: "Password is required" }]}
//           >
//             <Input.Password
//               prefix={<LockOutlined style={{ color: "#475569", marginRight: 6 }} />}
//               placeholder="••••••••"
//               size="large"
//               autoComplete="current-password"
//             />
//           </Form.Item>

//           <Form.Item style={{ marginTop: 8 }}>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading}
//               block
//               size="large"
//               style={{ height: 48, fontSize: 15, fontWeight: 600 }}
//               icon={!loading ? <ArrowRightOutlined /> : null}
//               iconPosition="end"
//             >
//               {loading ? "Signing in…" : "Sign In"}
//             </Button>
//           </Form.Item>
//         </Form>

//         {/* Demo credentials */}
//         <div className="login-demo-box">
//           <div className="login-demo-title">Demo Credentials — click to fill</div>
//           {[
//             { badge: "admin", label: "ADMIN", email: "admin@gmail.com", pass: "admin123" },
//             { badge: "user",  label: "USER",  email: "john@gmail.com",  pass: "john123"  },
//             { badge: "user",  label: "USER",  email: "sarah@gmail.com", pass: "sarah123" },
//           ].map((c) => (
//             <div
//               key={c.email}
//               className="login-demo-row"
//               onClick={() => fillDemo(c.email, c.pass)}
//               style={{ cursor: "pointer", borderRadius: 8, padding: "5px 6px", transition: "background 0.15s" }}
//               onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
//               onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//             >
//               <span className={`login-demo-badge ${c.badge}`}>{c.label}</span>
//               <span className="login-demo-cred"><span>{c.email}</span> / {c.pass}</span>
//               <ArrowRightOutlined style={{ color: "#334155", fontSize: 11, marginLeft: "auto" }} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


// src/containers/Login.jsx
import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, ArrowRightOutlined } from "@ant-design/icons";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../appRedux/actions/User";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form]    = Form.useForm();

  const loginUserState = useSelector((state) => state.user.login_user || {});

  const handleSubmit = (values) => {
    setLoading(true);
    dispatch(loginUser({ email: values.email, password: values.password }));
  };

  useEffect(() => {
    if (!loginUserState || Object.keys(loginUserState).length === 0) return;
    const status = loginUserState?.status;
    const user   = loginUserState?.data;

    if (status === "Ok" && user?.access_token) {
      sessionStorage.setItem("user",          JSON.stringify(user));
      sessionStorage.setItem("token",         user.access_token);
      sessionStorage.setItem("refresh_token", user.refresh_token || "");
      message.success(`Welcome back, ${user.full_name}!`);
      setLoading(false);
      if (user.role === "admin") navigate("/admin-dashboard", { replace: true });
      else                       navigate("/user-dashboard",  { replace: true });
      return;
    }

    if (status && status !== "Ok") {
      message.error(loginUserState?.message || loginUserState?.error || "Invalid email or password");
      setLoading(false);
    }
  }, [loginUserState, navigate]);

  const fillDemo = (email, password) => form.setFieldsValue({ email, password });

  return (
    <div className="login-page-v2">
      {/* Animated background orbs */}
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />
      <div className="login-bg-orb login-bg-orb-3" />

      <div className="login-card-v2">
        {/* Brand */}
        <div className="lv2-brand">
          <div className="lv2-brand-icon">✦</div>
          <span className="lv2-brand-name">TaskFlow</span>
        </div>

        <h2 className="lv2-title">Welcome back</h2>
        <p className="lv2-sub">Sign in to continue to your workspace</p>

        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false} style={{ marginTop: 28 }}>
          <Form.Item
            name="email"
            label={<span style={{ color: "#94a3b8", fontWeight: 500, fontSize: 13 }}>Email address</span>}
            rules={[
              { required: true, message: "Email is required" },
              { type: "email",  message: "Enter a valid email" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#475569", marginRight: 4 }} />}
              placeholder="admin@gmail.com"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: "#94a3b8", fontWeight: 500, fontSize: 13 }}>Password</span>}
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#475569", marginRight: 4 }} />}
              placeholder="password"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 4 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{ height: 48, fontSize: 15, fontWeight: 600 }}
              icon={!loading ? <ArrowRightOutlined /> : null}
              iconPosition="end"
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </Form.Item>
        </Form>

        {/* Demo credentials */}
        {/* <div className="lv2-demo">
          <div className="lv2-demo-label">Demo accounts — click to fill</div>
          {[
            { badge: "admin", email: "admin@gmail.com", pass: "admin123" },
            { badge: "user",  email: "john@gmail.com",  pass: "john123"  },
          ].map((c) => (
            <div
              key={c.email}
              className={`lv2-demo-row lv2-demo-${c.badge}`}
              onClick={() => fillDemo(c.email, c.pass)}
            >
              <span className={`lv2-badge lv2-badge-${c.badge}`}>{c.badge.toUpperCase()}</span>
              <span className="lv2-demo-email">{c.email}</span>
              <ArrowRightOutlined style={{ color: "#334155", fontSize: 11, marginLeft: "auto" }} />
            </div>
          ))}
        </div> */}

        {/* <p className="lv2-footer">JWT secured · Role-based access</p> */}
      </div>
    </div>
  );
}