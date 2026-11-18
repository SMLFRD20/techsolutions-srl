// TechSolutions SRL - Portal empresarial académico
const cfg = window.APP_CONFIG || {};
const configured = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY &&
  !cfg.SUPABASE_URL.includes("PEGA_AQUI") && !cfg.SUPABASE_ANON_KEY.includes("PEGA_AQUI");
const supabaseClient = configured
  ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY)
  : null;

const $ = (id) => document.getElementById(id);
let employees = [];
let toastTimer;

function notify(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}
function showMessage(id, message, isError = true) {
  const el = $(id);
  el.textContent = message;
  el.style.color = isError ? "#c04444" : "#16875f";
}
function setLoggedIn(user) {
  $("login-view").classList.add("hidden");
  $("app-view").classList.remove("hidden");
  $("user-email").textContent = user.email || "Usuario";
  $("user-avatar").textContent = (user.email || "U").charAt(0).toUpperCase();
  loadEmployees();
}
function setLoggedOut() {
  $("app-view").classList.add("hidden");
  $("login-view").classList.remove("hidden");
}
async function loadEmployees() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient
    .from("employees")
    .select("id, full_name, department, email, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    showMessage("employee-message", "No se pudieron cargar los empleados: " + error.message);
    $("employee-count").textContent = "—";
    return;
  }
  employees = data || [];
  $("employee-count").textContent = employees.length;
  $("employee-subtitle").textContent = `${employees.length} registro(s)`;
  renderEmployees();
}
function renderEmployees() {
  const query = $("employee-search").value.trim().toLowerCase();
  const rows = employees.filter(e =>
    [e.full_name, e.department, e.email].some(v => (v || "").toLowerCase().includes(query))
  );
  const tbody = $("employee-table");
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">${employees.length ? "No hay coincidencias." : "Todavía no hay empleados registrados."}</td></tr>`;
    return;
  }
  tbody.innerHTML = rows.map(e => `
    <tr>
      <td>${escapeHtml(e.full_name)}</td>
      <td>${escapeHtml(e.department)}</td>
      <td>${escapeHtml(e.email)}</td>
      <td>${new Date(e.created_at).toLocaleDateString("es-DO")}</td>
      <td><button class="delete-btn" data-delete="${e.id}">Eliminar</button></td>
    </tr>`).join("");
  tbody.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", () => deleteEmployee(btn.dataset.delete));
  });
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
}
async function deleteEmployee(id) {
  if (!confirm("¿Deseas eliminar este registro de empleado?")) return;
  const { error } = await supabaseClient.from("employees").delete().eq("id", id);
  if (error) return showMessage("employee-message", "No se pudo eliminar: " + error.message);
  showMessage("employee-message", "Empleado eliminado correctamente.", false);
  await loadEmployees();
}
$("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) {
    showMessage("login-message", "Primero configura config.js con la URL y la clave pública de Supabase.");
    return;
  }
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: $("email").value.trim(), password: $("password").value
  });
  if (error) return showMessage("login-message", "No se pudo iniciar sesión. Verifica tus datos: " + error.message);
  showMessage("login-message", "", false);
  setLoggedIn(data.user);
});
$("logout-btn").addEventListener("click", async () => {
  if (supabaseClient) await supabaseClient.auth.signOut();
  setLoggedOut();
});
document.querySelectorAll(".nav-link").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".nav-link").forEach(b => b.classList.toggle("active", b === btn));
  const page = btn.dataset.page;
  $("dashboard-page").classList.toggle("hidden", page !== "dashboard");
  $("employees-page").classList.toggle("hidden", page !== "employees");
  $("page-title").textContent = page === "dashboard" ? "Resumen" : "Empleados";
  if (page === "employees") loadEmployees();
}));
$("refresh-btn").addEventListener("click", loadEmployees);
$("employee-search").addEventListener("input", renderEmployees);
$("add-employee-btn").addEventListener("click", () => $("employee-dialog").showModal());
$("close-dialog").addEventListener("click", () => $("employee-dialog").close());
$("cancel-dialog").addEventListener("click", () => $("employee-dialog").close());
$("employee-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) return showMessage("dialog-message", "Configura primero la conexión con Supabase.");
  const employee = {
    full_name: $("employee-name").value.trim(),
    department: $("employee-department").value,
    email: $("employee-email").value.trim()
  };
  const { error } = await supabaseClient.from("employees").insert(employee);
  if (error) return showMessage("dialog-message", "No se pudo guardar: " + error.message);
  $("employee-form").reset();
  $("employee-dialog").close();
  showMessage("employee-message", "Empleado registrado correctamente.", false);
  notify("Empleado registrado");
  await loadEmployees();
});
(async function init() {
  if (!supabaseClient) {
    showMessage("login-message", "Configuración pendiente: conecta el proyecto con Supabase para comenzar.");
    return;
  }
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session?.user) setLoggedIn(session.user);
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (session?.user) setLoggedIn(session.user);
    else setLoggedOut();
  });
})();
