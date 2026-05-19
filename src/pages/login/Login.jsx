import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginUser } from "../../api/api_client";


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await LoginUser({ email: email.trim(), password });
      const token = res.data?.body?.token;
      if (!token) {
        toast.error("Login succeeded but no token was returned. Check the API response shape.");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", token);
      toast.success("Signed in successfully.");
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        "Login failed.";
      toast.error(typeof msg === "string" ? msg : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          {/* <h1 className="text-3xl font-semibold tracking-tight text-black">
            The<span className="text-[#7B40AA]">Nashua</span>Independent
          </h1> */}

          <img src='https://storage.ghost.io/c/91/a3/91a32ce8-6cc9-4ebe-9bdb-66074a0d8396/content/images/2026/04/NI-header-MAP-NAME.png' alt="logo" className="w-70 mx-auto" />

          <p className="mt-2 text-sm text-black/60">Sign in to your admin account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-black/10 bg-white p-8 shadow-lg shadow-black/5 ring-1 ring-[#7B40AA]/15"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-left text-sm font-medium text-black">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-black outline-none transition placeholder:text-black/35 focus:border-[#7B40AA] focus:ring-2 focus:ring-[#7B40AA]/25"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-left text-sm font-medium text-black">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-black outline-none transition placeholder:text-black/35 focus:border-[#7B40AA] focus:ring-2 focus:ring-[#7B40AA]/25"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-[#7B40AA] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#7B40AA]/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
