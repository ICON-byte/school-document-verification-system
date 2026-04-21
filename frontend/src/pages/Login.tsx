import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email === "admin@school.edu" && password === "admin123") {
        toast({ title: "Welcome back!", description: "Logged in successfully." });
        navigate("/admin");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Try admin@school.edu / admin123",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 p-4">
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md bg-white/15 border-2 border-white/50 rounded-3xl backdrop-blur-3xl bg-white/10 p-8 md:p-10 shadow-2xl">
        
        {/* Company Logo - Replace locally */}
        {/* Put your logo file in the public/ folder and name it logo.png */}
        <div className="flex justify-center mb-8">
          <img 
            src="/public/logo-Neo-2.png" 
            alt="Company Logo" 
            className="h-16 w-auto drop-shadow-md"
          />
        </div>

        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer w-full h-12 bg-transparent border-b-2 border-white text-white text-base px-5 outline-none"
            />
            <label
              htmlFor="email"
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-base transition-all duration-300 peer-focus:top-[-5px] peer-focus:text-sm peer-valid:top-[-5px] peer-valid:text-sm pointer-events-none"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer w-full h-12 bg-transparent border-b-2 border-white text-white text-base px-5 outline-none"
            />
            <label
              htmlFor="password"
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-base transition-all duration-300 peer-focus:top-[-5px] peer-focus:text-sm peer-valid:top-[-5px] peer-valid:text-sm pointer-events-none"
            >
              Password
            </label>

            {/* Password toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white hover:text-white/80"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex justify-between items-center text-white text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-white"
              />
              Remember Me
            </label>
            <button
              type="button"
              onClick={() => toast({ title: "Forgot Password", description: "Feature coming soon!" })}
              className="hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-3xl bg-white text-black hover:bg-white/90 text-lg font-semibold transition-all"
          >
            {loading ? "Signing in..." : "Log in"}
          </Button>
        </form>

        {/* Back to verification page */}
        <p className="text-center mt-6">
          <Link
            to="/"
            className="text-white/80 hover:text-white text-sm flex items-center justify-center gap-1"
          >
            ← Back to verification page
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;