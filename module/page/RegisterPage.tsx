import axios from "axios";
import { useState } from "react";
import { CONFIG_UI_USER } from "../config-ui";
import { Button } from "./components/Button";

export function RegisterPage() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function register() {
    try {
      setLoading(true);
      const res = await axios.post('/api/register', { email, password, name });
      localStorage.setItem('token', res.data.token);
      window.location.href = CONFIG_UI_USER.register_redirect_path;
    } catch (err: any) {
      alert(err?.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col gap-2 bg-zinc-50/50 p-4">
        <div className="text-center text-xl font-bold">
          Register Page
        </div>
        <input
          className="bg-zinc-100 p-2 px-4 w-100 rounded-md outline-none"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name" />
        <input
          className="bg-zinc-100 p-2 px-4 w-100 rounded-md outline-none"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email" />
        <input
          className="bg-zinc-100 p-2 px-4 w-100 rounded-md outline-none"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password" />
        <Button onClick={register}>
          {loading ? 'Loading' : 'Register'}
        </Button>
      </div>
    </div>
  );
}
