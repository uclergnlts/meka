import { useEffect, useState } from "react";
import { api } from "../../services/apiClient.js";
export function AdminAccess({ children }) {
  const [state, setState] = useState("loading");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    api.auth.session().then(() => { if (active) setState("ready"); }).catch(() => { if (active) setState("login"); });
    const expired = () => { setState("login"); setError("Oturumunuz sona erdi. Tekrar giriş yapın."); };
    window.addEventListener("meka-session-expired", expired);
    return () => { active = false; window.removeEventListener("meka-session-expired", expired); };
  }, []);
  async function login(event) {
    event.preventDefault(); setBusy(true); setError("");
    try { await api.auth.login({ username, password }); setPassword(""); setState("ready"); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  if (state === "loading") return <p role="status">Oturum kontrol ediliyor…</p>;
  if (state === "ready") return <><div className="admin-session-bar"><button type="button" onClick={async () => { try { await api.auth.logout(); setState("login"); } catch (e) { setError(e.message); } }}>Güvenli çıkış</button>{error && <span role="alert">{error}</span>}</div>{children}</>;
  return <main className="admin-login"><form className="admin-form" onSubmit={login}><h1>Yönetici girişi</h1><label>Kullanıcı adı<input autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required /></label><label>Parola<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>{error && <p role="alert">{error}</p>}<button className="primary-btn" disabled={busy}>{busy ? "Giriş yapılıyor…" : "Giriş yap"}</button></form></main>;
}
