import { useEffect, useState } from "react";
import { Bike, LogOut, ArrowLeft } from "lucide-react";
import { api } from "../../services/apiClient.js";
import { publicSiteUrl } from "../../utils/adminHost.js";

export function AdminAccess({ children }) {
  const [state, setState] = useState("loading");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    api.auth.session().then(() => {
      if (active) setState("ready");
    }).catch(() => {
      if (active) setState("login");
    });
    const expired = () => {
      setState("login");
      setError("Oturumunuz sona erdi. Tekrar giriş yapın.");
    };
    window.addEventListener("meka-session-expired", expired);
    return () => {
      active = false;
      window.removeEventListener("meka-session-expired", expired);
    };
  }, []);

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.auth.login({ username, password });
      setPassword("");
      setState("ready");
    } catch (e) {
      setError(e.message || "Kullanıcı adı veya şifre hatalı.");
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading") {
    return (
      <div className="admin-login-screen">
        <div style={{ textAlign: "center", color: "#9da3b2" }}>
          <div className="loading-dot" style={{ margin: "0 auto 12px" }} />
          <p role="status">Yönetici oturumu doğrulanıyor…</p>
        </div>
      </div>
    );
  }

  if (state === "ready") {
    return (
      <>
        <div className="admin-session-bar">
          <div className="admin-session-user">
            <span className="session-status-dot" />
            <span>Yönetici Oturumu Aktif</span>
          </div>
          <button
            type="button"
            className="session-logout-btn"
            onClick={async () => {
              try {
                await api.auth.logout();
                setState("login");
              } catch (e) {
                setError(e.message);
              }
            }}
          >
            <LogOut size={14} /> Güvenli Çıkış Yap
          </button>
          {error && <span role="alert" className="session-error-alert">{error}</span>}
        </div>
        {children}
      </>
    );
  }

  return (
    <main className="admin-login-screen">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-brand">
            <span className="admin-login-mark">
              <Bike size={22} />
            </span>
            <div>
              <strong>MEKA MOTO GARAGE</strong>
              <small>Simav / Kütahya</small>
            </div>
          </div>
          <h2>Yönetim Paneli Girişi</h2>
          <p>Atölye iş emirleri, parça stoğu, kasa ve müşteri kayıtları.</p>
        </div>

        <form className="admin-login-form" onSubmit={login}>
          <label>
            <span>Kullanıcı Adı</span>
            <input
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </label>
          <label>
            <span>Parola</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button className="admin-login-submit-btn" disabled={busy} type="submit">
            {busy ? "Doğrulanıyor…" : "Panele Giriş Yap"}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href={publicSiteUrl()} className="admin-login-back-btn">
            <ArrowLeft size={14} /> Ana Sayfaya Geri Dön
          </a>
        </div>
      </div>
    </main>
  );
}
