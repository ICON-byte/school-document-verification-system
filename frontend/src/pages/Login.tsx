import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowLeft,
  ShieldCheck,
  Zap,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const originalStyle = document.documentElement.style.overscrollBehavior;
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.documentElement.style.overscrollBehavior = originalStyle;
      document.body.style.overscrollBehavior = originalStyle;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Welcome back",
        description: `Logged in as ${data.user.fullName || data.user.email}`,
      });

      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 
                    bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 
                    font-sans relative overflow-hidden">

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] md:w-[45%] md:h-[45%] 
                        bg-[#6699ff] rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[65%] h-[65%] md:w-[50%] md:h-[50%] 
                        bg-indigo-400 rounded-full blur-[140px] opacity-15" />
      </div>

      {/* Main Card - Better Responsive Max Width */}
      <div className="relative w-full max-w-md md:max-w-lg lg:max-w-5xl 
                      flex flex-col lg:flex-row 
                      bg-white/80 backdrop-blur-2xl border border-white/60 
                      rounded-3xl shadow-xl overflow-hidden 
                      min-h-[520px] lg:min-h-[620px] z-10">

        {/* LEFT SIDE - Only visible on large screens */}
        <div className="hidden lg:flex lg:w-[46%] bg-gradient-to-br from-slate-900 via-slate-950 to-black relative p-10 xl:p-12 flex-col justify-between overflow-hidden">

          {/* Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 -left-10 w-80 h-80 bg-[#6699ff] rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-20 -right-10 w-96 h-96 bg-[#6699ff] rounded-full blur-[140px] animate-pulse delay-700" />
          </div>

          {/* Blue Dots Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#6699ff_1px,transparent_1px)] bg-[length:40px_40px] opacity-30" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="text-center mb-10">
              <h2 className="text-4xl xl:text-5xl font-black tracking-tighter text-white leading-tight">
                Welcome to the<br />
                <span className="text-[#6699ff]">Admin Portal</span>
              </h2>
              <p className="mt-8 text-slate-400 text-base xl:text-lg max-w-sm mx-auto">
                Secure platform for managing students records, document history, and document generation.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4 mt-auto">
              {[
                { icon: ShieldCheck, title: "Enterprise Security", desc: "Advanced protection for your data" },
                { icon: Zap, title: "Real-time Management", desc: "Monitor and control from one place" },
                { icon: BarChart3, title: "Powerful Analytics", desc: "Deep insights and reporting" }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-xl bg-[#6699ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-5 h-5 text-[#6699ff]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-500 pt-8 border-t border-white/10">
            © {new Date().getFullYear()} NeoCloud
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16">
          <div className="max-w-sm mx-auto w-full">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start mb-8 lg:mb-12">
              <img
                src="/logo-Neo.png"
                alt="NeoCloud Logo"
                className="h-12 sm:h-14 lg:h-16 w-auto drop-shadow-xl"
              />
            </div>

            <div className="text-center lg:text-left mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Sign in to access your admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@school.edu"
                    required
                    className="w-full h-12 sm:h-14 pl-12 pr-5 bg-white border border-slate-200 rounded-2xl focus:border-[#6699ff] focus:ring-4 focus:ring-[#6699ff]/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-12 sm:h-14 pl-12 pr-14 bg-white border border-slate-200 rounded-2xl focus:border-[#6699ff] focus:ring-4 focus:ring-[#6699ff]/10 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#6699ff]" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-[#6699ff] hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 sm:h-14 bg-[#6699ff] hover:bg-[#5a8ce6] disabled:opacity-75 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-[#6699ff]/30 flex items-center justify-center text-base"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "SIGN IN"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;