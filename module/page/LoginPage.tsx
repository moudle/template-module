import axios from "axios";
import { useState } from "react";
import { CONFIG_UI_USER } from "../config-ui";
import "./index.css";
import { Button } from "./components/Button";

export function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function login() {
    try {
      setLoading(true);
      const res = await axios.post('/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = CONFIG_UI_USER.login_redirect_path;
    } catch (err: any) {
      alert(err?.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-zinc-200"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email" />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password" />
      <Button onClick={login}>
        {loading ? 'Loading' : 'Login'}
      </Button>
    </div>
  );
}
