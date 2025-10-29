import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import logo from "../assets/rakamin-logo.png";
import { loginApi } from "../api/authApi"; // ✅ import mock API

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);

    try {
      // Check if it's admin login
      const isAdmin = email === "admin@example.com" && password === "123456";

      const res = await loginApi({ email, password });

      if (res.success) {
        // simpan token & user ke localStorage
        localStorage.setItem("token", res.token || "");
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("role", isAdmin ? "admin" : "user");

        alert("✅ Login sukses!");
        // Route based on role
        navigate(isAdmin ? "/admin/jobs" : "/jobs");
      } else {
        alert("❌ " + res.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex mb-4 justify-center">
          <img
            src={logo}
            alt="Rakamin Logo"
            className="h-6"
            style={{ width: "200px", height: "80px" }}
          />
        </div>

        <div className="w-full bg-white rounded-lg shadow p-6 sm:p-8">
          {/* Title */}
          <h2 className="text-lg font-semibold mb-1">Masuk ke Rakamin</h2>
          <p className="text-sm text-gray-500 mb-6">
            Belum punya akun?{" "}
            <a
              onClick={() => navigate(`/register`)}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Daftar menggunakan email
            </a>
          </p>

          {/* Email Input */}
          <div className="form-input mb-2">
            <label className="text-sm text-gray-600">Alamat Email</label>
            <InputField
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="form-input">
            <label className="text-sm text-gray-600">Kata Sandi</label>
            <InputField
              type="password"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button Login */}
          <button
            disabled={loading}
            onClick={handleLogin}
            className={`cursor-pointer w-full mt-4 ${
              loading ? "bg-gray-400" : "bg-yellow-400 hover:bg-yellow-500"
            } text-white font-medium py-2 rounded-md transition`}
          >
            {loading ? "Loading..." : "Masuk"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-3 text-gray-400 text-sm">atau</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Google Button */}
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition cursor-pointer">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
            <span className="font-medium text-gray-700">
              Masuk melalui Google
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
