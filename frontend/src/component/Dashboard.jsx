// // src/containers/Dashboard.jsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Button, Modal, Form, Input, Select, Tag,
//   Progress, Empty, Spin, message,
// } from "antd";
// import { logoutUser,createUser,allUser } from "../appRedux/actions/User";
// import { createTask, updateTask, myTask, getTask ,findAll} from "../appRedux/actions/Task1";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   DashboardOutlined, UnorderedListOutlined, BarChartOutlined,
//   PlusOutlined, LogoutOutlined, MenuOutlined, CloseOutlined,
//   CheckCircleOutlined, ClockCircleOutlined, SyncOutlined,
//   ThunderboltOutlined, CalendarOutlined, FireOutlined,
//   TrophyOutlined, EyeOutlined, FileTextOutlined,
// } from "@ant-design/icons";
// import "../App.css";

// // ── HELPERS ───────────────────────────────────────────────────────────────────
// const AVATAR_COLORS = [
//   ["#e8d5fb","#6f42c1"],["#cce5ff","#004085"],
//   ["#d4edda","#155724"],["#ffe8cc","#a0522d"],["#ffd6d6","#9b1c1c"],
// ];

// const displayName = (u) => u?.full_name || u?.name || "Unknown";

// function Avatar({ name = "?", size = 36 }) {
//   const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
//   const [bg, fg] = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
//   return (
//     <div className="avatar" style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}>
//       {initials}
//     </div>
//   );
// }

// function StatusTag({ status }) {
//   const map = {
//     pending:     { icon: <ClockCircleOutlined />, color: "gold",  text: "Pending"     },
//     in_progress: { icon: <SyncOutlined spin />,   color: "blue",  text: "In Progress" },
//     completed:   { icon: <CheckCircleOutlined />, color: "green", text: "Completed"   },
//   };
//   const { icon, color, text } = map[status] || map.pending;
//   return <Tag color={color} icon={icon} style={{ borderRadius: 99, fontWeight: 600, fontSize: 12 }}>{text}</Tag>;
// }

// function Toast({ msg, type }) {
//   return msg ? (
//     <div className={type === "error" ? "toast-error" : "toast-success"}>
//       {type === "error" ? "⚠️" : "✅"} {msg}
//     </div>
//   ) : null;
// }

// function useToast() {
//   const [toast, setToast] = useState(null);
//   const show = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };
//   return [toast, show];
// }

// function getSessionUser() {
//   try { return JSON.parse(sessionStorage.getItem("user") || "null"); }
//   catch { return null; }
// }

// // ════════════════════════════════════════════════════════════════════════════════
// // ADMIN DASHBOARD
// // ════════════════════════════════════════════════════════════════════════════════
// export function AdminDashboard() {
//   const navigate    = useNavigate();
//   const dispatch    = useDispatch();
//   const sessionUser = getSessionUser();
//   console.log(sessionStorage.getItem("token"))
// console.log("dashboard mounted")  

//   // ── Redux: task state ─────────────────────────────────────────────────────
//   // task reducer registered as "task" in rootReducer
//   const taskState   = useSelector((state) => state.task || {});
//   const findall   = useSelector((state) => state.task.find || {});
//   console.log("findall",findall)
//   const tasks       = Array.isArray(taskState.get) ? taskState.get : [];
//   const taskLoading = taskState.loading || false;
//   const taskError   = taskState.error   || null;

//   // ── Local UI ──────────────────────────────────────────────────────────────
//   const [activeTab,    setActiveTab]  = useState("overview");
//   const [filterStatus, setFilter]     = useState("all");
//   const [sidebarOpen,  setSidebar]    = useState(false);
//   const [taskModal,    setTaskModal]  = useState(false);
//   const [toast,        showToast]     = useToast();
//   const [taskForm]   = Form.useForm();

//   // ── Load all tasks on mount ───────────────────────────────────────────────
//   useEffect(() => {
//     dispatch(getTask());
//     dispatch(findAll());
//   }, [dispatch]);

//   // ── Watch Redux create/update success to refresh list ─────────────────────
//   // When CREATE_TASK_SUCCESS fires, the reducer already prepends the new task
//   // so we just need to handle the error case
//   useEffect(() => {
//     if (taskError) {
//       showToast(String(taskError), "error");
//     }
//   }, [taskError]);

//   // ── Logout ────────────────────────────────────────────────────────────────
//   // FIXED: dispatch logout action first (calls /api/logout/), THEN clear
//   // sessionStorage. The userReducer sets login_user:{} on LOGOUT_USER_SUCCESS
//   // so Login's useEffect will never see a stale token.
//   const handleLogout = () => {
//     const refresh_token = sessionStorage.getItem("refresh_token");
//     dispatch(logoutUser({ refresh_token }));
//     // Clear storage immediately — even if API call fails, user is logged out locally
//     sessionStorage.clear();
//     navigate("/", { replace: true });
//   };

//   // ── Create task ───────────────────────────────────────────────────────────
//   // Dispatches CREATE_TASK → saga calls POST /api/create-task/
//   // On CREATE_TASK_SUCCESS the reducer prepends the task to state.task.get
//   const handleCreateTask = (values) => {
//     dispatch(
//       createTask({
//         title:       values.title,
//         description: values.description || "",
//         priority:    values.priority    || "medium",
//         assigned_to: Number(values.assigned_to),  // ensure number
//       })
//     );
//     setTaskModal(false);
//     taskForm.resetFields();
//     showToast("Task created!");
//     // Re-fetch to guarantee server state matches
//     setTimeout(() => dispatch(getTask()), 800);
//   };

//   // ── Update task status ────────────────────────────────────────────────────
//   // Dispatches UPDATE_TASK → saga calls PUT /api/update-task/:id/
//   // On UPDATE_TASK_SUCCESS the reducer replaces the task in state.task.get by id
//   const NEXT_STATUS = { pending: "in_progress", in_progress: "completed" };

//   const handleUpdateStatus = (taskId, currentStatus) => {
//     const newStatus = NEXT_STATUS[currentStatus];
//     if (!newStatus) return;
//     dispatch(updateTask({ id: taskId, status: newStatus }));
//     showToast("Status updated!");
//   };

//   // ── Derived stats ─────────────────────────────────────────────────────────
//   const stats = {
//     total:       tasks.length,
//     pending:     tasks.filter((t) => t.status === "pending").length,
//     in_progress: tasks.filter((t) => t.status === "in_progress").length,
//     completed:   tasks.filter((t) => t.status === "completed").length,
//   };

//   const filteredTasks =
//     filterStatus === "all" ? tasks : tasks.filter((t) => t.status === filterStatus);

//   // API returns assigned_to_name from your serializer
//   const assignedName = (task) =>
//     task.assigned_to_name || task.assigned_name || "Unassigned";

//   const NAV = [
//     { id: "overview", icon: <DashboardOutlined />,    label: "Overview",  badge: null        },
//     { id: "tasks",    icon: <UnorderedListOutlined />, label: "All Tasks", badge: stats.total },
//     { id: "stats",    icon: <BarChartOutlined />,      label: "Analytics", badge: null        },
//   ];

//   const PAGE_META = {
//     overview: { title: "Overview",  sub: `Welcome back, ${displayName(sessionUser).split(" ")[0]}!` },
//     tasks:    { title: "All Tasks", sub: `${filteredTasks.length} tasks total`                       },
//     stats:    { title: "Analytics", sub: "Performance metrics"                                       },
//   };

//   if (taskLoading && tasks.length === 0) {
//     return (
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
//         <Spin size="large" tip="Loading dashboard…" />
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-layout">
//       <Toast msg={toast?.msg} type={toast?.type} />

//       {/* Mobile overlay */}
//       <div className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`} onClick={() => setSidebar(false)} />

//       {/* ── SIDEBAR ── */}
//       <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
//         <div className="sidebar-brand">
//           <div className="sidebar-brand-icon">✦</div>
//           <div className="sidebar-brand-text">
//             <div className="sidebar-brand-name">TaskFlow</div>
//             <div className="sidebar-brand-role">Admin Panel</div>
//           </div>
//           <Button type="text" icon={<CloseOutlined />} size="small"
//             style={{ color: "#475569" }} onClick={() => setSidebar(false)} />
//         </div>

//         <nav className="sidebar-nav">
//           <div className="sidebar-section-label">Main</div>
//           {NAV.map((item) => (
//             <button
//               key={item.id}
//               className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
//               onClick={() => { setActiveTab(item.id); setSidebar(false); }}
//             >
//               <span className="sidebar-item-icon">{item.icon}</span>
//               <span>{item.label}</span>
//               {item.badge !== null && <span className="sidebar-item-badge">{item.badge}</span>}
//             </button>
//           ))}

//           <div className="sidebar-section-label" style={{ marginTop: 16 }}>Actions</div>
//           <button className="sidebar-item" onClick={() => setTaskModal(true)}>
//             <span className="sidebar-item-icon"><PlusOutlined /></span>
//             <span>New Task</span>
//           </button>
//         </nav>

//         <div className="sidebar-footer">
//           <div className="sidebar-user">
//             <Avatar name={displayName(sessionUser)} size={34} />
//             <div className="sidebar-user-info">
//               <div className="sidebar-user-name">{displayName(sessionUser)}</div>
//               <div className="sidebar-user-role">Administrator</div>
//             </div>
//           </div>
//           <button className="sidebar-logout" onClick={handleLogout}>
//             <LogoutOutlined /> Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* ── MAIN ── */}
//       <div className="dashboard-main">
//         <header className="topbar">
//           <button className="topbar-hamburger" onClick={() => setSidebar(true)}>
//             <MenuOutlined />
//           </button>
//           <div className="topbar-title">
//             <div className="topbar-page-title">{PAGE_META[activeTab].title}</div>
//             <div className="topbar-page-sub">{PAGE_META[activeTab].sub}</div>
//           </div>
//           <div className="topbar-actions">
//             {activeTab === "tasks" && (
//               <Button type="primary" icon={<PlusOutlined />} onClick={() => setTaskModal(true)}>
//                 New Task
//               </Button>
//             )}
//             <div className="topbar-avatar-wrap">
//               <Avatar name={displayName(sessionUser)} size={36} />
//               <div style={{ display: "flex", flexDirection: "column" }}>
//                 <span className="topbar-user-name">{displayName(sessionUser)}</span>
//                 <span className="topbar-user-role">Admin</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="content-area">

//           {/* ── OVERVIEW ── */}
//           {activeTab === "overview" && (
//             <>
//               <div className="stat-grid">
//                 {[
//                   { label: "Total Tasks",  value: stats.total,       icon: <FileTextOutlined />,    cls: "purple", color: "#6366f1" },
//                   { label: "Pending",      value: stats.pending,     icon: <ClockCircleOutlined />, cls: "amber",  color: "#f59e0b" },
//                   { label: "In Progress",  value: stats.in_progress, icon: <SyncOutlined />,        cls: "blue",   color: "#3b82f6" },
//                   { label: "Completed",    value: stats.completed,   icon: <TrophyOutlined />,      cls: "green",  color: "#10b981" },
//                 ].map((s) => (
//                   <div key={s.label} className={`stat-card ${s.cls}`}>
//                     <div className={`stat-icon ${s.cls}`} style={{ color: s.color }}>{s.icon}</div>
//                     <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
//                     <div className="stat-label">{s.label}</div>
//                     <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2, marginTop: 10 }}>
//                       <div style={{ height: "100%", width: `${stats.total ? Math.round((s.value / stats.total) * 100) : 0}%`, background: s.color, borderRadius: 2 }} />
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="overview-grid">
//                 {/* Recent tasks */}
//                 <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px 24px" }}>
//                   <div className="section-header">
//                     <div>
//                       <div className="section-title">Recent Tasks</div>
//                       <div className="section-sub">Latest activity</div>
//                     </div>
//                     <Button size="small" icon={<EyeOutlined />} onClick={() => setActiveTab("tasks")}>View All</Button>
//                   </div>
//                   {tasks.slice(0, 5).map((task) => (
//                     <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
//                       <div style={{ width: 3, height: 36, borderRadius: 4, flexShrink: 0, background: task.status === "completed" ? "#10b981" : task.status === "in_progress" ? "#3b82f6" : "#f59e0b" }} />
//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.title}</div>
//                         <div style={{ fontSize: 12, color: "#94a3b8" }}>→ {assignedName(task)}</div>
//                       </div>
//                       <StatusTag status={task.status} />
//                     </div>
//                   ))}
//                   {tasks.length === 0 && <Empty description="No tasks yet" style={{ padding: "24px 0" }} />}
//                 </div>

//                 {/* Status breakdown */}
//                 <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px 24px" }}>
//                   <div className="section-header">
//                     <div>
//                       <div className="section-title">Status Breakdown</div>
//                       <div className="section-sub">All tasks</div>
//                     </div>
//                   </div>
//                   {[
//                     { key: "completed",   label: "Completed",   val: stats.completed,   color: "#10b981" },
//                     { key: "in_progress", label: "In Progress", val: stats.in_progress, color: "#3b82f6" },
//                     { key: "pending",     label: "Pending",     val: stats.pending,     color: "#f59e0b" },
//                   ].map((s) => (
//                     <div key={s.key} style={{ marginBottom: 18 }}>
//                       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
//                         <span style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</span>
//                         <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.val}</span>
//                       </div>
//                       <Progress
//                         percent={stats.total ? Math.round((s.val / stats.total) * 100) : 0}
//                         showInfo={false} strokeColor={s.color} trailColor="#f1f5f9" size="small"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}

//           {/* ── ALL TASKS ── */}
//           {activeTab === "tasks" && (
//             <>
//               <div className="filter-pills">
//                 {[
//                   { key: "all",         label: "All",         icon: <UnorderedListOutlined /> },
//                   { key: "pending",     label: "Pending",     icon: <ClockCircleOutlined />   },
//                   { key: "in_progress", label: "In Progress", icon: <SyncOutlined />          },
//                   { key: "completed",   label: "Completed",   icon: <CheckCircleOutlined />   },
//                 ].map((f) => (
//                   <button key={f.key} className={`filter-pill ${filterStatus === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
//                     {f.icon} {f.label}
//                     <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>
//                       {f.key === "all" ? tasks.length : tasks.filter((t) => t.status === f.key).length}
//                     </span>
//                   </button>
//                 ))}
//               </div>

//               {filteredTasks.length === 0 ? (
//                 <Empty description="No tasks found" style={{ padding: "48px 0" }} />
//               ) : (
//                 <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                   {filteredTasks.map((task) => (
//                     <div key={task.id} className="task-card">
//                       <div className="task-card-accent" style={{ background: task.status === "completed" ? "#10b981" : task.status === "in_progress" ? "#3b82f6" : "#f59e0b" }} />
//                       <div className="task-card-body">
//                         <div className={`task-card-title ${task.status === "completed" ? "done" : ""}`}>{task.title}</div>
//                         <div className="task-card-desc">{task.description}</div>
//                         <div className="task-card-meta">
//                           <CalendarOutlined style={{ marginRight: 4 }} />
//                           {task.created_at?.slice(0, 10)}
//                           {task.priority && (
//                             <Tag
//                               color={task.priority === "high" ? "red" : task.priority === "medium" ? "orange" : "default"}
//                               style={{ marginLeft: 8, fontSize: 11 }}
//                             >
//                               {task.priority}
//                             </Tag>
//                           )}
//                         </div>
//                       </div>
//                       <div className="task-card-actions">
//                         <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                           <Avatar name={assignedName(task)} size={26} />
//                           <span style={{ fontSize: 13, color: "#64748b" }}>{assignedName(task)}</span>
//                         </div>
//                         <StatusTag status={task.status} />
//                         {task.status !== "completed" && (
//                           <Button
//                             size="small"
//                             loading={taskLoading}
//                             onClick={() => handleUpdateStatus(task.id, task.status)}
//                             style={{
//                               fontSize: 12, borderRadius: 8,
//                               background: task.status === "pending" ? "#eff6ff" : "#ecfdf5",
//                               color:      task.status === "pending" ? "#1d4ed8" : "#065f46",
//                               border:     task.status === "pending" ? "1px solid #bfdbfe" : "1px solid #6ee7b7",
//                             }}
//                           >
//                             {task.status === "pending" ? "▶ Start" : "✓ Complete"}
//                           </Button>
//                         )}
//                         {task.status === "completed" && <span style={{ fontSize: 16 }}>🏆</span>}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}

//           {/* ── ANALYTICS ── */}
//           {activeTab === "stats" && (
//             <>
//               <div className="stat-grid" style={{ marginBottom: 24 }}>
//                 {[
//                   { label: "Completion Rate", value: stats.total ? `${Math.round((stats.completed / stats.total) * 100)}%` : "0%", icon: <TrophyOutlined />,     cls: "green",  color: "#10b981" },
//                   { label: "Active Tasks",    value: stats.in_progress, icon: <FireOutlined />,        cls: "blue",   color: "#3b82f6" },
//                   { label: "Total Tasks",     value: stats.total,       icon: <FileTextOutlined />,    cls: "purple", color: "#6366f1" },
//                   { label: "Backlog",         value: stats.pending,     icon: <ClockCircleOutlined />, cls: "amber",  color: "#f59e0b" },
//                 ].map((s) => (
//                   <div key={s.label} className={`stat-card ${s.cls}`}>
//                     <div className={`stat-icon ${s.cls}`} style={{ color: s.color }}>{s.icon}</div>
//                     <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
//                     <div className="stat-label">{s.label}</div>
//                   </div>
//                 ))}
//               </div>

//               <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px 24px" }}>
//                 <div className="section-title" style={{ marginBottom: 20 }}>Status Breakdown</div>
//                 {[
//                   { key: "completed",   label: "Completed",   val: stats.completed,   color: "#10b981" },
//                   { key: "in_progress", label: "In Progress", val: stats.in_progress, color: "#3b82f6" },
//                   { key: "pending",     label: "Pending",     val: stats.pending,     color: "#f59e0b" },
//                 ].map((s) => (
//                   <div key={s.key} style={{ marginBottom: 14 }}>
//                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
//                       <span style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</span>
//                       <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.val}</span>
//                     </div>
//                     <Progress percent={stats.total ? Math.round((s.val / stats.total) * 100) : 0} showInfo={false} strokeColor={s.color} trailColor="#f1f5f9" />
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </main>
//       </div>

//       {/* ── CREATE TASK MODAL ── */}
//       <Modal
//         title={<span><PlusOutlined style={{ marginRight: 8 }} />Create New Task</span>}
//         open={taskModal}
//         onCancel={() => { setTaskModal(false); taskForm.resetFields(); }}
//         footer={null}
//         width={480}
//       >
//         <Form form={taskForm} layout="vertical" onFinish={handleCreateTask} style={{ marginTop: 16 }}>
//           <Form.Item name="title" label="Task Title" rules={[{ required: true, message: "Title is required" }]}>
//             <Input placeholder="e.g. Build Login API" size="large" style={{ color: "black" }} />
//           </Form.Item>
//           <Form.Item name="description" label="Description">
//             <Input.TextArea placeholder="What needs to be done?" rows={3} style={{ color: "black" }} />
//           </Form.Item>
//           <Form.Item name="priority" label="Priority" initialValue="medium">
//             <Select size="large">
//               <Select.Option value="low">🟢 Low</Select.Option>
//               <Select.Option value="medium">🟡 Medium</Select.Option>
//               <Select.Option value="high">🔴 High</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             name="assigned_to"
//             label="Assign To (User ID)"
//             rules={[{ required: true, message: "Required" }]}
//             extra="Enter the numeric user ID from your backend"
//           >
//             <Input placeholder="e.g. 2" size="large" type="number" min={1} style={{ color: "black" }} />
//           </Form.Item>
//           <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//             <Button onClick={() => { setTaskModal(false); taskForm.resetFields(); }}>Cancel</Button>
//             <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={taskLoading}>
//               Create Task
//             </Button>
//           </div>
//         </Form>
//       </Modal>
//     </div>
//   );
// }

// // ════════════════════════════════════════════════════════════════════════════════
// // USER DASHBOARD
// // GET /api/my-tasks/ via myTask() action
// // PUT /api/update-task/:id/ via updateTask({ id, status }) action
// // ════════════════════════════════════════════════════════════════════════════════
// export function UserDashboard() {
//   const navigate    = useNavigate();
//   const dispatch    = useDispatch();
//   const sessionUser = getSessionUser();

//   // ── Redux: task state ─────────────────────────────────────────────────────
//   const taskState   = useSelector((state) => state.task || {});
//   const tasks       = Array.isArray(taskState.my) ? taskState.my : [];
//   const taskLoading = taskState.loading || false;
//   const taskError   = taskState.error   || null;

//   const [toast, showToast] = useToast();

//   // ── Fetch my assigned tasks on mount ──────────────────────────────────────
//   useEffect(() => {
//     dispatch(myTask());
//   }, [dispatch]);

//   useEffect(() => {
//     if (taskError) showToast(String(taskError), "error");
//   }, [taskError]);

//   // ── Logout ────────────────────────────────────────────────────────────────
//   const handleLogout = () => {
//     const refresh_token = sessionStorage.getItem("refresh_token");
//     dispatch(logoutUser({ refresh_token }));
//     sessionStorage.clear();
//     navigate("/", { replace: true });
//   };

//   // ── Update task status ────────────────────────────────────────────────────
//   // Dispatches UPDATE_TASK → saga calls PUT /api/update-task/:id/
//   // Reducer replaces task in state.task.my by id
//   const NEXT_STATUS = { pending: "in_progress", in_progress: "completed" };

//   const handleUpdateStatus = (taskId, currentStatus) => {
//     const newStatus = NEXT_STATUS[currentStatus];
//     if (!newStatus) return;
//     dispatch(updateTask({ id: taskId, status: newStatus }));
//     showToast("Task updated!");
//   };

//   // ── Derived stats ─────────────────────────────────────────────────────────
//   const stats = {
//     total:       tasks.length,
//     pending:     tasks.filter((t) => t.status === "pending").length,
//     in_progress: tasks.filter((t) => t.status === "in_progress").length,
//     completed:   tasks.filter((t) => t.status === "completed").length,
//   };

//   const pct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

//   const ACTION_BTN = {
//     pending:     { label: "Start Task",    style: { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }, icon: <ThunderboltOutlined /> },
//     in_progress: { label: "Mark Complete", style: { background: "#ecfdf5", color: "#065f46", border: "1px solid #6ee7b7" }, icon: <CheckCircleOutlined /> },
//   };

//   if (taskLoading && tasks.length === 0) {
//     return (
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
//         <Spin size="large" tip="Loading your tasks…" />
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}>
//       <Toast msg={toast?.msg} type={toast?.type} />

//       {/* Navbar */}
//       <header className="user-navbar">
//         <div className="user-navbar-brand">
//           <div className="user-navbar-logo">✦</div>
//           <span className="user-navbar-name">TaskFlow</span>
//           <span className="user-navbar-badge">USER</span>
//         </div>
//         <div className="user-navbar-right">
//           <Avatar name={displayName(sessionUser)} size={36} />
//           <div style={{ display: "flex", flexDirection: "column" }}>
//             <span className="user-nav-name">{displayName(sessionUser)}</span>
//             <span className="user-nav-handle">{sessionUser?.email || ""}</span>
//           </div>
//           <Button
//             icon={<LogoutOutlined />}
//             onClick={handleLogout}
//             style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
//           >
//             Sign Out
//           </Button>
//         </div>
//       </header>

//       <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px" }}>
//         <div style={{ marginBottom: 24 }}>
//           <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: -0.5, margin: 0 }}>My Tasks</h2>
//           <p style={{ color: "#64748b", fontSize: 15, margin: "4px 0 0" }}>
//             Hey {displayName(sessionUser).split(" ")[0]}, here's what's on your plate today 👋
//           </p>
//         </div>

//         {/* Stats */}
//         <div className="stat-grid" style={{ marginBottom: 20 }}>
//           {[
//             { label: "Total",       value: stats.total,       icon: <FileTextOutlined />,    cls: "purple", color: "#6366f1" },
//             { label: "Pending",     value: stats.pending,     icon: <ClockCircleOutlined />, cls: "amber",  color: "#f59e0b" },
//             { label: "In Progress", value: stats.in_progress, icon: <SyncOutlined />,        cls: "blue",   color: "#3b82f6" },
//             { label: "Completed",   value: stats.completed,   icon: <TrophyOutlined />,      cls: "green",  color: "#10b981" },
//           ].map((s) => (
//             <div key={s.label} className={`stat-card ${s.cls}`}>
//               <div className={`stat-icon ${s.cls}`} style={{ color: s.color }}>{s.icon}</div>
//               <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
//               <div className="stat-label">{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Progress */}
//         {stats.total > 0 && (
//           <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "18px 20px", marginBottom: 24 }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
//               <div>
//                 <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Overall Progress</span>
//                 <span style={{ color: "#94a3b8", fontSize: 13, marginLeft: 8 }}>{stats.completed} of {stats.total} tasks done</span>
//               </div>
//               <span style={{ fontWeight: 800, fontSize: 18, color: "#6366f1" }}>{pct}%</span>
//             </div>
//             <Progress percent={pct} showInfo={false} strokeColor={{ from: "#6366f1", to: "#10b981" }} trailColor="#f1f5f9" strokeLinecap="round" />
//           </div>
//         )}

//         {/* Task list */}
//         {tasks.length === 0 ? (
//           <Empty description="No tasks assigned to you yet 🎉" style={{ padding: "48px 0" }} />
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//             {tasks.map((task) => {
//               const accentColor = task.status === "completed" ? "#10b981" : task.status === "in_progress" ? "#3b82f6" : "#f59e0b";
//               const btn = ACTION_BTN[task.status];
//               return (
//                 <div key={task.id} className="task-card">
//                   <div className="task-card-accent" style={{ background: accentColor }} />
//                   <div className="task-card-body">
//                     <div className={`task-card-title ${task.status === "completed" ? "done" : ""}`}>{task.title}</div>
//                     <div className="task-card-desc">{task.description}</div>
//                     <div className="task-card-meta">
//                       <CalendarOutlined style={{ marginRight: 4 }} />
//                       {task.created_at?.slice(0, 10)}
//                     </div>
//                   </div>
//                   <div className="task-card-actions">
//                     <StatusTag status={task.status} />
//                     {task.status !== "completed" && btn && (
//                       <Button
//                         size="small"
//                         icon={btn.icon}
//                         loading={taskLoading}
//                         onClick={() => handleUpdateStatus(task.id, task.status)}
//                         style={{ ...btn.style, fontWeight: 600, borderRadius: 8, fontSize: 12 }}
//                       >
//                         {btn.label}
//                       </Button>
//                     )}
//                     {task.status === "completed" && <span style={{ fontSize: 18 }}>🏆</span>}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// src/containers/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button, Modal, Form, Input, Select, Tag,
  Progress, Empty, Spin, Table,
} from "antd";
import { logoutUser, createUser, allUser } from "../appRedux/actions/User";
import { createTask, updateTask, myTask, getTask, findAll } from "../appRedux/actions/Task1";
import { useDispatch, useSelector } from "react-redux";
import {
  DashboardOutlined, UnorderedListOutlined, BarChartOutlined,
  PlusOutlined, LogoutOutlined, MenuOutlined, CloseOutlined,
  CheckCircleOutlined, ClockCircleOutlined, SyncOutlined,
  ThunderboltOutlined, CalendarOutlined, FireOutlined,
  TrophyOutlined, EyeOutlined, FileTextOutlined, TeamOutlined,
  UserAddOutlined, CrownOutlined, UserOutlined,
} from "@ant-design/icons";
import "../App.css";

// ── HELPERS ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  ["#e8d5fb", "#6f42c1"], ["#cce5ff", "#004085"],
  ["#d4edda", "#155724"], ["#ffe8cc", "#a0522d"], ["#ffd6d6", "#9b1c1c"],
];

const displayName = (u) => u?.full_name || u?.name || "Unknown";

function Avatar({ name = "?", size = 36 }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const [bg, fg] = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className="avatar" style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}>
      {initials}
    </div>
  );
}

function StatusTag({ status }) {
  const map = {
    pending:     { icon: <ClockCircleOutlined />, color: "gold",  text: "Pending"     },
    in_progress: { icon: <SyncOutlined spin />,   color: "blue",  text: "In Progress" },
    completed:   { icon: <CheckCircleOutlined />, color: "green", text: "Completed"   },
  };
  const { icon, color, text } = map[status] || map.pending;
  return <Tag color={color} icon={icon} style={{ borderRadius: 99, fontWeight: 600, fontSize: 12 }}>{text}</Tag>;
}

function Toast({ msg, type }) {
  return msg ? (
    <div className={type === "error" ? "toast-error" : "toast-success"}>
      {type === "error" ? "⚠️" : "✅"} {msg}
    </div>
  ) : null;
}

function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  return [toast, show];
}

function getSessionUser() {
  try { return JSON.parse(sessionStorage.getItem("user") || "null"); }
  catch { return null; }
}

// ════════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ════════════════════════════════════════════════════════════════════════════════
export function AdminDashboard() {
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const sessionUser = getSessionUser();

  // ── Redux: task state ─────────────────────────────────────────────────────
  const taskState   = useSelector((state) => state.task || {});
  const findall     = useSelector((state) => state.task.find || {});
  const tasks       = Array.isArray(taskState.get) ? taskState.get : [];
  const taskLoading = taskState.loading || false;
  const taskError   = taskState.error   || null;

  // ── Redux: user state ─────────────────────────────────────────────────────
  // Assumes userReducer stores { users: [...], loading, error } under state.user
  const userState   = useSelector((state) => state.user || {});
console.log("user state",userState)


const rawAllUser = userState.AllUser;
const users = Array.isArray(rawAllUser)
  ? rawAllUser            // flat array (if reducer changes later)
  : Array.isArray(rawAllUser?.data)
    ? rawAllUser.data     // ← current shape: { status, data: [...] }
    : [];


  // const users       = Array.isArray(userState.users) ? userState.users : [];
  const userLoading = userState.loading || false;
  const userError   = userState.error   || null;

  // ── Local UI ──────────────────────────────────────────────────────────────
  const [activeTab,    setActiveTab]  = useState("overview");
  const [filterStatus, setFilter]     = useState("all");
  const [sidebarOpen,  setSidebar]    = useState(false);
  const [taskModal,    setTaskModal]  = useState(false);
  const [userModal,    setUserModal]  = useState(false);   // ← new
  const [toast,        showToast]     = useToast();
  const [taskForm]   = Form.useForm();
  const [userForm]   = Form.useForm();                     // ← new

  // ── Load all tasks + users on mount ──────────────────────────────────────
  useEffect(() => {
    dispatch(getTask());
    dispatch(findAll());
    dispatch(allUser());   // ← fetch all users for admin
  }, [dispatch]);

  useEffect(() => {
    if (taskError) showToast(String(taskError), "error");
  }, [taskError]);

  useEffect(() => {
    if (userError) showToast(String(userError), "error");
  }, [userError]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    const refresh_token = sessionStorage.getItem("refresh_token");
    dispatch(logoutUser({ refresh_token }));
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  // ── Create task ───────────────────────────────────────────────────────────
  const handleCreateTask = (values) => {
    dispatch(
      createTask({
        title:       values.title,
        description: values.description || "",
        priority:    values.priority    || "medium",
        assigned_to: Number(values.assigned_to),
      })
    );
    setTaskModal(false);
    taskForm.resetFields();
    showToast("Task created!");
    setTimeout(() => dispatch(getTask()), 800);
  };

  // ── Create user (admin only) ──────────────────────────────────────────────
  // POST body: { full_name, email, password, role }
  // Password is never stored in local state or displayed — only sent to API.
  const handleCreateUser = (values) => {
    console.log("create user values",values)
    dispatch(
      createUser({
        full_name: values.full_name,
        email:     values.email,
        password:  values.password,   // sent to API once, never stored locally
        role:      values.role || "user",
      })
    );
    setUserModal(false);
    userForm.resetFields();
    showToast("User created!");
    // Re-fetch user list so table refreshes
    setTimeout(() => dispatch(allUser()), 800);
  };

  // ── Update task status ────────────────────────────────────────────────────
  const NEXT_STATUS = { pending: "in_progress", in_progress: "completed" };

  const handleUpdateStatus = (taskId, currentStatus) => {
    const newStatus = NEXT_STATUS[currentStatus];
    if (!newStatus) return;
    dispatch(updateTask({ id: taskId, status: newStatus }));
    showToast("Status updated!");
  };

  // ── Derived stats ─────────────────────────────────────────────────────────
  const stats = {
    total:       tasks.length,
    pending:     tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed:   tasks.filter((t) => t.status === "completed").length,
  };

  const filteredTasks =
    filterStatus === "all" ? tasks : tasks.filter((t) => t.status === filterStatus);

  const assignedName = (task) =>
    task.assigned_to_name || task.assigned_name || "Unassigned";

  // ── User table columns (no password column) ───────────────────────────────
  const userColumns = [
    {
      title: "User",
      key: "user",
      render: (_, u) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={u.full_name || u.name || "?"} size={32} />
          <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>
            {u.full_name || u.name || "—"}
          </span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <span style={{ color: "#475569", fontSize: 13 }}>{email}</span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) =>
        role === "admin" ? (
          <Tag color="purple" icon={<CrownOutlined />} style={{ borderRadius: 99, fontWeight: 600 }}>
            Admin
          </Tag>
        ) : (
          <Tag color="blue" icon={<UserOutlined />} style={{ borderRadius: 99, fontWeight: 600 }}>
            User
          </Tag>
        ),
    },
  ];

  const NAV = [
    { id: "overview", icon: <DashboardOutlined />,    label: "Overview",  badge: null         },
    { id: "tasks",    icon: <UnorderedListOutlined />, label: "All Tasks", badge: stats.total  },
    { id: "users",    icon: <TeamOutlined />,          label: "Users",     badge: users.length },
    { id: "stats",    icon: <BarChartOutlined />,      label: "Analytics", badge: null         },
  ];

  const PAGE_META = {
    overview: { title: "Overview",  sub: `Welcome back, ${displayName(sessionUser).split(" ")[0]}!` },
    tasks:    { title: "All Tasks", sub: `${filteredTasks.length} tasks total`                       },
    users:    { title: "Users",     sub: `${users.length} registered users`                          },
    stats:    { title: "Analytics", sub: "Performance metrics"                                       },
  };

  if (taskLoading && tasks.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Spin size="large" tip="Loading dashboard…" />
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Toast msg={toast?.msg} type={toast?.type} />

      {/* Mobile overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`} onClick={() => setSidebar(false)} />

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">✦</div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-name">TaskFlow</div>
            <div className="sidebar-brand-role">Admin Panel</div>
          </div>
          <Button type="text" icon={<CloseOutlined />} size="small"
            style={{ color: "#475569" }} onClick={() => setSidebar(false)} />
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main</div>
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => { setActiveTab(item.id); setSidebar(false); }}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge !== null && <span className="sidebar-item-badge">{item.badge}</span>}
            </button>
          ))}

          <div className="sidebar-section-label" style={{ marginTop: 16 }}>Actions</div>
          <button className="sidebar-item" onClick={() => setTaskModal(true)}>
            <span className="sidebar-item-icon"><PlusOutlined /></span>
            <span>New Task</span>
          </button>
          <button className="sidebar-item" onClick={() => setUserModal(true)}>
            <span className="sidebar-item-icon"><UserAddOutlined /></span>
            <span>New User</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <Avatar name={displayName(sessionUser)} size={34} />
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{displayName(sessionUser)}</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogoutOutlined /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="dashboard-main">
        <header className="topbar">
          <button className="topbar-hamburger" onClick={() => setSidebar(true)}>
            <MenuOutlined />
          </button>
          <div className="topbar-title">
            <div className="topbar-page-title">{PAGE_META[activeTab].title}</div>
            <div className="topbar-page-sub">{PAGE_META[activeTab].sub}</div>
          </div>
          <div className="topbar-actions">
            {activeTab === "tasks" && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setTaskModal(true)}>
                New Task
              </Button>
            )}
            {activeTab === "users" && (
              <Button type="primary" icon={<UserAddOutlined />} onClick={() => setUserModal(true)}>
                Add User
              </Button>
            )}
            <div className="topbar-avatar-wrap">
              <Avatar name={displayName(sessionUser)} size={36} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span className="topbar-user-name">{displayName(sessionUser)}</span>
                <span className="topbar-user-role">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="content-area">

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <>
              <div className="stat-grid">
                {[
                  { label: "Total Tasks",  value: stats.total,       icon: <FileTextOutlined />,    cls: "purple", color: "#6366f1" },
                  { label: "Pending",      value: stats.pending,     icon: <ClockCircleOutlined />, cls: "amber",  color: "#f59e0b" },
                  { label: "In Progress",  value: stats.in_progress, icon: <SyncOutlined />,        cls: "blue",   color: "#3b82f6" },
                  { label: "Completed",    value: stats.completed,   icon: <TrophyOutlined />,      cls: "green",  color: "#10b981" },
                ].map((s) => (
                  <div key={s.label} className={`stat-card ${s.cls}`}>
                    <div className={`stat-icon ${s.cls}`} style={{ color: s.color }}>{s.icon}</div>
                    <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                    <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2, marginTop: 10 }}>
                      <div style={{ height: "100%", width: `${stats.total ? Math.round((s.value / stats.total) * 100) : 0}%`, background: s.color, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="overview-grid">
                {/* Recent tasks */}
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px 24px" }}>
                  <div className="section-header">
                    <div>
                      <div className="section-title">Recent Tasks</div>
                      <div className="section-sub">Latest activity</div>
                    </div>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => setActiveTab("tasks")}>View All</Button>
                  </div>
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ width: 3, height: 36, borderRadius: 4, flexShrink: 0, background: task.status === "completed" ? "#10b981" : task.status === "in_progress" ? "#3b82f6" : "#f59e0b" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.title}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>→ {assignedName(task)}</div>
                      </div>
                      <StatusTag status={task.status} />
                    </div>
                  ))}
                  {tasks.length === 0 && <Empty description="No tasks yet" style={{ padding: "24px 0" }} />}
                </div>

                {/* Status breakdown */}
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px 24px" }}>
                  <div className="section-header">
                    <div>
                      <div className="section-title">Status Breakdown</div>
                      <div className="section-sub">All tasks</div>
                    </div>
                  </div>
                  {[
                    { key: "completed",   label: "Completed",   val: stats.completed,   color: "#10b981" },
                    { key: "in_progress", label: "In Progress", val: stats.in_progress, color: "#3b82f6" },
                    { key: "pending",     label: "Pending",     val: stats.pending,     color: "#f59e0b" },
                  ].map((s) => (
                    <div key={s.key} style={{ marginBottom: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.val}</span>
                      </div>
                      <Progress
                        percent={stats.total ? Math.round((s.val / stats.total) * 100) : 0}
                        showInfo={false} strokeColor={s.color} trailColor="#f1f5f9" size="small"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── ALL TASKS ── */}
          {activeTab === "tasks" && (
            <>
              <div className="filter-pills">
                {[
                  { key: "all",         label: "All",         icon: <UnorderedListOutlined /> },
                  { key: "pending",     label: "Pending",     icon: <ClockCircleOutlined />   },
                  { key: "in_progress", label: "In Progress", icon: <SyncOutlined />          },
                  { key: "completed",   label: "Completed",   icon: <CheckCircleOutlined />   },
                ].map((f) => (
                  <button key={f.key} className={`filter-pill ${filterStatus === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
                    {f.icon} {f.label}
                    <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>
                      {f.key === "all" ? tasks.length : tasks.filter((t) => t.status === f.key).length}
                    </span>
                  </button>
                ))}
              </div>

              {filteredTasks.length === 0 ? (
                <Empty description="No tasks found" style={{ padding: "48px 0" }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="task-card">
                      <div className="task-card-accent" style={{ background: task.status === "completed" ? "#10b981" : task.status === "in_progress" ? "#3b82f6" : "#f59e0b" }} />
                      <div className="task-card-body">
                        <div className={`task-card-title ${task.status === "completed" ? "done" : ""}`}>{task.title}</div>
                        <div className="task-card-desc">{task.description}</div>
                        <div className="task-card-meta">
                          <CalendarOutlined style={{ marginRight: 4 }} />
                          {task.created_at?.slice(0, 10)}
                          {task.priority && (
                            <Tag
                              color={task.priority === "high" ? "red" : task.priority === "medium" ? "orange" : "default"}
                              style={{ marginLeft: 8, fontSize: 11 }}
                            >
                              {task.priority}
                            </Tag>
                          )}
                        </div>
                      </div>
                      <div className="task-card-actions">
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Avatar name={assignedName(task)} size={26} />
                          <span style={{ fontSize: 13, color: "#64748b" }}>{assignedName(task)}</span>
                        </div>
                        <StatusTag status={task.status} />
                        {task.status !== "completed" && (
                          <Button
                            size="small"
                            loading={taskLoading}
                            onClick={() => handleUpdateStatus(task.id, task.status)}
                            style={{
                              fontSize: 12, borderRadius: 8,
                              background: task.status === "pending" ? "#eff6ff" : "#ecfdf5",
                              color:      task.status === "pending" ? "#1d4ed8" : "#065f46",
                              border:     task.status === "pending" ? "1px solid #bfdbfe" : "1px solid #6ee7b7",
                            }}
                          >
                            {task.status === "pending" ? "▶ Start" : "✓ Complete"}
                          </Button>
                        )}
                        {task.status === "completed" && <span style={{ fontSize: 16 }}>🏆</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── USERS (Admin only) ── */}
          {activeTab === "users" && (
            <>
              {/* Summary cards */}
              <div className="stat-grid" style={{ marginBottom: 24 }}>
                {[
                  { label: "Total Users",  value: users.length,                                       icon: <TeamOutlined />,   cls: "purple", color: "#6366f1" },
                  { label: "Admins",       value: users.filter((u) => u.role === "admin").length,     icon: <CrownOutlined />,  cls: "amber",  color: "#f59e0b" },
                  { label: "Regular Users",value: users.filter((u) => u.role !== "admin").length,     icon: <UserOutlined />,   cls: "blue",   color: "#3b82f6" },
                ].map((s) => (
                  <div key={s.label} className={`stat-card ${s.cls}`}>
                    <div className={`stat-icon ${s.cls}`} style={{ color: s.color }}>{s.icon}</div>
                    <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* User list table */}
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px 24px" }}>
                <div className="section-header" style={{ marginBottom: 16 }}>
                  <div>
                    <div className="section-title">All Users</div>
                    <div className="section-sub">Name · Email · Role — passwords never shown</div>
                  </div>
                  <Button type="primary" icon={<UserAddOutlined />} onClick={() => setUserModal(true)}>
                    Add User
                  </Button>
                </div>

                {userLoading ? (
                  <div style={{ textAlign: "center", padding: "32px 0" }}>
                    <Spin tip="Loading users…" />
                  </div>
                ) : users.length === 0 ? (
                  <Empty description="No users yet" style={{ padding: "32px 0" }} />
                ) : (
                  <Table
                    dataSource={users}
                    columns={userColumns}
                    rowKey={(u) => u.id ?? u.email}
                    pagination={{ pageSize: 10, size: "small" }}
                    size="middle"
                    style={{ fontSize: 14 }}
                  />
                )}
              </div>
            </>
          )}

          {/* ── ANALYTICS ── */}
          {activeTab === "stats" && (
            <>
              <div className="stat-grid" style={{ marginBottom: 24 }}>
                {[
                  { label: "Completion Rate", value: stats.total ? `${Math.round((stats.completed / stats.total) * 100)}%` : "0%", icon: <TrophyOutlined />,     cls: "green",  color: "#10b981" },
                  { label: "Active Tasks",    value: stats.in_progress, icon: <FireOutlined />,        cls: "blue",   color: "#3b82f6" },
                  { label: "Total Tasks",     value: stats.total,       icon: <FileTextOutlined />,    cls: "purple", color: "#6366f1" },
                  { label: "Backlog",         value: stats.pending,     icon: <ClockCircleOutlined />, cls: "amber",  color: "#f59e0b" },
                ].map((s) => (
                  <div key={s.label} className={`stat-card ${s.cls}`}>
                    <div className={`stat-icon ${s.cls}`} style={{ color: s.color }}>{s.icon}</div>
                    <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px 24px" }}>
                <div className="section-title" style={{ marginBottom: 20 }}>Status Breakdown</div>
                {[
                  { key: "completed",   label: "Completed",   val: stats.completed,   color: "#10b981" },
                  { key: "in_progress", label: "In Progress", val: stats.in_progress, color: "#3b82f6" },
                  { key: "pending",     label: "Pending",     val: stats.pending,     color: "#f59e0b" },
                ].map((s) => (
                  <div key={s.key} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.val}</span>
                    </div>
                    <Progress percent={stats.total ? Math.round((s.val / stats.total) * 100) : 0} showInfo={false} strokeColor={s.color} trailColor="#f1f5f9" />
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* ── CREATE TASK MODAL ── */}
      <Modal
        title={<span><PlusOutlined style={{ marginRight: 8 }} />Create New Task</span>}
        open={taskModal}
        onCancel={() => { setTaskModal(false); taskForm.resetFields(); }}
        footer={null}
        width={480}
      >
        <Form form={taskForm} layout="vertical" onFinish={handleCreateTask} style={{ marginTop: 16 }}>
          <Form.Item name="title" label="Task Title" rules={[{ required: true, message: "Title is required" }]}>
            <Input placeholder="e.g. Build Login API" size="large" style={{ color: "black" }} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="What needs to be done?" rows={3} style={{ color: "black" }} />
          </Form.Item>
          <Form.Item name="priority" label="Priority" initialValue="medium">
            <Select size="large">
              <Select.Option value="low">🟢 Low</Select.Option>
              <Select.Option value="medium">🟡 Medium</Select.Option>
              <Select.Option value="high">🔴 High</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="assigned_to"
            label="Assign To (User ID)"
            rules={[{ required: true, message: "Required" }]}
            extra="Enter the numeric user ID from your backend"
          >
            <Input placeholder="e.g. 2" size="large" type="number" min={1} style={{ color: "black" }} />
          </Form.Item>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button onClick={() => { setTaskModal(false); taskForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={taskLoading}>
              Create Task
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ── CREATE USER MODAL (admin only) ── */}
      <Modal
        title={<span><UserAddOutlined style={{ marginRight: 8 }} />Create New User</span>}
        open={userModal}
        onCancel={() => { setUserModal(false); userForm.resetFields(); }}
        footer={null}
        width={440}
      >
        <Form form={userForm} layout="vertical" onFinish={handleCreateUser} style={{ marginTop: 16 }}>
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: "Full name is required" }]}
          >
            <Input placeholder="e.g. Siva Kumar" size="large" style={{ color: "black" }} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email",  message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="e.g. siva@gmail.com" size="large" style={{ color: "black" }} />
          </Form.Item>

          {/* Password is sent to the API once on create and never stored or shown locally */}
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6,         message: "Minimum 6 characters"  },
            ]}
          >
            <Input.Password placeholder="Min 6 characters" size="large" style={{ color: "black" }} />
          </Form.Item>

          <Form.Item name="role" label="Role" initialValue="user">
            <Select size="large">
              <Select.Option value="user">
                <UserOutlined style={{ marginRight: 6 }} />User
              </Select.Option>
              <Select.Option value="admin">
                <CrownOutlined style={{ marginRight: 6 }} />Admin
              </Select.Option>
            </Select>
          </Form.Item>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button onClick={() => { setUserModal(false); userForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" icon={<UserAddOutlined />} loading={userLoading}>
              Create User
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// USER DASHBOARD  (unchanged)
// ════════════════════════════════════════════════════════════════════════════════
export function UserDashboard() {
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const sessionUser = getSessionUser();

  const taskState   = useSelector((state) => state.task || {});
  const tasks       = Array.isArray(taskState.my) ? taskState.my : [];
  const taskLoading = taskState.loading || false;
  const taskError   = taskState.error   || null;

  const [toast, showToast] = useToast();

  useEffect(() => { dispatch(myTask()); }, [dispatch]);
  useEffect(() => { if (taskError) showToast(String(taskError), "error"); }, [taskError]);

  const handleLogout = () => {
    const refresh_token = sessionStorage.getItem("refresh_token");
    dispatch(logoutUser({ refresh_token }));
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const NEXT_STATUS = { pending: "in_progress", in_progress: "completed" };

  const handleUpdateStatus = (taskId, currentStatus) => {
    const newStatus = NEXT_STATUS[currentStatus];
    if (!newStatus) return;
    dispatch(updateTask({ id: taskId, status: newStatus }));
    showToast("Task updated!");
  };

  const stats = {
    total:       tasks.length,
    pending:     tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed:   tasks.filter((t) => t.status === "completed").length,
  };

  const pct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  const ACTION_BTN = {
    pending:     { label: "Start Task",    style: { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }, icon: <ThunderboltOutlined /> },
    in_progress: { label: "Mark Complete", style: { background: "#ecfdf5", color: "#065f46", border: "1px solid #6ee7b7" }, icon: <CheckCircleOutlined /> },
  };

  if (taskLoading && tasks.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Spin size="large" tip="Loading your tasks…" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}>
      <Toast msg={toast?.msg} type={toast?.type} />

      <header className="user-navbar">
        <div className="user-navbar-brand">
          <div className="user-navbar-logo">✦</div>
          <span className="user-navbar-name">TaskFlow</span>
          <span className="user-navbar-badge">USER</span>
        </div>
        <div className="user-navbar-right">
          <Avatar name={displayName(sessionUser)} size={36} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className="user-nav-name">{displayName(sessionUser)}</span>
            <span className="user-nav-handle">{sessionUser?.email || ""}</span>
          </div>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            Sign Out
          </Button>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: -0.5, margin: 0 }}>My Tasks</h2>
          <p style={{ color: "#64748b", fontSize: 15, margin: "4px 0 0" }}>
            Hey {displayName(sessionUser).split(" ")[0]}, here's what's on your plate today 👋
          </p>
        </div>

        <div className="stat-grid" style={{ marginBottom: 20 }}>
          {[
            { label: "Total",       value: stats.total,       icon: <FileTextOutlined />,    cls: "purple", color: "#6366f1" },
            { label: "Pending",     value: stats.pending,     icon: <ClockCircleOutlined />, cls: "amber",  color: "#f59e0b" },
            { label: "In Progress", value: stats.in_progress, icon: <SyncOutlined />,        cls: "blue",   color: "#3b82f6" },
            { label: "Completed",   value: stats.completed,   icon: <TrophyOutlined />,      cls: "green",  color: "#10b981" },
          ].map((s) => (
            <div key={s.label} className={`stat-card ${s.cls}`}>
              <div className={`stat-icon ${s.cls}`} style={{ color: s.color }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {stats.total > 0 && (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "18px 20px", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Overall Progress</span>
                <span style={{ color: "#94a3b8", fontSize: 13, marginLeft: 8 }}>{stats.completed} of {stats.total} tasks done</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: "#6366f1" }}>{pct}%</span>
            </div>
            <Progress percent={pct} showInfo={false} strokeColor={{ from: "#6366f1", to: "#10b981" }} trailColor="#f1f5f9" strokeLinecap="round" />
          </div>
        )}

        {tasks.length === 0 ? (
          <Empty description="No tasks assigned to you yet 🎉" style={{ padding: "48px 0" }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tasks.map((task) => {
              const accentColor = task.status === "completed" ? "#10b981" : task.status === "in_progress" ? "#3b82f6" : "#f59e0b";
              const btn = ACTION_BTN[task.status];
              return (
                <div key={task.id} className="task-card">
                  <div className="task-card-accent" style={{ background: accentColor }} />
                  <div className="task-card-body">
                    <div className={`task-card-title ${task.status === "completed" ? "done" : ""}`}>{task.title}</div>
                    <div className="task-card-desc">{task.description}</div>
                    <div className="task-card-meta">
                      <CalendarOutlined style={{ marginRight: 4 }} />
                      {task.created_at?.slice(0, 10)}
                    </div>
                  </div>
                  <div className="task-card-actions">
                    <StatusTag status={task.status} />
                    {task.status !== "completed" && btn && (
                      <Button
                        size="small"
                        icon={btn.icon}
                        loading={taskLoading}
                        onClick={() => handleUpdateStatus(task.id, task.status)}
                        style={{ ...btn.style, fontWeight: 600, borderRadius: 8, fontSize: 12 }}
                      >
                        {btn.label}
                      </Button>
                    )}
                    {task.status === "completed" && <span style={{ fontSize: 18 }}>🏆</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}