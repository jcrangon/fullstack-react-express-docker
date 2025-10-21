import api from "@/api/axios";
import { useEffect, useState } from "react";

export default function Posts() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    api.get("/posts").then(r => setPosts(r.data));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Posts</h2>
      <ul>
        {posts.map(p => (
          <li key={p.id}>
            <strong>{p.title}</strong> — {p.author?.name}
            {p.coverUrl && <div><img src={`http://localhost:8080${p.coverUrl}`} alt="cover" width={160}/></div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
