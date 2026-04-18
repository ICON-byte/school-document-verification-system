import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    if (!isLogin) {
      setUsername("");
      setEmail("");
      setPassword("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (isLogin) {
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
      } else {
        toast({
          title: "Registration successful!",
          description: "Account created. Please log in.",
        });
        setIsLogin(true);
        setUsername("");
        setEmail("");
        setPassword("");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1475924156734-496f6cac6ec1')] bg-cover bg-center bg-no-repeat p-4">
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md bg-white/15 border-2 border-white/50 rounded-3xl backdrop-blur-3xl p-8 md:p-10 shadow-2xl">
        {/* DocVerify Branding */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold text-white">DocVerify</span>
        </div>

        <h2 className="text-3xl font-bold text-white text-center mb-8">
          {isLogin ? "Admin Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Username - only for Register */}
          {!isLogin && (
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="peer w-full h-12 bg-transparent border-b-2 border-white text-white text-base px-5 outline-none"
              />
              <label
                htmlFor="username"
                className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-base transition-all duration-300 peer-focus:top-[-5px] peer-focus:text-sm peer-valid:top-[-5px] peer-valid:text-sm pointer-events-none"
              >
                Username
              </label>
            </div>
          )}

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

            {/* Password visibility toggle (kept from your original workflow) */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white hover:text-white/80"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Remember Me + Forget Password (only on Login) */}
          {isLogin && (
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
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-3xl bg-white text-black hover:bg-white/90 text-lg font-semibold transition-all"
          >
            {loading
              ? (isLogin ? "Signing in..." : "Creating account...")
              : (isLogin ? "Log in" : "Register")}
          </Button>
        </form>

        {/* Toggle between Login & Register */}
        <div className="mt-8 text-center text-white text-sm">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleForm}
              className="font-semibold hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>

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