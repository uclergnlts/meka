import { useState } from "react";
import { KeyRound } from "lucide-react";
import { api } from "../../../services/apiClient.js";

const MIN_PASSWORD_LENGTH = 10;
const emptyPasswordForm = { currentPassword: "", newPassword: "", repeatPassword: "" };

export function PasswordForm() {
  const [form, setForm] = useState(emptyPasswordForm);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const save = async (event) => {
    event.preventDefault();
    setNotice("");
    if (form.newPassword !== form.repeatPassword) {
      setError("Yeni parola ile tekrarı aynı olmalı.");
      return;
    }

    setIsSaving(true);
    try {
      await api.auth.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setForm(emptyPasswordForm);
      setError("");
      setNotice("Parola değiştirildi. Diğer cihazlardaki oturumlar kapatıldı.");
    } catch (saveError) {
      setError(saveError.message || "Parola değiştirilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={save}>
      <div className="form-heading">
        <h3>Yönetici parolası</h3>
      </div>
      {error ? <div className="resource-notice error">{error}</div> : null}
      {notice ? <div className="resource-notice success">{notice}</div> : null}
      <div className="form-grid">
        <label>
          Mevcut parola
          <input type="password" autoComplete="current-password" value={form.currentPassword} onChange={(event) => updateField("currentPassword", event.target.value)} required />
        </label>
        <label>
          Yeni parola
          <input type="password" autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} value={form.newPassword} onChange={(event) => updateField("newPassword", event.target.value)} required />
        </label>
        <label>
          Yeni parola (tekrar)
          <input type="password" autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} value={form.repeatPassword} onChange={(event) => updateField("repeatPassword", event.target.value)} required />
        </label>
      </div>
      <button className="primary-btn compact" type="submit" disabled={isSaving}>
        <KeyRound size={18} /> {isSaving ? "Kaydediliyor" : "Parolayı değiştir"}
      </button>
    </form>
  );
}
