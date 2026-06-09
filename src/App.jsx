import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ─── SISTEMA DE USUARIOS Y ROLES ─────────────────────────────────────────────
// ROLES:
//  GERENCIA    → acceso total + gestión de usuarios
//  COMERCIAL   → presupuestos + CRM (sin ver costes reales)
//  JEFE_OBRA   → proyectos + gastos + certificaciones
//  ADMIN       → cobros + saldos + gastos
//  OPERARIO    → solo proyectos (lectura)

const ROLES_CFG = {
  GERENCIA:   { label: "Gerencia",      color: "#C9A84C", tabs: ["dashboard","presupuestos","crm","proyectos","gastos","cobros","saldos","usuarios"] },
  COMERCIAL:  { label: "Comercial",     color: "#5B9BD5", tabs: ["dashboard","presupuestos","crm"] },
  JEFE_OBRA:  { label: "Jefe de obra",  color: "#4CAF82", tabs: ["dashboard","proyectos","gastos","cobros"] },
  ADMIN:      { label: "Administración",color: "#D4A843", tabs: ["dashboard","gastos","cobros","saldos"] },
  OPERARIO:   { label: "Operario",      color: "#A09880", tabs: ["proyectos"] },
};

// Usuarios iniciales — en producción esto viviría en base de datos
const initUsuarios = [
  { id: 1, nombre: "Admin BAÜEN",   email: "admin@bauen.es",    password: "bauen2024",  rol: "GERENCIA",  activo: true,  avatar: "AB" },
  { id: 2, nombre: "Marta Sánchez", email: "marta@bauen.es",    password: "comercial1", rol: "COMERCIAL", activo: true,  avatar: "MS" },
  { id: 3, nombre: "Carlos Vidal",  email: "carlos@bauen.es",   password: "jefobra1",   rol: "JEFE_OBRA", activo: true,  avatar: "CV" },
  { id: 4, nombre: "Laura Gómez",   email: "laura@bauen.es",    password: "admin123",   rol: "ADMIN",     activo: true,  avatar: "LG" },
  { id: 5, nombre: "Pedro Martín",  email: "pedro@bauen.es",    password: "operario1",  rol: "OPERARIO",  activo: true,  avatar: "PM" },
];

// ─── PANTALLA DE LOGIN ────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin, usuarios }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) { setError("Completa todos los campos"); return; }
    setLoading(true);
    setError("");
    // Simulamos latencia de red
    setTimeout(() => {
      const user = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.activo);
      if (user) {
        onLogin(user);
      } else {
        setError("Email o contraseña incorrectos");
        setLoading(false);
      }
    }, 800);
  };

  const C2 = { bg: "#111", surface: "#1A1A1A", border: "#333", text: "#F5F0E8", textMid: "#A09880", gold: "#C9A84C", goldL: "#E8C96A", goldD: "#8A6E2A", red: "#E05555" };

  return (
    <div style={{ minHeight: "100vh", background: C2.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ width: 64, height: 64, background: `linear-gradient(135deg, ${C2.goldL}, ${C2.goldD})`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 900, color: "#111", margin: "0 auto 16px", boxShadow: `0 8px 32px rgba(201,168,76,.3)` }}>B</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: C2.text, letterSpacing: 4 }}>BAÜEN</div>
        <div style={{ fontSize: 11, color: C2.textMid, letterSpacing: 3, marginTop: 4 }}>GESTIÓN DE CONSTRUCCIÓN</div>
      </div>

      {/* Card login */}
      <div style={{ width: "100%", maxWidth: 380, background: C2.surface, border: `1px solid ${C2.border}`, borderRadius: 20, padding: 32, boxShadow: "0 24px 64px rgba(0,0,0,.5)" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: C2.text, marginBottom: 6 }}>Acceder</div>
        <div style={{ fontSize: 13, color: C2.textMid, marginBottom: 28 }}>Introduce tus credenciales para continuar</div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C2.textMid, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="tu@bauen.es"
            style={{ width: "100%", padding: "13px 16px", border: `1.5px solid ${error ? C2.red : C2.border}`, borderRadius: 10, fontSize: 15, color: C2.text, background: "#222", boxSizing: "border-box", outline: "none" }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C2.textMid, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Contraseña</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              style={{ width: "100%", padding: "13px 48px 13px 16px", border: `1.5px solid ${error ? C2.red : C2.border}`, borderRadius: 10, fontSize: 15, color: C2.text, background: "#222", boxSizing: "border-box", outline: "none" }}
            />
            <button onClick={() => setShowPass(s => !s)}
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C2.textMid, cursor: "pointer", fontSize: 16, padding: 4 }}>
              {showPass ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(224,85,85,.12)", border: "1px solid rgba(224,85,85,.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: C2.red, fontSize: 13, fontWeight: 600 }}>
            ⚠ {error}
          </div>
        )}

        <button onClick={handleLogin} disabled={loading}
          style={{ width: "100%", padding: "14px", background: loading ? "#333" : `linear-gradient(135deg, ${C2.goldL}, ${C2.gold})`, border: "none", borderRadius: 10, fontSize: 15, fontWeight: 800, color: loading ? C2.textMid : "#111", cursor: loading ? "not-allowed" : "pointer", marginTop: 8, transition: "all .2s", letterSpacing: 0.5 }}>
          {loading ? "Verificando..." : "Entrar →"}
        </button>

        {/* Usuarios demo */}
        <div style={{ marginTop: 28, padding: 16, background: "#1f1f1f", borderRadius: 10, border: `1px solid #2a2a2a` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C2.textMid, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Accesos de prueba</div>
          {[
            { rol: "GERENCIA",  email: "admin@bauen.es",  pass: "bauen2024" },
            { rol: "COMERCIAL", email: "marta@bauen.es",  pass: "comercial1" },
            { rol: "JEFE_OBRA", email: "carlos@bauen.es", pass: "jefobra1" },
          ].map(u => {
            const cfg = ROLES_CFG[u.rol];
            return (
              <div key={u.rol} onClick={() => { setEmail(u.email); setPassword(u.pass); setError(""); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 4, border: "1px solid transparent", transition: "all .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#2a2a2a"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{cfg.label}</div>
                  <div style={{ fontSize: 11, color: C2.textMid }}>{u.email}</div>
                </div>
                <div style={{ fontSize: 10, color: C2.textMid, fontFamily: "monospace", background: "#111", padding: "3px 8px", borderRadius: 4 }}>{u.pass}</div>
              </div>
            );
          })}
          <div style={{ fontSize: 10, color: C2.textMid, marginTop: 8, textAlign: "center" }}>Toca un usuario para rellenar automáticamente</div>
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 11, color: C2.textMid, letterSpacing: 0.5 }}>
        BAÜEN app v1.0 · {new Date().getFullYear()}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap'); * { box-sizing: border-box; } body { margin: 0; } input { color-scheme: dark; } input::placeholder { color: #5A5550; }`}</style>
    </div>
  );
};

// ─── GESTIÓN DE USUARIOS (solo GERENCIA) ─────────────────────────────────────
const GestionUsuarios = ({ usuarios, setUsuarios, currentUser }) => {
  const [modal, setModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "", password: "", rol: "COMERCIAL", activo: true });

  const abrirNuevo = () => {
    setEditUser(null);
    setForm({ nombre: "", email: "", password: "", rol: "COMERCIAL", activo: true });
    setModal(true);
  };

  const abrirEditar = (u) => {
    setEditUser(u);
    setForm({ nombre: u.nombre, email: u.email, password: u.password, rol: u.rol, activo: u.activo });
    setModal(true);
  };

  const guardar = () => {
    const avatar = form.nombre.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    if (editUser) {
      setUsuarios(prev => prev.map(u => u.id === editUser.id ? { ...u, ...form, avatar } : u));
    } else {
      setUsuarios(prev => [...prev, { id: Date.now(), ...form, avatar, activo: true }]);
    }
    setModal(false);
  };

  const toggleActivo = (id) => {
    if (id === currentUser.id) return; // no puede desactivarse a sí mismo
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, activo: !u.activo } : u));
  };

  const C2 = { bg: "#111", surface: "#1A1A1A", panel: "#222", card: "#252525", border: "#333", text: "#F5F0E8", textMid: "#A09880", textLow: "#5A5550", gold: "#C9A84C", goldL: "#E8C96A", goldD: "#8A6E2A", goldBg: "rgba(201,168,76,.10)", green: "#4CAF82", greenBg: "rgba(76,175,130,.12)", red: "#E05555", redBg: "rgba(224,85,85,.12)" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: C2.text, fontSize: 22, fontWeight: 800 }}>Usuarios</h2>
          <p style={{ margin: "4px 0 0", color: C2.textMid, fontSize: 12 }}>{usuarios.filter(u => u.activo).length} activos · {usuarios.length} total</p>
        </div>
        <button onClick={abrirNuevo} style={{ background: `linear-gradient(135deg, ${C2.goldL}, ${C2.gold})`, border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, fontSize: 14, color: "#111", cursor: "pointer" }}>+ Nuevo usuario</button>
      </div>

      {usuarios.map(u => {
        const cfg = ROLES_CFG[u.rol];
        const esSelf = u.id === currentUser.id;
        return (
          <div key={u.id} style={{ background: C2.card, border: `1px solid ${C2.border}`, borderRadius: 12, padding: 16, marginBottom: 10, opacity: u.activo ? 1 : 0.5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: u.activo ? `linear-gradient(135deg, ${cfg.color}33, ${cfg.color}66)` : C2.panel, border: `2px solid ${u.activo ? cfg.color : C2.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: u.activo ? cfg.color : C2.textLow, flexShrink: 0 }}>
                {u.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 800, color: C2.text, fontSize: 14 }}>{u.nombre}</span>
                  {esSelf && <span style={{ fontSize: 10, background: C2.goldBg, color: C2.gold, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>TÚ</span>}
                  {!u.activo && <span style={{ fontSize: 10, background: C2.redBg, color: C2.red, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>INACTIVO</span>}
                </div>
                <div style={{ fontSize: 12, color: C2.textMid, marginTop: 2 }}>{u.email}</div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 10, background: `${cfg.color}22`, color: cfg.color, padding: "2px 8px", borderRadius: 10, fontWeight: 700, border: `1px solid ${cfg.color}33` }}>
                    {cfg.label.toUpperCase()}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => abrirEditar(u)}
                  style={{ background: C2.panel, border: `1px solid ${C2.border}`, borderRadius: 8, padding: "7px 12px", color: C2.text, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Editar
                </button>
                {!esSelf && (
                  <button onClick={() => toggleActivo(u.id)}
                    style={{ background: u.activo ? C2.redBg : C2.greenBg, border: `1px solid ${u.activo ? C2.red : C2.green}44`, borderRadius: 8, padding: "7px 12px", color: u.activo ? C2.red : C2.green, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    {u.activo ? "Desactivar" : "Activar"}
                  </button>
                )}
              </div>
            </div>
            {/* Permisos del rol */}
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C2.border}`, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {cfg.tabs.filter(t => t !== "usuarios").map(t => {
                const labels = { dashboard: "Panel", presupuestos: "Presupuestos", crm: "Comercial", proyectos: "Proyectos", gastos: "Gastos", cobros: "Cobros", saldos: "Saldos" };
                return <span key={t} style={{ fontSize: 10, color: C2.textMid, background: C2.panel, padding: "2px 8px", borderRadius: 6, border: `1px solid ${C2.border}` }}>{labels[t]}</span>;
              })}
            </div>
          </div>
        );
      })}

      {/* MODAL nuevo/editar usuario */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={{ background: C2.surface, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 500, padding: 28, border: `1px solid ${C2.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ margin: 0, color: C2.text, fontSize: 17, fontWeight: 800 }}>{editUser ? "Editar usuario" : "Nuevo usuario"}</h3>
              <button onClick={() => setModal(false)} style={{ background: C2.panel, border: "none", width: 32, height: 32, borderRadius: "50%", fontSize: 18, cursor: "pointer", color: C2.textMid }}>×</button>
            </div>
            {[["Nombre completo", "nombre", "text", "Ej: Juan García"],["Email", "email", "email", "juan@bauen.es"],["Contraseña", "password", "text", "Mínimo 6 caracteres"]].map(([lbl, key, type, ph]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: C2.textMid, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>{lbl}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph}
                  style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${C2.border}`, borderRadius: 8, fontSize: 14, color: C2.text, background: C2.panel, boxSizing: "border-box", outline: "none" }} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: C2.textMid, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>Rol</label>
              <select value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}
                style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${C2.border}`, borderRadius: 8, fontSize: 14, color: C2.text, background: C2.panel, boxSizing: "border-box" }}>
                {Object.entries(ROLES_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <div style={{ marginTop: 8, padding: 10, background: C2.panel, borderRadius: 8, border: `1px solid ${C2.border}` }}>
                <div style={{ fontSize: 10, color: C2.textMid, marginBottom: 4 }}>ACCESO A MÓDULOS:</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {ROLES_CFG[form.rol]?.tabs.filter(t => t !== "usuarios").map(t => {
                    const labels = { dashboard: "Panel", presupuestos: "Presupuestos", crm: "Comercial", proyectos: "Proyectos", gastos: "Gastos", cobros: "Cobros", saldos: "Saldos" };
                    return <span key={t} style={{ fontSize: 11, color: ROLES_CFG[form.rol].color, background: `${ROLES_CFG[form.rol].color}22`, padding: "3px 10px", borderRadius: 6, fontWeight: 600 }}>{labels[t]}</span>;
                  })}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: 13, background: C2.panel, border: `1px solid ${C2.border}`, borderRadius: 10, color: C2.text, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Cancelar</button>
              <button onClick={guardar} style={{ flex: 1, padding: 13, background: `linear-gradient(135deg, ${C2.goldL}, ${C2.gold})`, border: "none", borderRadius: 10, color: "#111", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                {editUser ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PALETA BAÜEN: Negro · Gris · Dorado ─────────────────────────────────────
const C = {
  bg:       "#111111",
  surface:  "#1A1A1A",
  panel:    "#222222",
  card:     "#252525",
  border:   "#333333",
  borderL:  "#3E3E3E",
  text:     "#F5F0E8",
  textMid:  "#A09880",
  textLow:  "#5A5550",
  gold:     "#C9A84C",
  goldL:    "#E8C96A",
  goldD:    "#8A6E2A",
  goldBg:   "rgba(201,168,76,.10)",
  green:    "#4CAF82",
  greenBg:  "rgba(76,175,130,.12)",
  red:      "#E05555",
  redBg:    "rgba(224,85,85,.12)",
  yellow:   "#D4A843",
  yellowBg: "rgba(212,168,67,.12)",
  blue:     "#5B9BD5",
  blueBg:   "rgba(91,155,213,.12)",
};

// ─── DATOS DEMO ──────────────────────────────────────────────────────────────
const CLIENTES = [
  { id: 1, nombre: "Inmobiliaria Levante S.L.", contacto: "Pedro Ruiz", telefono: "963 123 456", email: "pedro@levante.es" },
  { id: 2, nombre: "Constructora Medina & Hijos", contacto: "Ana Medina", telefono: "954 987 654", email: "ana@medina.es" },
  { id: 3, nombre: "Grupo Inmobiliario Norte", contacto: "Luis García", telefono: "944 555 333", email: "luis@ginorte.es" },
];

const initPresupuestos = [
  { id: 1, codigo: "PRE-2024-001", clienteId: 1, descripcion: "Nave industrial 2.400 m²", version: 1, estado: "APROBADO", total: 485000, margen: 18, fechaCreacion: "2024-01-10", fechaValidez: "2024-02-10", partidas: [{ cap: "01 Cimentación", ud: "m²", med: 2400, pu: 85, total: 204000 }, { cap: "02 Estructura metálica", ud: "m²", med: 2400, pu: 120, total: 288000 }] },
  { id: 2, codigo: "PRE-2024-002", clienteId: 2, descripcion: "Reforma oficinas planta 3", version: 2, estado: "NEGOCIACION", total: 127500, margen: 22, fechaCreacion: "2024-02-05", fechaValidez: "2024-03-05", partidas: [{ cap: "01 Demolición", ud: "m²", med: 350, pu: 45, total: 15750 }, { cap: "02 Tabiquería pladur", ud: "m²", med: 280, pu: 85, total: 23800 }, { cap: "03 Instalaciones", ud: "ud", med: 1, pu: 87950, total: 87950 }] },
  { id: 3, codigo: "PRE-2024-003", clienteId: 3, descripcion: "Urbanización 40 viviendas", version: 1, estado: "ENVIADO", total: 2100000, margen: 15, fechaCreacion: "2024-02-20", fechaValidez: "2024-03-20", partidas: [{ cap: "01 Movimiento de tierras", ud: "m³", med: 8000, pu: 12, total: 96000 }, { cap: "02 Urbanización exterior", ud: "m²", med: 12000, pu: 167, total: 2004000 }] },
];

const initProyectos = [
  { id: 1, codigo: "OBR-2024-001", presupuestoId: 1, clienteId: 1, nombre: "Nave Industrial Levante", estado: "EN_EJECUCION", presupuestoAprobado: 485000, costeEstimado: 398000, costeReal: 210500, fechaInicio: "2024-02-01", fechaFinPrevista: "2024-08-31", jefeObra: "Carlos Vidal", certificadoAcumulado: 240000, cobradoAcumulado: 180000 },
];

const initCRM = [
  { id: 1, presupuestoId: 1, clienteId: 1, estado: "GANADO", probabilidad: 100, comercial: "Marta Sánchez", proximaAccion: "Firma de contrato", fechaAccion: "2024-01-20", interacciones: [{ tipo: "REUNION", fecha: "2024-01-12", resumen: "Visita a la parcela, cliente muy interesado" }, { tipo: "EMAIL", fecha: "2024-01-15", resumen: "Envío de propuesta definitiva v2" }] },
  { id: 2, presupuestoId: 2, clienteId: 2, estado: "EN_NEGOCIACION", probabilidad: 65, comercial: "Marta Sánchez", proximaAccion: "Reunión para ajustar partidas", fechaAccion: "2024-02-28", interacciones: [{ tipo: "LLAMADA", fecha: "2024-02-10", resumen: "Cliente pide reducir presupuesto un 10%" }] },
  { id: 3, presupuestoId: 3, clienteId: 3, estado: "PENDIENTE_DECISION", probabilidad: 40, comercial: "Jorge Pérez", proximaAccion: "Seguimiento semanal", fechaAccion: "2024-03-01", interacciones: [{ tipo: "REUNION", fecha: "2024-02-22", resumen: "Presentación técnica al consejo" }] },
];

const initGastos = [
  { id: 1, proyectoId: 1, tipo: "MATERIAL", concepto: "Hormigón HA-25 100m³", importe: 12500, fecha: "2024-03-01", estado: "PAGADO", proveedor: "Hormipresa S.A." },
  { id: 2, proyectoId: 1, tipo: "MANO_OBRA", concepto: "Partes semana 10", importe: 8400, fecha: "2024-03-08", estado: "PENDIENTE", proveedor: "Equipo propio" },
  { id: 3, proyectoId: 1, tipo: "SUBCONTRATA", concepto: "Instalación eléctrica fase 1", importe: 28000, fecha: "2024-03-05", estado: "PAGADO", proveedor: "Electra Norte S.L." },
  { id: 4, proyectoId: 1, tipo: "MATERIAL", concepto: "Acero B-500-S 15t", importe: 18750, fecha: "2024-03-12", estado: "PENDIENTE", proveedor: "Aceros del Sur" },
];

const initCertificaciones = [
  { id: 1, proyectoId: 1, numero: 1, periodo: "Febrero 2024", total: 95000, retencion: 5, importeFacturar: 90250, estado: "COBRADA", fechaCobro: "2024-03-10" },
  { id: 2, proyectoId: 1, numero: 2, periodo: "Marzo 2024", total: 145000, retencion: 5, importeFacturar: 137750, estado: "FACTURADA", fechaCobro: null },
];

// ─── UTILS ───────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtN = (n) => new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(n);

const ESTADO_CFG = {
  APROBADO:           { bg: C.greenBg,  color: C.green,   label: "Aprobado" },
  GANADO:             { bg: C.greenBg,  color: C.green,   label: "Ganado" },
  EN_EJECUCION:       { bg: C.greenBg,  color: C.green,   label: "En ejecución" },
  COBRADA:            { bg: C.greenBg,  color: C.green,   label: "Cobrada" },
  PAGADO:             { bg: C.greenBg,  color: C.green,   label: "Pagado" },
  NEGOCIACION:        { bg: C.yellowBg, color: C.yellow,  label: "Negociación" },
  EN_NEGOCIACION:     { bg: C.yellowBg, color: C.yellow,  label: "En negociación" },
  PENDIENTE_DECISION: { bg: C.yellowBg, color: C.yellow,  label: "Pend. decisión" },
  PENDIENTE:          { bg: C.yellowBg, color: C.yellow,  label: "Pendiente" },
  ENVIADO:            { bg: C.blueBg,   color: C.blue,    label: "Enviado" },
  FACTURADA:          { bg: C.blueBg,   color: C.blue,    label: "Facturada" },
  PLANIFICACION:      { bg: C.blueBg,   color: C.blue,    label: "Planificación" },
  BORRADOR:           { bg: "rgba(255,255,255,.06)", color: C.textMid, label: "Borrador" },
  RECHAZADO:          { bg: C.redBg,    color: C.red,     label: "Rechazado" },
  PERDIDO:            { bg: C.redBg,    color: C.red,     label: "Perdido" },
};

const Badge = ({ estado }) => {
  const cfg = ESTADO_CFG[estado] || { bg: "rgba(255,255,255,.06)", color: C.textMid, label: estado };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, letterSpacing: 0.8, whiteSpace: "nowrap", border: `1px solid ${cfg.color}22` }}>
      {cfg.label.toUpperCase()}
    </span>
  );
};

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────────

const KPI = ({ label, value, sub, color, icon }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", flex: 1, minWidth: 140 }}>
    <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 20, fontWeight: 800, color: color || C.gold, letterSpacing: -0.5 }}>{value}</div>
    <div style={{ fontSize: 11, color: C.textMid, fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: C.textLow, marginTop: 3 }}>{sub}</div>}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", small, full, style: s }) => {
  const base = {
    border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700,
    fontSize: small ? 12 : 14, padding: small ? "7px 14px" : "11px 20px",
    transition: "all .15s", width: full ? "100%" : "auto",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    ...s
  };
  const variants = {
    primary:   { background: `linear-gradient(135deg, ${C.goldL}, ${C.gold})`, color: "#111" },
    secondary: { background: C.panel, color: C.text, border: `1px solid ${C.border}` },
    ghost:     { background: "transparent", color: C.gold, border: `1px solid ${C.goldD}` },
    danger:    { background: C.redBg, color: C.red, border: `1px solid ${C.red}44` },
    success:   { background: C.greenBg, color: C.green, border: `1px solid ${C.green}44` },
    whatsapp:  { background: "#25D366", color: "#fff" },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick}>{children}</button>;
};

const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0" }}
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{ background: C.surface, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: wide ? 780 : 620, maxHeight: "92vh", overflow: "auto", boxShadow: "0 -20px 60px rgba(0,0,0,.5)", border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: C.surface, zIndex: 1 }}>
        <h3 style={{ margin: 0, color: C.text, fontSize: 17, fontWeight: 800 }}>{title}</h3>
        <button onClick={onClose} style={{ background: C.panel, border: "none", width: 32, height: 32, borderRadius: "50%", fontSize: 18, cursor: "pointer", color: C.textMid, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

const Field = ({ label, children, half }) => (
  <div style={{ marginBottom: 14, flex: half ? "1 1 calc(50% - 8px)" : "1 1 100%" }}>
    <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: C.textMid, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</label>
    {children}
  </div>
);

const inputStyle = { width: "100%", padding: "11px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.text, background: C.panel, boxSizing: "border-box", outline: "none", WebkitAppearance: "none" };

const Input = ({ value, onChange, type = "text", placeholder }) => (
  <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={inputStyle} />
);

const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

// Card para mobile — más touch-friendly que tabla
const ItemCard = ({ children, onClick }) => (
  <div onClick={onClick} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px", marginBottom: 10, cursor: onClick ? "pointer" : "default", transition: "border-color .15s" }}
    onTouchStart={e => { if (onClick) e.currentTarget.style.borderColor = C.gold; }}
    onTouchEnd={e => { e.currentTarget.style.borderColor = C.border; }}>
    {children}
  </div>
);

// Tabla horizontal — visible en desktop, scrollable en mobile
const Table = ({ cols, rows, onRow }) => (
  <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${C.border}` }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: C.panel }}>
          {cols.map(c => (
            <th key={c.key} style={{ padding: "10px 16px", textAlign: c.right ? "right" : "left", color: C.textMid, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap", borderBottom: `1px solid ${C.border}` }}>{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} onClick={() => onRow && onRow(row)}
            style={{ borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none", cursor: onRow ? "pointer" : "default", background: "transparent", transition: "background .1s" }}
            onMouseEnter={e => { if (onRow) e.currentTarget.style.background = C.panel; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            {cols.map(c => (
              <td key={c.key} style={{ padding: "13px 16px", color: C.text, textAlign: c.right ? "right" : "left", whiteSpace: c.wrap ? "normal" : "nowrap" }}>
                {c.render ? c.render(row[c.key], row) : row[c.key]}
              </td>
            ))}
          </tr>
        ))}
        {rows.length === 0 && (
          <tr><td colSpan={cols.length} style={{ padding: 40, textAlign: "center", color: C.textLow, fontSize: 13 }}>Sin registros</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

// ─── CUSTOM TOOLTIP RECHARTS ──────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
      {label && <div style={{ color: C.textMid, fontSize: 11, marginBottom: 6 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C.gold, fontWeight: 700, fontSize: 13 }}>
          {typeof p.value === "number" && p.value > 1000 ? fmt(p.value) : p.value}
        </div>
      ))}
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ presupuestos, proyectos, gastos, certificaciones }) => {
  const totalPresup = presupuestos.reduce((a, p) => a + p.total, 0);
  const aprobados = presupuestos.filter(p => p.estado === "APROBADO").length;
  const enEjecucion = proyectos.filter(p => p.estado === "EN_EJECUCION").length;
  const pendienteCobro = certificaciones.filter(c => c.estado !== "COBRADA").reduce((a, c) => a + c.importeFacturar, 0);
  const pendientePago = gastos.filter(g => g.estado === "PENDIENTE").reduce((a, g) => a + g.importe, 0);
  const totalCobrado = certificaciones.filter(c => c.estado === "COBRADA").reduce((a, c) => a + c.importeFacturar, 0);
  const totalPagado = gastos.filter(g => g.estado === "PAGADO").reduce((a, g) => a + g.importe, 0);
  const cashflow = totalCobrado - totalPagado;

  // Datos gráfico barras — evolución mensual simulada
  const barData = [
    { mes: "Nov", cobrado: 42000, gastado: 31000 },
    { mes: "Dic", cobrado: 58000, gastado: 44000 },
    { mes: "Ene", cobrado: 72000, gastado: 55000 },
    { mes: "Feb", cobrado: 90250, gastado: 48700 },
    { mes: "Mar", cobrado: 137750, gastado: 67650 },
    { mes: "Abr", cobrado: 0, gastado: 27150 },
  ];

  // Datos gráfico pie — tipos de gasto
  const pieData = [
    { name: "Material", value: gastos.filter(g => g.tipo === "MATERIAL").reduce((a, g) => a + g.importe, 0) },
    { name: "Mano obra", value: gastos.filter(g => g.tipo === "MANO_OBRA").reduce((a, g) => a + g.importe, 0) },
    { name: "Subcontrata", value: gastos.filter(g => g.tipo === "SUBCONTRATA").reduce((a, g) => a + g.importe, 0) },
  ];
  const PIE_COLORS = [C.gold, C.blue, C.green];

  // Datos pipeline CRM
  const pipelineData = [
    { name: "Cartera total", value: totalPresup },
    { name: "En negociación", value: presupuestos.filter(p => p.estado === "NEGOCIACION" || p.estado === "ENVIADO").reduce((a, p) => a + p.total, 0) },
    { name: "Aprobado", value: presupuestos.filter(p => p.estado === "APROBADO").reduce((a, p) => a + p.total, 0) },
    { name: "Cobrado", value: totalCobrado },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 800 }}>Panel de control</h2>
        <p style={{ margin: "4px 0 0", color: C.textMid, fontSize: 13 }}>Resumen global · {new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <KPI icon="📋" label="Presupuestos" value={presupuestos.length} sub={`${aprobados} aprobados`} />
        <KPI icon="🏗️" label="Obras activas" value={enEjecucion} color={C.blue} />
        <KPI icon="💰" label="Pend. cobrar" value={fmt(pendienteCobro)} color={C.yellow} />
        <KPI icon="📊" label="Cash flow" value={fmt(cashflow)} color={cashflow >= 0 ? C.green : C.red} />
      </div>

      {/* Gráfico barras — Cobros vs Gastos */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 16px", marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 800, color: C.text, fontSize: 15 }}>Cobros vs Gastos</div>
          <div style={{ fontSize: 11, color: C.textMid }}>Últimos 6 meses</div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} barCategoryGap="30%" barGap={4}>
            <XAxis dataKey="mes" tick={{ fill: C.textMid, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,.04)" }} />
            <Legend wrapperStyle={{ fontSize: 11, color: C.textMid }} />
            <Bar dataKey="cobrado" name="Cobrado" fill={C.gold} radius={[4, 4, 0, 0]} />
            <Bar dataKey="gastado" name="Gastado" fill={C.blue} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Gráfico pie — Tipos de gasto */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 16px" }}>
          <div style={{ fontWeight: 800, color: C.text, fontSize: 14, marginBottom: 4 }}>Desglose gastos</div>
          <div style={{ fontSize: 11, color: C.textMid, marginBottom: 12 }}>Por categoría</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={36} outerRadius={58} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
            {pieData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i], flexShrink: 0 }} />
                <span style={{ color: C.textMid, flex: 1 }}>{d.name}</span>
                <span style={{ color: C.text, fontWeight: 700 }}>{fmt(d.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline comercial */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 16px" }}>
          <div style={{ fontWeight: 800, color: C.text, fontSize: 14, marginBottom: 4 }}>Pipeline</div>
          <div style={{ fontSize: 11, color: C.textMid, marginBottom: 16 }}>Embudo comercial</div>
          {pipelineData.map((d, i) => {
            const pct = Math.round((d.value / pipelineData[0].value) * 100);
            const colors = [C.textMid, C.blue, C.gold, C.green];
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.textMid }}>{d.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: colors[i] }}>{pct}%</span>
                </div>
                <div style={{ background: C.border, borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: colors[i], borderRadius: 4, transition: "width .6s ease" }} />
                </div>
                <div style={{ fontSize: 10, color: C.textLow, marginTop: 2 }}>{fmt(d.value)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Obras activas */}
      {proyectos.filter(p => p.estado === "EN_EJECUCION").map(p => {
        const avance = Math.round((p.costeReal / p.costeEstimado) * 100);
        const margen = p.presupuestoAprobado - p.costeReal;
        return (
          <div key={p.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 8 }}>
              <div>
                <div style={{ fontWeight: 800, color: C.text, fontSize: 15 }}>{p.nombre}</div>
                <div style={{ fontSize: 12, color: C.textMid, marginTop: 2 }}>{p.codigo} · {p.jefeObra}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: C.textLow }}>Margen actual</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: margen > 0 ? C.green : C.red }}>{fmt(margen)}</div>
              </div>
            </div>
            <div style={{ background: C.border, borderRadius: 6, height: 10, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ height: "100%", width: `${Math.min(avance, 100)}%`, background: avance > 90 ? C.red : avance > 70 ? C.yellow : C.gold, borderRadius: 6, transition: "width .6s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textMid }}>
              <span>{avance}% coste consumido</span>
              <span>Fin: {p.fechaFinPrevista}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── PRESUPUESTOS ─────────────────────────────────────────────────────────────
const Presupuestos = ({ presupuestos, setPresupuestos, onAprobar }) => {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ clienteId: 1, descripcion: "", margen: 20, partidas: [{ cap: "", ud: "m²", med: "", pu: "" }] });

  const addPartida = () => setForm(f => ({ ...f, partidas: [...f.partidas, { cap: "", ud: "m²", med: "", pu: "" }] }));
  const updPartida = (i, key, val) => setForm(f => { const ps = [...f.partidas]; ps[i] = { ...ps[i], [key]: val }; return { ...f, partidas: ps }; });
  const costeBase = form.partidas.reduce((a, p) => a + (parseFloat(p.med) || 0) * (parseFloat(p.pu) || 0), 0);
  const totalConMargen = costeBase * (1 + (parseFloat(form.margen) || 0) / 100);

  const guardar = () => {
    const nuevo = {
      id: Date.now(), codigo: `PRE-2024-00${presupuestos.length + 4}`,
      clienteId: parseInt(form.clienteId), descripcion: form.descripcion,
      version: 1, estado: "BORRADOR", total: totalConMargen, margen: parseFloat(form.margen),
      fechaCreacion: new Date().toISOString().slice(0, 10),
      fechaValidez: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      partidas: form.partidas.map(p => ({ cap: p.cap, ud: p.ud, med: parseFloat(p.med), pu: parseFloat(p.pu), total: parseFloat(p.med) * parseFloat(p.pu) })),
    };
    setPresupuestos(prev => [...prev, nuevo]);
    setModal(null);
    setForm({ clienteId: 1, descripcion: "", margen: 20, partidas: [{ cap: "", ud: "m²", med: "", pu: "" }] });
  };

  const cambiarEstado = (id, estado) => setPresupuestos(prev => prev.map(p => p.id === id ? { ...p, estado } : p));

  const enviarWhatsApp = (pres) => {
    const cli = CLIENTES.find(c => c.id === pres.clienteId);
    const partidas = (pres.partidas || []).map(p => `  • ${p.cap}: ${fmt(p.total)}`).join("\n");
    const msg = encodeURIComponent(
      `*PRESUPUESTO BAÜEN* 🏗️\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📄 *${pres.codigo}*\n` +
      `👤 Cliente: ${cli?.nombre}\n` +
      `📐 Obra: ${pres.descripcion}\n` +
      `📅 Válido hasta: ${pres.fechaValidez}\n\n` +
      `*PARTIDAS:*\n${partidas}\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 *TOTAL: ${fmt(pres.total)}*\n` +
      `📊 Margen aplicado: ${pres.margen}%\n\n` +
      `Para confirmar o solicitar cambios, responda a este mensaje.\n` +
      `_BAÜEN Construcción · www.bauen.es_`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 800 }}>Presupuestos</h2>
          <p style={{ margin: "4px 0 0", color: C.textMid, fontSize: 12 }}>{presupuestos.length} presupuestos · {fmt(presupuestos.reduce((a, p) => a + p.total, 0))} en cartera</p>
        </div>
        <Btn onClick={() => setModal("new")}>+ Nuevo</Btn>
      </div>

      {presupuestos.map(p => {
        const cli = CLIENTES.find(c => c.id === p.clienteId);
        return (
          <ItemCard key={p.id} onClick={() => setModal(p)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 800, color: C.gold, fontSize: 13 }}>{p.codigo} <span style={{ color: C.textLow, fontWeight: 400 }}>v{p.version}</span></div>
                <div style={{ color: C.text, fontWeight: 600, fontSize: 14, marginTop: 2 }}>{p.descripcion}</div>
                <div style={{ color: C.textMid, fontSize: 12, marginTop: 2 }}>{cli?.nombre}</div>
              </div>
              <Badge estado={p.estado} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{fmt(p.total)}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn small variant="whatsapp" onClick={(e) => { e.stopPropagation(); enviarWhatsApp(p); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </Btn>
                {p.estado !== "APROBADO" && p.estado !== "RECHAZADO" && (
                  <Btn small variant="success" onClick={(e) => { e.stopPropagation(); cambiarEstado(p.id, "APROBADO"); onAprobar(p); }}>✓ Aprobar</Btn>
                )}
              </div>
            </div>
          </ItemCard>
        );
      })}

      {/* MODAL NUEVO PRESUPUESTO */}
      {modal === "new" && (
        <Modal title="Nuevo presupuesto" onClose={() => setModal(null)} wide>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <Field label="Cliente" half>
              <Select value={form.clienteId} onChange={v => setForm(f => ({ ...f, clienteId: v }))}
                options={CLIENTES.map(c => ({ value: c.id, label: c.nombre }))} />
            </Field>
            <Field label="Margen %" half>
              <Input type="number" value={form.margen} onChange={v => setForm(f => ({ ...f, margen: v }))} />
            </Field>
          </div>
          <Field label="Descripción de la obra">
            <Input value={form.descripcion} onChange={v => setForm(f => ({ ...f, descripcion: v }))} placeholder="Ej: Nave industrial 1.200 m²" />
          </Field>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: 0.8 }}>Partidas</label>
              <Btn small variant="ghost" onClick={addPartida}>+ Añadir partida</Btn>
            </div>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead style={{ background: C.panel }}>
                  <tr>{["Descripción", "Ud.", "Med.", "€/Ud.", "Total"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.textMid, fontWeight: 700, fontSize: 10, letterSpacing: 0.5 }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {form.partidas.map((p, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: "6px 8px" }}><input value={p.cap} onChange={e => updPartida(i, "cap", e.target.value)} style={{ width: "100%", border: "none", background: "transparent", fontSize: 13, color: C.text, outline: "none" }} placeholder="Descripción..." /></td>
                      <td style={{ padding: "6px 6px", width: 48 }}><input value={p.ud} onChange={e => updPartida(i, "ud", e.target.value)} style={{ width: 44, border: "none", background: "transparent", fontSize: 13, color: C.text, outline: "none" }} /></td>
                      <td style={{ padding: "6px 6px", width: 72 }}><input type="number" value={p.med} onChange={e => updPartida(i, "med", e.target.value)} style={{ width: 66, border: "none", background: "transparent", fontSize: 13, color: C.text, outline: "none", textAlign: "right" }} /></td>
                      <td style={{ padding: "6px 6px", width: 72 }}><input type="number" value={p.pu} onChange={e => updPartida(i, "pu", e.target.value)} style={{ width: 66, border: "none", background: "transparent", fontSize: 13, color: C.text, outline: "none", textAlign: "right" }} /></td>
                      <td style={{ padding: "6px 10px", width: 90, textAlign: "right", fontWeight: 700, color: C.gold }}>{fmt((parseFloat(p.med) || 0) * (parseFloat(p.pu) || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ background: C.panel, borderRadius: 10, padding: 16, marginBottom: 20, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: C.textMid, fontSize: 13, marginBottom: 6 }}>
              <span>Coste base</span><span>{fmt(costeBase)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: C.textMid, fontSize: 13, marginBottom: 10 }}>
              <span>Margen ({form.margen}%)</span><span>{fmt(totalConMargen - costeBase)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: C.text, fontSize: 20, fontWeight: 800, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
              <span>TOTAL</span><span style={{ color: C.gold }}>{fmt(totalConMargen)}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setModal(null)} full>Cancelar</Btn>
            <Btn onClick={guardar} full>Guardar presupuesto</Btn>
          </div>
        </Modal>
      )}

      {/* MODAL VER PRESUPUESTO */}
      {modal && modal !== "new" && (
        <Modal title={`${modal.codigo}`} onClose={() => setModal(null)} wide>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <div style={{ flex: 1, background: C.panel, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 10, color: C.textMid, fontWeight: 700, marginBottom: 4 }}>CLIENTE</div>
              <div style={{ fontWeight: 700, color: C.text }}>{CLIENTES.find(c => c.id === modal.clienteId)?.nombre}</div>
            </div>
            <div style={{ background: C.panel, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 10, color: C.textMid, fontWeight: 700, marginBottom: 4 }}>TOTAL</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: C.gold }}>{fmt(modal.total)}</div>
            </div>
          </div>

          <Table cols={[
            { key: "cap", label: "Partida", wrap: true },
            { key: "ud", label: "Ud." },
            { key: "med", label: "Med.", right: true, render: v => fmtN(v) },
            { key: "pu", label: "P.U.", right: true, render: v => fmt(v) },
            { key: "total", label: "Total", right: true, render: v => <b style={{ color: C.gold }}>{fmt(v)}</b> },
          ]} rows={modal.partidas || []} />

          <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn variant="whatsapp" onClick={() => enviarWhatsApp(modal)} full>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Enviar por WhatsApp
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── CRM ──────────────────────────────────────────────────────────────────────
const CRM = ({ crm, setCRM, presupuestos }) => {
  const [modal, setModal] = useState(null);
  const [newInt, setNewInt] = useState({ tipo: "LLAMADA", resumen: "" });

  const tipoIcon = { LLAMADA: "📞", REUNION: "🤝", EMAIL: "📧", VISITA_OBRA: "🔍" };

  const addInteraccion = (crmId) => {
    setCRM(prev => prev.map(c => c.id === crmId
      ? { ...c, interacciones: [...c.interacciones, { tipo: newInt.tipo, fecha: new Date().toISOString().slice(0, 10), resumen: newInt.resumen }] }
      : c
    ));
    setModal(prev => prev ? { ...prev, interacciones: [...prev.interacciones, { tipo: newInt.tipo, fecha: new Date().toISOString().slice(0, 10), resumen: newInt.resumen }] } : prev);
    setNewInt({ tipo: "LLAMADA", resumen: "" });
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 800 }}>Seguimiento comercial</h2>
        <p style={{ margin: "4px 0 0", color: C.textMid, fontSize: 12 }}>Pipeline de oportunidades</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {["EN_NEGOCIACION", "PENDIENTE_DECISION", "GANADO", "PERDIDO"].map(est => {
          const cfg = ESTADO_CFG[est];
          return (
            <div key={est} style={{ flex: "0 0 auto", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", minWidth: 120, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: cfg.color }}>{crm.filter(c => c.estado === est).length}</div>
              <div style={{ fontSize: 10, color: C.textMid, fontWeight: 700, marginTop: 4, textTransform: "uppercase" }}>{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {crm.map(item => {
        const cli = CLIENTES.find(c => c.id === item.clienteId);
        const pres = presupuestos.find(p => p.id === item.presupuestoId);
        return (
          <ItemCard key={item.id} onClick={() => setModal(item)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 800, color: C.text, fontSize: 14 }}>{cli?.nombre}</div>
                <div style={{ color: C.textMid, fontSize: 12, marginTop: 2 }}>{pres?.descripcion}</div>
              </div>
              <Badge estado={item.estado} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, background: C.border, borderRadius: 4, height: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${item.probabilidad}%`, background: item.probabilidad > 70 ? C.green : item.probabilidad > 40 ? C.yellow : C.red, borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: C.text, width: 32, textAlign: "right" }}>{item.probabilidad}%</span>
            </div>
            <div style={{ fontSize: 12, color: C.textMid }}>
              📅 <span style={{ color: C.textLow }}>{item.proximaAccion}</span> · {item.fechaAccion}
            </div>
            <div style={{ fontSize: 11, color: C.textLow, marginTop: 4 }}>👤 {item.comercial} · {item.interacciones.length} interacciones</div>
          </ItemCard>
        );
      })}

      {modal && (
        <Modal title={CLIENTES.find(c => c.id === modal.clienteId)?.nombre} onClose={() => setModal(null)}>
          <h4 style={{ color: C.textMid, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 }}>Historial</h4>
          {modal.interacciones.map((int, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, padding: 12, background: C.panel, borderRadius: 10, border: `1px solid ${C.border}` }}>
              <div style={{ width: 36, height: 36, background: C.goldBg, border: `1px solid ${C.goldD}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                {tipoIcon[int.tipo] || "📝"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12, color: C.gold }}>{int.tipo} · {int.fecha}</div>
                <div style={{ fontSize: 13, color: C.textMid, marginTop: 2 }}>{int.resumen}</div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Nueva interacción</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              {["LLAMADA", "REUNION", "EMAIL", "VISITA_OBRA"].map(t => (
                <button key={t} onClick={() => setNewInt(n => ({ ...n, tipo: t }))}
                  style={{ flex: 1, padding: "8px 4px", border: `1px solid ${newInt.tipo === t ? C.gold : C.border}`, borderRadius: 8, background: newInt.tipo === t ? C.goldBg : C.panel, color: newInt.tipo === t ? C.gold : C.textMid, fontSize: 10, fontWeight: 700, cursor: "pointer", textAlign: "center" }}>
                  {tipoIcon[t]}<br />{t.replace("_", " ")}
                </button>
              ))}
            </div>
            <Input value={newInt.resumen} onChange={v => setNewInt(n => ({ ...n, resumen: v }))} placeholder="¿Qué ocurrió en esta interacción?" />
            <div style={{ marginTop: 12 }}>
              <Btn onClick={() => addInteraccion(modal.id)} full>Registrar interacción</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── PROYECTOS ────────────────────────────────────────────────────────────────
const Proyectos = ({ proyectos }) => {
  const [sel, setSel] = useState(null);
  const p = sel ? proyectos.find(p => p.id === sel) : null;

  if (p) {
    const margen = p.presupuestoAprobado - p.costeReal;
    const avance = Math.round((p.costeReal / p.costeEstimado) * 100);
    const lineData = [
      { label: "Feb", coste: 48000, cert: 95000 },
      { label: "Mar", coste: 162500, cert: 240000 },
      { label: "Abr (prev)", coste: 210500, cert: 240000 },
    ];
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setSel(null)} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px", color: C.textMid, fontSize: 13, cursor: "pointer" }}>← Volver</button>
          <div>
            <h2 style={{ margin: 0, color: C.text, fontSize: 18, fontWeight: 800 }}>{p.nombre}</h2>
            <div style={{ fontSize: 12, color: C.textMid }}>{p.codigo}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <KPI icon="✅" label="Presup. aprobado" value={fmt(p.presupuestoAprobado)} />
          <KPI icon="📉" label="Coste real" value={fmt(p.costeReal)} color={C.blue} />
          <KPI icon="💹" label="Margen" value={fmt(margen)} color={margen > 0 ? C.green : C.red} />
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>Consumo presupuestario</span>
            <span style={{ fontWeight: 800, color: avance > 90 ? C.red : C.gold }}>{avance}%</span>
          </div>
          <div style={{ background: C.border, borderRadius: 6, height: 12, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(avance, 100)}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.goldL})`, borderRadius: 6 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textMid, marginTop: 6 }}>
            <span>Coste real: {fmt(p.costeReal)}</span>
            <span>Estimado: {fmt(p.costeEstimado)}</span>
          </div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
          <div style={{ fontWeight: 800, color: C.text, fontSize: 14, marginBottom: 4 }}>Evolución coste vs certificación</div>
          <div style={{ fontSize: 11, color: C.textMid, marginBottom: 12 }}>Acumulado mensual</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={lineData}>
              <XAxis dataKey="label" tick={{ fill: C.textMid, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.textMid }} />
              <Line type="monotone" dataKey="coste" name="Coste" stroke={C.red} strokeWidth={2} dot={{ fill: C.red, r: 4 }} />
              <Line type="monotone" dataKey="cert" name="Certificado" stroke={C.gold} strokeWidth={2} dot={{ fill: C.gold, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[["Jefe de obra", p.jefeObra], ["Inicio", p.fechaInicio], ["Fin previsto", p.fechaFinPrevista], ["Estado", <Badge estado={p.estado} />]].map(([k, v]) => (
            <div key={k} style={{ background: C.card, borderRadius: 10, padding: 14, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, color: C.textMid, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</div>
              <div style={{ fontWeight: 700, color: C.text, marginTop: 6 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 800 }}>Proyectos</h2>
        <p style={{ margin: "4px 0 0", color: C.textMid, fontSize: 12 }}>Generados desde presupuestos aprobados</p>
      </div>
      {proyectos.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: C.textLow, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏗️</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.textMid }}>Sin proyectos abiertos</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Aprueba un presupuesto para crear el primer proyecto</div>
        </div>
      ) : proyectos.map(p => {
        const avance = Math.round((p.costeReal / p.costeEstimado) * 100);
        const margen = p.presupuestoAprobado - p.costeReal;
        return (
          <ItemCard key={p.id} onClick={() => setSel(p.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 800, color: C.gold, fontSize: 12 }}>{p.codigo}</div>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 15, marginTop: 2 }}>{p.nombre}</div>
                <div style={{ fontSize: 12, color: C.textMid, marginTop: 2 }}>👷 {p.jefeObra}</div>
              </div>
              <Badge estado={p.estado} />
            </div>
            <div style={{ background: C.border, borderRadius: 4, height: 8, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ height: "100%", width: `${Math.min(avance, 100)}%`, background: avance > 90 ? C.red : C.gold, borderRadius: 4 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: C.textMid }}>{avance}% coste consumido</span>
              <span style={{ color: margen > 0 ? C.green : C.red, fontWeight: 700 }}>Margen: {fmt(margen)}</span>
            </div>
          </ItemCard>
        );
      })}
    </div>
  );
};

// ─── GASTOS ───────────────────────────────────────────────────────────────────
const Gastos = ({ gastos, setGastos, proyectos }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ proyectoId: proyectos[0]?.id || "", tipo: "MATERIAL", concepto: "", importe: "", proveedor: "", fecha: new Date().toISOString().slice(0, 10) });

  const guardar = () => {
    setGastos(prev => [...prev, { id: Date.now(), ...form, proyectoId: parseInt(form.proyectoId), importe: parseFloat(form.importe), estado: "PENDIENTE" }]);
    setModal(false);
  };

  const pendiente = gastos.filter(g => g.estado === "PENDIENTE").reduce((a, g) => a + g.importe, 0);
  const pagado = gastos.filter(g => g.estado === "PAGADO").reduce((a, g) => a + g.importe, 0);
  const marcarPagado = (id) => setGastos(prev => prev.map(g => g.id === id ? { ...g, estado: "PAGADO" } : g));

  const tipoIcon = { MATERIAL: "🧱", MANO_OBRA: "👷", SUBCONTRATA: "🔧", GASTO_GENERAL: "📋" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 800 }}>Gastos y compras</h2>
          <p style={{ margin: "4px 0 0", color: C.textMid, fontSize: 12 }}>Materiales · Mano de obra · Subcontratas</p>
        </div>
        <Btn onClick={() => setModal(true)}>+ Registrar</Btn>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <KPI icon="⏳" label="Pendiente pagar" value={fmt(pendiente)} color={C.yellow} />
        <KPI icon="✅" label="Total pagado" value={fmt(pagado)} color={C.green} />
      </div>

      {gastos.map(g => {
        const proj = proyectos.find(p => p.id === g.proyectoId);
        return (
          <ItemCard key={g.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ fontSize: 22 }}>{tipoIcon[g.tipo] || "📦"}</div>
                <div>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{g.concepto}</div>
                  <div style={{ fontSize: 12, color: C.textMid, marginTop: 2 }}>{g.proveedor} · {proj?.codigo}</div>
                  <div style={{ fontSize: 11, color: C.textLow, marginTop: 2 }}>{g.tipo.replace("_", " ")} · {g.fecha}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{fmt(g.importe)}</div>
                <Badge estado={g.estado} />
              </div>
            </div>
            {g.estado === "PENDIENTE" && (
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 4 }}>
                <Btn small variant="success" onClick={() => marcarPagado(g.id)} full>✓ Marcar como pagado</Btn>
              </div>
            )}
          </ItemCard>
        );
      })}

      {modal && (
        <Modal title="Registrar gasto / compra" onClose={() => setModal(false)}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <Field label="Proyecto" half>
              <Select value={form.proyectoId} onChange={v => setForm(f => ({ ...f, proyectoId: v }))}
                options={proyectos.map(p => ({ value: p.id, label: p.nombre }))} />
            </Field>
            <Field label="Tipo" half>
              <Select value={form.tipo} onChange={v => setForm(f => ({ ...f, tipo: v }))}
                options={["MATERIAL", "MANO_OBRA", "SUBCONTRATA", "GASTO_GENERAL"].map(t => ({ value: t, label: t.replace("_", " ") }))} />
            </Field>
          </div>
          <Field label="Concepto"><Input value={form.concepto} onChange={v => setForm(f => ({ ...f, concepto: v }))} placeholder="Descripción..." /></Field>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <Field label="Proveedor" half><Input value={form.proveedor} onChange={v => setForm(f => ({ ...f, proveedor: v }))} /></Field>
            <Field label="Importe (€)" half><Input type="number" value={form.importe} onChange={v => setForm(f => ({ ...f, importe: v }))} /></Field>
          </div>
          <Field label="Fecha"><Input type="date" value={form.fecha} onChange={v => setForm(f => ({ ...f, fecha: v }))} /></Field>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setModal(false)} full>Cancelar</Btn>
            <Btn onClick={guardar} full>Registrar gasto</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── CERTIFICACIONES ──────────────────────────────────────────────────────────
const Certificaciones = ({ certificaciones, setCertificaciones, proyectos }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ proyectoId: proyectos[0]?.id || "", periodo: "", total: "", retencion: 5 });

  const guardar = () => {
    const total = parseFloat(form.total);
    const retencion = parseFloat(form.retencion);
    const num = certificaciones.filter(c => c.proyectoId === parseInt(form.proyectoId)).length + 1;
    setCertificaciones(prev => [...prev, { id: Date.now(), proyectoId: parseInt(form.proyectoId), numero: num, periodo: form.periodo, total, retencion, importeFacturar: total * (1 - retencion / 100), estado: "BORRADOR", fechaCobro: null }]);
    setModal(false);
  };

  const cobrar = (id) => setCertificaciones(prev => prev.map(c => c.id === id ? { ...c, estado: "COBRADA", fechaCobro: new Date().toISOString().slice(0, 10) } : c));
  const facturar = (id) => setCertificaciones(prev => prev.map(c => c.id === id ? { ...c, estado: "FACTURADA" } : c));

  const totalCobrado = certificaciones.filter(c => c.estado === "COBRADA").reduce((a, c) => a + c.importeFacturar, 0);
  const pendienteCobro = certificaciones.filter(c => c.estado !== "COBRADA").reduce((a, c) => a + c.importeFacturar, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 800 }}>Certificaciones</h2>
          <p style={{ margin: "4px 0 0", color: C.textMid, fontSize: 12 }}>Cobros por obra ejecutada</p>
        </div>
        <Btn onClick={() => setModal(true)}>+ Nueva</Btn>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <KPI icon="🏦" label="Total cobrado" value={fmt(totalCobrado)} color={C.green} />
        <KPI icon="🕐" label="Pendiente cobrar" value={fmt(pendienteCobro)} color={C.yellow} />
      </div>

      {certificaciones.map(cert => {
        const proj = proyectos.find(p => p.id === cert.proyectoId);
        return (
          <ItemCard key={cert.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 800, color: C.gold, fontSize: 12 }}>{proj?.codigo} · Certif. {cert.numero}</div>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 14, marginTop: 2 }}>{cert.periodo}</div>
                <div style={{ color: C.textMid, fontSize: 12, marginTop: 2 }}>Retención {cert.retencion}% · Obra: {fmt(cert.total)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: C.gold }}>{fmt(cert.importeFacturar)}</div>
                <Badge estado={cert.estado} />
              </div>
            </div>
            {(cert.estado === "BORRADOR" || cert.estado === "FACTURADA") && (
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 4 }}>
                {cert.estado === "BORRADOR" && <Btn small variant="secondary" onClick={() => facturar(cert.id)} full>📄 Marcar como facturada</Btn>}
                {cert.estado === "FACTURADA" && <Btn small variant="success" onClick={() => cobrar(cert.id)} full>💰 Confirmar cobro</Btn>}
              </div>
            )}
            {cert.estado === "COBRADA" && (
              <div style={{ fontSize: 11, color: C.green, marginTop: 6 }}>✓ Cobrada el {cert.fechaCobro}</div>
            )}
          </ItemCard>
        );
      })}

      {modal && (
        <Modal title="Nueva certificación" onClose={() => setModal(false)}>
          <Field label="Proyecto">
            <Select value={form.proyectoId} onChange={v => setForm(f => ({ ...f, proyectoId: v }))}
              options={proyectos.map(p => ({ value: p.id, label: p.nombre }))} />
          </Field>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <Field label="Período" half><Input value={form.periodo} onChange={v => setForm(f => ({ ...f, periodo: v }))} placeholder="Ej: Abril 2024" /></Field>
            <Field label="Retención %" half><Input type="number" value={form.retencion} onChange={v => setForm(f => ({ ...f, retencion: v }))} /></Field>
          </div>
          <Field label="Importe obra ejecutada (€)"><Input type="number" value={form.total} onChange={v => setForm(f => ({ ...f, total: v }))} /></Field>
          {form.total && (
            <div style={{ background: C.panel, borderRadius: 10, padding: 16, marginBottom: 16, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.textMid, fontSize: 13, marginBottom: 6 }}>
                <span>Retención</span><span>-{fmt(parseFloat(form.total) * form.retencion / 100)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                <span style={{ color: C.text }}>A facturar</span>
                <span style={{ color: C.gold }}>{fmt(parseFloat(form.total) * (1 - form.retencion / 100))}</span>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="secondary" onClick={() => setModal(false)} full>Cancelar</Btn>
            <Btn onClick={guardar} full>Crear certificación</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── SALDOS ───────────────────────────────────────────────────────────────────
const Saldos = ({ proyectos, gastos, certificaciones }) => {
  const calcSaldo = (p) => {
    const cobrado = certificaciones.filter(c => c.proyectoId === p.id && c.estado === "COBRADA").reduce((a, c) => a + c.importeFacturar, 0);
    const pagado = gastos.filter(g => g.proyectoId === p.id && g.estado === "PAGADO").reduce((a, g) => a + g.importe, 0);
    const pendCobro = certificaciones.filter(c => c.proyectoId === p.id && c.estado !== "COBRADA").reduce((a, c) => a + c.importeFacturar, 0);
    const pendPago = gastos.filter(g => g.proyectoId === p.id && g.estado === "PENDIENTE").reduce((a, g) => a + g.importe, 0);
    return { cobrado, pagado, pendCobro, pendPago, cashflow: cobrado - pagado };
  };

  const gCobrado = proyectos.reduce((a, p) => a + calcSaldo(p).cobrado, 0);
  const gPagado = proyectos.reduce((a, p) => a + calcSaldo(p).pagado, 0);
  const cashflow = gCobrado - gPagado;

  const barData = proyectos.map(p => {
    const s = calcSaldo(p);
    return { name: p.codigo, cobrado: s.cobrado, pagado: s.pagado };
  });

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 800 }}>Saldos y tesorería</h2>
        <p style={{ margin: "4px 0 0", color: C.textMid, fontSize: 12 }}>Posición financiera por proyecto</p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <KPI icon="💰" label="Total cobrado" value={fmt(gCobrado)} color={C.green} />
        <KPI icon="📤" label="Total pagado" value={fmt(gPagado)} color={C.yellow} />
        <KPI icon="🏦" label="Cash flow" value={fmt(cashflow)} color={cashflow >= 0 ? C.green : C.red} sub={cashflow >= 0 ? "Posición positiva" : "⚠ Tensión de caja"} />
      </div>

      {barData.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
          <div style={{ fontWeight: 800, color: C.text, fontSize: 14, marginBottom: 4 }}>Cobrado vs Pagado por obra</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={barData} barCategoryGap="30%">
              <XAxis dataKey="name" tick={{ fill: C.textMid, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,.04)" }} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.textMid }} />
              <Bar dataKey="cobrado" name="Cobrado" fill={C.gold} radius={[4, 4, 0, 0]} />
              <Bar dataKey="pagado" name="Pagado" fill={C.blue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {proyectos.map(p => {
        const s = calcSaldo(p);
        return (
          <div key={p.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 800, color: C.text, fontSize: 15 }}>{p.nombre}</div>
                <div style={{ fontSize: 12, color: C.textMid, marginTop: 2 }}>{p.codigo}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: C.textMid }}>CASH FLOW</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.cashflow >= 0 ? C.green : C.red }}>{fmt(s.cashflow)}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["Cobrado", s.cobrado, C.green], ["Pend. cobrar", s.pendCobro, C.yellow], ["Pagado", s.pagado, C.blue], ["Pend. pagar", s.pendPago, C.red]].map(([label, val, color]) => (
                <div key={label} style={{ background: C.panel, borderRadius: 8, padding: 12, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 10, color: C.textMid, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color }}>{fmt(val)}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: 12, background: s.cashflow >= 0 ? C.greenBg : C.redBg, borderRadius: 8, border: `1px solid ${s.cashflow >= 0 ? C.green : C.red}33` }}>
              <span style={{ fontWeight: 700, color: s.cashflow >= 0 ? C.green : C.red, fontSize: 13 }}>
                {s.cashflow >= 0 ? "✓ Caja positiva" : "⚠ Tensión de caja"} · Presupuesto: {fmt(p.presupuestoAprobado)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
const ALL_NAV = [
  { id: "dashboard",    icon: "◈", label: "Panel" },
  { id: "presupuestos", icon: "◻", label: "Presupuestos" },
  { id: "crm",          icon: "◇", label: "Comercial" },
  { id: "proyectos",    icon: "▣", label: "Proyectos" },
  { id: "gastos",       icon: "◈", label: "Gastos" },
  { id: "cobros",       icon: "◆", label: "Cobros" },
  { id: "saldos",       icon: "▲", label: "Saldos" },
  { id: "usuarios",     icon: "●", label: "Usuarios" },
];

export default function App() {
  // ── Autenticación ──
  const [currentUser, setCurrentUser] = useState(null);
  const [usuarios, setUsuarios] = useState(initUsuarios);

  // ── Estado app ──
  const [tab, setTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [presupuestos, setPresupuestos] = useState(initPresupuestos);
  const [proyectos, setProyectos] = useState(initProyectos);
  const [crm, setCRM] = useState(initCRM);
  const [gastos, setGastos] = useState(initGastos);
  const [certificaciones, setCertificaciones] = useState(initCertificaciones);
  const [toast, setToast] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const check = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleLogin = (user) => {
    setCurrentUser(user);
    // Navegar al primer tab permitido del rol
    const firstTab = ROLES_CFG[user.rol]?.tabs[0] || "dashboard";
    setTab(firstTab);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMenuOpen(false);
    setShowProfile(false);
  };

  const canAccess = (tabId) => {
    if (!currentUser) return false;
    return ROLES_CFG[currentUser.rol]?.tabs.includes(tabId) || false;
  };

  // Tabs disponibles para este usuario
  const NAV = ALL_NAV.filter(n => canAccess(n.id));

  const handleAprobar = (presupuesto) => {
    if (!canAccess("proyectos")) return;
    const yaExiste = proyectos.find(p => p.presupuestoId === presupuesto.id);
    if (yaExiste) return;
    const nuevo = {
      id: Date.now(), codigo: `OBR-2024-00${proyectos.length + 2}`,
      presupuestoId: presupuesto.id, clienteId: presupuesto.clienteId,
      nombre: presupuesto.descripcion, estado: "PLANIFICACION",
      presupuestoAprobado: presupuesto.total,
      costeEstimado: Math.round(presupuesto.total / (1 + presupuesto.margen / 100)),
      costeReal: 0,
      fechaInicio: new Date().toISOString().slice(0, 10), fechaFinPrevista: "",
      jefeObra: "Por asignar", certificadoAcumulado: 0, cobradoAcumulado: 0,
    };
    setProyectos(prev => [...prev, nuevo]);
    setCRM(prev => prev.map(c => c.presupuestoId === presupuesto.id ? { ...c, estado: "GANADO", probabilidad: 100 } : c));
    showToast(`✓ Proyecto ${nuevo.codigo} creado`);
    setTimeout(() => { setTab("proyectos"); setMenuOpen(false); }, 1200);
  };

  const navigate = (id) => {
    if (!canAccess(id)) return;
    setTab(id);
    setMenuOpen(false);
  };

  // ── Si no hay sesión → pantalla login ──
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} usuarios={usuarios} />;
  }

  const rolCfg = ROLES_CFG[currentUser.rol];
  const currentLabel = ALL_NAV.find(n => n.id === tab)?.label || "";

  // Sidebar content reutilizable
  const SidebarContent = () => (
    <>
      <div style={{ padding: "22px 18px 18px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, background: `linear-gradient(135deg, ${C.goldL}, ${C.goldD})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, color: "#111" }}>B</div>
          <div>
            <div style={{ color: C.text, fontWeight: 900, fontSize: 16, letterSpacing: 2 }}>BAÜEN</div>
            <div style={{ color: C.textLow, fontSize: 10, letterSpacing: 1 }}>CONSTRUCCIÓN</div>
          </div>
        </div>
      </div>

      {/* Usuario actual */}
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }} onClick={() => { setShowProfile(p => !p); }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${rolCfg.color}22`, border: `2px solid ${rolCfg.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: rolCfg.color, flexShrink: 0 }}>
            {currentUser.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser.nombre}</div>
            <div style={{ fontSize: 10, color: rolCfg.color, fontWeight: 700, letterSpacing: 0.5 }}>{rolCfg.label.toUpperCase()}</div>
          </div>
        </div>
        {showProfile && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.textMid, marginBottom: 10 }}>{currentUser.email}</div>
            <button onClick={(e) => { e.stopPropagation(); handleLogout(); }}
              style={{ width: "100%", padding: "9px", background: C.redBg, border: `1px solid ${C.red}33`, borderRadius: 8, color: C.red, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => navigate(n.id)}
            style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2, fontSize: 14, fontWeight: tab === n.id ? 700 : 400, background: tab === n.id ? C.goldBg : "transparent", color: tab === n.id ? C.gold : C.textMid, transition: "all .15s", textAlign: "left" }}>
            <span style={{ fontSize: 13, color: tab === n.id ? C.gold : C.textLow }}>{n.icon}</span>
            {n.label}
            {tab === n.id && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: C.gold }} />}
          </button>
        ))}
      </nav>

      <div style={{ padding: "12px 18px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, color: C.textLow }}>v1.0 · {new Date().toLocaleDateString("es-ES")}</div>
      </div>
    </>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden" }}>

      {/* ── SIDEBAR desktop ── */}
      <div style={{ width: 220, background: C.surface, display: "flex", flexDirection: "column", flexShrink: 0, borderRight: `1px solid ${C.border}`, zIndex: 10 }} className="sidebar-desktop">
        <SidebarContent />
      </div>

      {/* ── OVERLAY mobile menu ── */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 50 }} onClick={() => setMenuOpen(false)}>
          <div style={{ width: 260, height: "100%", background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 14px 0" }}>
              <button onClick={() => setMenuOpen(false)} style={{ background: C.panel, border: "none", width: 32, height: 32, borderRadius: "50%", fontSize: 18, cursor: "pointer", color: C.textMid }}>×</button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar mobile */}
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, flexShrink: 0 }} className="topbar-mobile">
          <button onClick={() => setMenuOpen(true)}
            style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, width: 40, height: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer" }}>
            <div style={{ width: 18, height: 2, background: C.textMid, borderRadius: 1 }} />
            <div style={{ width: 14, height: 2, background: C.textMid, borderRadius: 1 }} />
            <div style={{ width: 18, height: 2, background: C.textMid, borderRadius: 1 }} />
          </button>
          <div style={{ fontWeight: 900, fontSize: 16, color: C.text, letterSpacing: 2 }}>BAÜEN</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${rolCfg.color}22`, border: `2px solid ${rolCfg.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: rolCfg.color }}>
              {currentUser.avatar}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 18px", paddingBottom: 40 }}>
          {tab === "dashboard"    && canAccess("dashboard")    && <Dashboard presupuestos={presupuestos} proyectos={proyectos} gastos={gastos} certificaciones={certificaciones} />}
          {tab === "presupuestos" && canAccess("presupuestos") && <Presupuestos presupuestos={presupuestos} setPresupuestos={setPresupuestos} onAprobar={handleAprobar} />}
          {tab === "crm"          && canAccess("crm")          && <CRM crm={crm} setCRM={setCRM} presupuestos={presupuestos} />}
          {tab === "proyectos"    && canAccess("proyectos")    && <Proyectos proyectos={proyectos} presupuestos={presupuestos} />}
          {tab === "gastos"       && canAccess("gastos")       && <Gastos gastos={gastos} setGastos={setGastos} proyectos={proyectos} />}
          {tab === "cobros"       && canAccess("cobros")       && <Certificaciones certificaciones={certificaciones} setCertificaciones={setCertificaciones} proyectos={proyectos} />}
          {tab === "saldos"       && canAccess("saldos")       && <Saldos proyectos={proyectos} gastos={gastos} certificaciones={certificaciones} />}
          {tab === "usuarios"     && canAccess("usuarios")     && <GestionUsuarios usuarios={usuarios} setUsuarios={setUsuarios} currentUser={currentUser} />}
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: C.gold, color: "#111", padding: "12px 24px", borderRadius: 24, fontWeight: 800, fontSize: 14, boxShadow: "0 8px 32px rgba(201,168,76,.35)", zIndex: 2000, whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; background: #111; }
        input, select, textarea { color-scheme: dark; }
        input::placeholder { color: #5A5550; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        @media (min-width: 768px) {
          .topbar-mobile { display: none !important; }
          .sidebar-desktop { display: flex !important; }
        }
        @media (max-width: 767px) {
          .sidebar-desktop { display: none !important; }
          .topbar-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
