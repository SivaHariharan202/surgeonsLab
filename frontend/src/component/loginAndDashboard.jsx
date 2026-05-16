import { useState } from "react";

const STATIC_USERS = [
  { id: 1, username: "admin", password: "admin123", role: "admin", name: "Admin User" },
  { id: 2, username: "john", password: "john123", role: "user", name: "John Doe" },
  { id: 3, username: "sarah", password: "sarah123", role: "user", name: "Sarah Smith" },
];

const STATIC_TASKS = [
  { id: 1, title: "Design Landing Page", description: "Create wireframes and mockups for the new landing page", status: "completed", assigned_to: 2, assigned_name: "John Doe", created_at: "2025-05-10" },
  { id: 2, title: "Fix Login Bug", description: "JWT token not expiring properly on logout", status: "in_progress", assigned_to: 2, assigned_name: "John Doe", created_at: "2025-05-12" },
  { id: 3, title: "Write Unit Tests", description: "Cover all service classes with pytest", status: "pending", assigned_to: 2, assigned_name: "John Doe", created_at: "2025-05-13" },
  { id: 4, title: "Database Migration", description: "Migrate legacy tables to new schema", status: "in_progress", assigned_to: 3, assigned_name: "Sarah Smith", created_at: "2025-05-11" },
  { id: 5, title: "API Documentation", description: "Write Swagger docs for all endpoints", status: "pending", assigned_to: 3, assigned_name: "Sarah Smith", created_at: "2025-05-14" },
  { id: 6, title: "Deploy to Staging", description: "Push latest build to staging environment", status: "pending", assigned_to: 3, assigned_name: "Sarah Smith", created_at: "2025-05-15" },
];

const STATUS_CONFIG = {
  pending:     { label: "Pending",     bg: "#FFF3CD", color: "#856404", dot: "#FFC107" },
  in_progress: { label: "In Progress", bg: "#CCE5FF", color: "#004085", dot: "#007BFF" },
  completed:   { label: "Completed",   bg: "#D4EDDA", color: "#155724", dot: "#28A745" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{ background: cfg.bg, color: cfg.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function Avatar({ name, size = 36 }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#E8D5FB","#CCE5FF","#D4EDDA","#FFE8CC","#FFD6D6"];
  const textColors = ["#6F42C1","#004085","#155724","#A0522D","#9B1C1C"];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: colors[idx], color: textColors[idx], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    if (!username || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      const user = STATIC_USERS.find(u => u.username === username && u.password === password);
      if (user) { onLogin(user); }
      else { setError("Invalid username or password."); setLoading(false); }
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: 420, padding: "40px 44px", background: "#1E293B", border: "1px solid #334155", borderRadius: 20, boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>✦</div>
          <h1 style={{ color: "#F1F5F9", fontSize: 26, fontWeight: 700, margin: 0 }}>TaskFlow</h1>
          <p style={{ color: "#94A3B8", fontSize: 14, margin: "6px 0 0" }}>Sign in to your workspace</p>
        </div>

        {error && (
          <div style={{ background: "#3F1515", border: "1px solid #7F1D1D", color: "#FCA5A5", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", color: "#94A3B8", fontSize: 13, marginBottom: 7, fontWeight: 500 }}>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Enter your username"
            style={{ width: "100%", padding: "11px 14px", background: "#0F172A", border: "1px solid #334155", borderRadius: 10, color: "#F1F5F9", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", color: "#94A3B8", fontSize: 13, marginBottom: 7, fontWeight: 500 }}>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
            type="password" placeholder="Enter your password"
            style={{ width: "100%", padding: "11px 14px", background: "#0F172A", border: "1px solid #334155", borderRadius: 10, color: "#F1F5F9", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>

        <button onClick={handleLogin} disabled={loading}
          style={{ width: "100%", padding: "13px", background: loading ? "#4338CA" : "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div style={{ marginTop: 28, padding: "16px", background: "#0F172A", borderRadius: 12, border: "1px solid #1E293B" }}>
          <p style={{ color: "#64748B", fontSize: 12, margin: "0 0 8px", fontWeight: 600, letterSpacing: "0.05em" }}>DEMO CREDENTIALS</p>
          <p style={{ color: "#94A3B8", fontSize: 12, margin: "3px 0" }}>Admin → <code style={{ color: "#A78BFA" }}>admin / admin123</code></p>
          <p style={{ color: "#94A3B8", fontSize: 12, margin: "3px 0" }}>User → <code style={{ color: "#60A5FA" }}>john / john123</code></p>
          <p style={{ color: "#94A3B8", fontSize: 12, margin: "3px 0" }}>User → <code style={{ color: "#60A5FA" }}>sarah / sarah123</code></p>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState(STATIC_TASKS);
  const [activeTab, setActiveTab] = useState("tasks");
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [users, setUsers] = useState(STATIC_USERS.filter(u => u.role === "user"));
  const [filterStatus, setFilterStatus] = useState("all");
  const [newTask, setNewTask] = useState({ title: "", description: "", assigned_to: "" });
  const [newUser, setNewUser] = useState({ name: "", username: "", password: "" });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredTasks = filterStatus === "all" ? tasks : tasks.filter(t => t.status === filterStatus);
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assigned_to) { showToast("Title and assigned user are required.", "error"); return; }
    const assignedUser = users.find(u => u.id === parseInt(newTask.assigned_to));
    const task = { id: Date.now(), ...newTask, assigned_to: parseInt(newTask.assigned_to), assigned_name: assignedUser?.name || "", status: "pending", created_at: new Date().toISOString().slice(0, 10) };
    setTasks(prev => [task, ...prev]);
    setNewTask({ title: "", description: "", assigned_to: "" });
    setShowCreateTask(false);
    showToast("Task created successfully!");
  };

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.username || !newUser.password) { showToast("All fields are required.", "error"); return; }
    const u = { id: Date.now(), ...newUser, role: "user" };
    setUsers(prev => [...prev, u]);
    setNewUser({ name: "", username: "", password: "" });
    setShowCreateUser(false);
    showToast("User created successfully!");
  };

  const sidebarItems = [
    { id: "tasks", icon: "📋", label: "All Tasks" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "stats", icon: "📊", label: "Overview" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#F8FAFC", overflow: "hidden" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, background: toast.type === "error" ? "#FEE2E2" : "#D1FAE5", color: toast.type === "error" ? "#991B1B" : "#065F46", padding: "12px 20px", borderRadius: 12, fontWeight: 500, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: `1px solid ${toast.type === "error" ? "#FCA5A5" : "#6EE7B7"}` }}>
          {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <div style={{ width: 240, background: "#0F172A", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #1E293B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✦</div>
            <div>
              <div style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 16 }}>TaskFlow</div>
              <div style={{ color: "#6366F1", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em" }}>ADMIN</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", background: activeTab === item.id ? "#1E293B" : "transparent", color: activeTab === item.id ? "#F1F5F9" : "#64748B", cursor: "pointer", fontSize: 14, fontWeight: activeTab === item.id ? 600 : 400, marginBottom: 4, textAlign: "left" }}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid #1E293B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 8 }}>
            <Avatar name={user.name} size={32} />
            <div>
              <div style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 600 }}>{user.name}</div>
              <div style={{ color: "#64748B", fontSize: 11 }}>Administrator</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ width: "100%", padding: "9px", background: "transparent", color: "#EF4444", border: "1px solid #3F1515", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 28px", background: "#fff", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0F172A" }}>
              {activeTab === "tasks" && "All Tasks"}
              {activeTab === "users" && "Team Members"}
              {activeTab === "stats" && "Overview"}
            </h2>
            <p style={{ margin: "2px 0 0", color: "#64748B", fontSize: 13 }}>
              {activeTab === "tasks" && `${filteredTasks.length} tasks`}
              {activeTab === "users" && `${users.length} active users`}
              {activeTab === "stats" && "Summary of all activity"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {activeTab === "tasks" && (
              <button onClick={() => setShowCreateTask(true)}
                style={{ padding: "9px 18px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                + New Task
              </button>
            )}
            {activeTab === "users" && (
              <button onClick={() => setShowCreateUser(true)}
                style={{ padding: "9px 18px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                + New User
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>

          {/* TASKS TAB */}
          {activeTab === "tasks" && (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                {["all","pending","in_progress","completed"].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    style={{ padding: "7px 16px", borderRadius: 20, border: "1px solid", cursor: "pointer", fontSize: 13, fontWeight: 500, background: filterStatus === s ? "#6366F1" : "#fff", color: filterStatus === s ? "#fff" : "#64748B", borderColor: filterStatus === s ? "#6366F1" : "#E2E8F0" }}>
                    {s === "all" ? "All" : s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredTasks.map(task => (
                  <div key={task.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "#0F172A", fontSize: 15 }}>{task.title}</div>
                      <div style={{ color: "#64748B", fontSize: 13, marginTop: 3 }}>{task.description}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar name={task.assigned_name} size={28} />
                      <span style={{ color: "#475569", fontSize: 13 }}>{task.assigned_name}</span>
                    </div>
                    <div style={{ color: "#94A3B8", fontSize: 12 }}>{task.created_at}</div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
                {filteredTasks.length === 0 && (
                  <div style={{ textAlign: "center", color: "#94A3B8", padding: "48px 0", fontSize: 15 }}>No tasks found.</div>
                )}
              </div>
            </>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {users.map(u => {
                const userTasks = tasks.filter(t => t.assigned_to === u.id);
                const done = userTasks.filter(t => t.status === "completed").length;
                return (
                  <div key={u.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <Avatar name={u.name} size={44} />
                      <div>
                        <div style={{ fontWeight: 600, color: "#0F172A", fontSize: 15 }}>{u.name}</div>
                        <div style={{ color: "#64748B", fontSize: 13 }}>@{u.username}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ flex: 1, background: "#F8FAFC", borderRadius: 10, padding: "10px", textAlign: "center" }}>
                        <div style={{ fontWeight: 700, fontSize: 20, color: "#6366F1" }}>{userTasks.length}</div>
                        <div style={{ color: "#64748B", fontSize: 12 }}>Assigned</div>
                      </div>
                      <div style={{ flex: 1, background: "#F8FAFC", borderRadius: 10, padding: "10px", textAlign: "center" }}>
                        <div style={{ fontWeight: 700, fontSize: 20, color: "#10B981" }}>{done}</div>
                        <div style={{ color: "#64748B", fontSize: 12 }}>Completed</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === "stats" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Total Tasks", value: stats.total, color: "#6366F1", bg: "#EEF2FF" },
                  { label: "Pending", value: stats.pending, color: "#F59E0B", bg: "#FFFBEB" },
                  { label: "In Progress", value: stats.in_progress, color: "#3B82F6", bg: "#EFF6FF" },
                  { label: "Completed", value: stats.completed, color: "#10B981", bg: "#ECFDF5" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "20px" }}>
                    <div style={{ color: "#64748B", fontSize: 13, marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ height: 4, background: "#F1F5F9", borderRadius: 2, marginTop: 12 }}>
                      <div style={{ height: "100%", width: `${Math.round((s.value / stats.total) * 100)}%`, background: s.color, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "20px" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#0F172A" }}>Recent Tasks</h3>
                {tasks.slice(0, 4).map(task => (
                  <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 14, color: "#0F172A" }}>{task.title}</div>
                      <div style={{ color: "#94A3B8", fontSize: 12 }}>→ {task.assigned_name}</div>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "32px", width: 460, boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#0F172A" }}>Create New Task</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: "#64748B", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Task Title *</label>
              <input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} placeholder="Enter task title"
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: "#64748B", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Description</label>
              <textarea value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} placeholder="Task description..."
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 80 }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", color: "#64748B", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Assign To *</label>
              <select value={newTask.assigned_to} onChange={e => setNewTask(p => ({ ...p, assigned_to: e.target.value }))}
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 14, outline: "none", background: "#fff" }}>
                <option value="">Select user...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowCreateTask(false)}
                style={{ flex: 1, padding: "11px", background: "#F8FAFC", color: "#64748B", border: "1px solid #E2E8F0", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={handleCreateTask}
                style={{ flex: 1, padding: "11px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUser && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "32px", width: 420, boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#0F172A" }}>Create New User</h3>
            {["name","username","password"].map(field => (
              <div key={field} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#64748B", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                  {field.charAt(0).toUpperCase() + field.slice(1)} *
                </label>
                <input type={field === "password" ? "password" : "text"} value={newUser[field]} onChange={e => setNewUser(p => ({ ...p, [field]: e.target.value }))}
                  placeholder={`Enter ${field}`}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowCreateUser(false)}
                style={{ flex: 1, padding: "11px", background: "#F8FAFC", color: "#64748B", border: "1px solid #E2E8F0", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={handleCreateUser}
                style={{ flex: 1, padding: "11px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState(STATIC_TASKS.filter(t => t.assigned_to === user.id));
  const [toast, setToast] = useState(null);
  const [updating, setUpdating] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const nextStatus = { pending: "in_progress", in_progress: "completed" };

  const updateStatus = (taskId) => {
    setUpdating(taskId);
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus[t.status] || t.status } : t));
      setUpdating(null);
      showToast("Task status updated!");
    }, 500);
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
  };

  const actionLabel = { pending: "Start Task", in_progress: "Mark Complete" };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Segoe UI', sans-serif" }}>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, background: "#D1FAE5", color: "#065F46", padding: "12px 20px", borderRadius: 12, fontWeight: 500, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: "1px solid #6EE7B7" }}>
          ✅ {toast}
        </div>
      )}

      {/* Navbar */}
      <div style={{ background: "#0F172A", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✦</div>
          <span style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 18 }}>TaskFlow</span>
          <span style={{ background: "#1E293B", color: "#60A5FA", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em" }}>USER</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar name={user.name} size={36} />
          <div>
            <div style={{ color: "#F1F5F9", fontSize: 14, fontWeight: 600 }}>{user.name}</div>
            <div style={{ color: "#64748B", fontSize: 12 }}>@{user.username}</div>
          </div>
          <button onClick={onLogout}
            style={{ padding: "7px 16px", background: "transparent", color: "#EF4444", border: "1px solid #3F1515", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, marginLeft: 8 }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 700, color: "#0F172A" }}>My Tasks</h2>
          <p style={{ margin: 0, color: "#64748B", fontSize: 15 }}>Welcome back, {user.name.split(" ")[0]}! Here's your workload.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total", value: stats.total, color: "#6366F1" },
            { label: "Pending", value: stats.pending, color: "#F59E0B" },
            { label: "In Progress", value: stats.in_progress, color: "#3B82F6" },
            { label: "Completed", value: stats.completed, color: "#10B981" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "18px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        {stats.total > 0 && (
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "20px", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontWeight: 600, color: "#0F172A", fontSize: 15 }}>Overall Progress</span>
              <span style={{ color: "#6366F1", fontWeight: 700 }}>{Math.round((stats.completed / stats.total) * 100)}%</span>
            </div>
            <div style={{ height: 10, background: "#F1F5F9", borderRadius: 10 }}>
              <div style={{ height: "100%", width: `${Math.round((stats.completed / stats.total) * 100)}%`, background: "linear-gradient(90deg,#6366F1,#10B981)", borderRadius: 10, transition: "width 0.4s ease" }} />
            </div>
          </div>
        )}

        {/* Task Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tasks.map(task => (
            <div key={task.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 4, height: 48, borderRadius: 4, background: task.status === "completed" ? "#10B981" : task.status === "in_progress" ? "#3B82F6" : "#F59E0B", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: task.status === "completed" ? "#94A3B8" : "#0F172A", fontSize: 16, textDecoration: task.status === "completed" ? "line-through" : "none" }}>
                  {task.title}
                </div>
                <div style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>{task.description}</div>
                <div style={{ color: "#CBD5E1", fontSize: 12, marginTop: 4 }}>Assigned: {task.created_at}</div>
              </div>
              <StatusBadge status={task.status} />
              {task.status !== "completed" && (
                <button onClick={() => updateStatus(task.id)} disabled={updating === task.id}
                  style={{ padding: "8px 16px", background: task.status === "in_progress" ? "#D1FAE5" : "#EEF2FF", color: task.status === "in_progress" ? "#065F46" : "#4338CA", border: "none", borderRadius: 10, cursor: updating === task.id ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                  {updating === task.id ? "..." : actionLabel[task.status]}
                </button>
              )}
            </div>
          ))}
          {tasks.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8", fontSize: 16 }}>
              🎉 No tasks assigned to you yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser) return <LoginPage onLogin={setCurrentUser} />;
  if (currentUser.role === "admin") return <AdminDashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
  return <UserDashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
}