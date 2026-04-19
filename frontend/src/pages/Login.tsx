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
        toast({
          title: "Welcome back!",
          description: "Logged in successfully.",
        });
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
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center p-12">
        <div className="text-primary-foreground max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-accent-foreground" />
            </div>
            <span className="text-2xl font-bold">DocVerify</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            School Document Verification System
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            Manage student records, generate verified academic documents, and
            ensure document authenticity with our secure platform.
          </p>
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

          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground mt-2 mb-8">
            Enter your credentials to access the admin panel
          </p>

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
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            <Link to="/" className="text-accent hover:underline">
              ← Back to verification page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;