import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email === "admin@school.edu" && password === "admin123") {
        toast({ title: "Welcome back", description: "Logged in successfully." });
        navigate("/admin");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-slate-50 font-sans">
      
      {/* BACKGROUND ANIMATION ELEMENTS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[120px] animate-pulse delay-700" />

      <div className="relative w-full max-w-5xl flex flex-col md:flex-row bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden min-h-[650px]">
        
        {/* LEFT SIDE - BRANDING & VISUAL */}
        <div className="hidden md:flex md:w-[45%] bg-[#4a6cf7] relative p-12 flex-col justify-between items-start text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[length:24px_24px]" />
          
          <div className="relative z-10 flex items-center group cursor-default">
            <span className="font-bold text-2xl tracking-tight uppercase">Admin Portal</span>
          </div>

          <div className="relative z-10 w-full">
            <div className="mb-12">
              <img
                src="/logo-Neo.png"
                alt="NeoCloud Logo"
                className="h-15 w-auto drop-shadow-2xl"
              />
            </div>
            
            <h2 className="text-5xl font-black leading-tight mb-6 tracking-tight">
              Welcome <br />
              <span className="text-blue-200">Admin!</span>
            </h2>
            <p className="text-blue-50/80 text-lg max-w-xs leading-relaxed font-medium">
              Access your admin dashboard.<br />
              Manage users, settings, and system features securely.
            </p>
          </div>

          <div className="h-4" />
        </div>

        {/* RIGHT SIDE - THE FORM */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@school.edu"
                    required
                    className="w-full h-14 pl-12 pr-5 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-14 pl-12 pr-14 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  {/* Changed accent color to match NeoCloud's primary color (#4a6cf7) */}
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-[#4a6cf7] focus:ring-[#4a6cf7]/20 focus:ring-offset-0 accent-[#4a6cf7]" 
                  />
                  <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                </label>
                {/* Removed Forgot Password button */}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all duration-300 overflow-hidden shadow-lg shadow-slate-200 active:scale-[0.98]"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>SIGN IN</span>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;