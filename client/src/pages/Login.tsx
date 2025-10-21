import api from "@/api/axios";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/auth/login", { email, password });
    await api.post("/auth/refresh");
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 320, padding: 16 }}>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="mot de passe" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Se connecter</button>
    </form>
  );
}
