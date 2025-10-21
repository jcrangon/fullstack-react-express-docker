import api from "@/api/axios";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/auth/register", { email, name, password });
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 320, padding: 16 }}>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="nom" value={name} onChange={e=>setName(e.target.value)} />
      <input type="password" placeholder="mot de passe" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>S'inscrire</button>
    </form>
  );
}
