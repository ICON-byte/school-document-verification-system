import { Link, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, FileSearch, QrCode, Lock, ArrowRight, 
  Scan
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { QrScanner } from "@/components/QrScanner";
import { useToast } from "@/hooks/use-toast";

const Landing = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Prevent overscroll beyond the top or bottom of the page
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.documentElement).overscrollBehavior;
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.documentElement.style.overscrollBehavior = originalStyle;
      document.body.style.overscrollBehavior = originalStyle;
    };
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.trim();
    if (!code) {
      toast({ title: "Empty code", description: "Please enter a verification code.", variant: "destructive" });
      return;
    }
    setIsVerifying(true);
    navigate(`/verify?code=${encodeURIComponent(code)}`);
    setIsVerifying(false);
  };

  const handleQrScanSuccess = (decodedText: string) => {
    const code = decodedText.trim();
    if (code) {
      navigate(`/verify?code=${encodeURIComponent(code)}`);
    } else {
      toast({ title: "Invalid QR", description: "Scanned QR did not contain a verification code.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c1d95] via-[#3b82f6] to-[#22d3ee] text-white overflow-hidden relative">
      {/* Original decorative waves - bolder sway */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-[#22d3ee]/30 rounded-t-[150px] -rotate-6 animate-wave-sway" />
        <div className="absolute bottom-10 right-0 w-full h-1/2 bg-[#c026d3]/30 rounded-t-[180px] rotate-6 animate-wave-sway-reverse" />
      </div>

      {/* Breathing gradient overlay - more visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-cyan-400/20 animate-gradient-breathing pointer-events-none" />

      {/* Bolder diagonal light sweeps - higher opacity, larger movement */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-0 left-[-40%] w-[180%] h-[200%] bg-gradient-to-b from-white/30 via-white/15 to-transparent rotate-45 animate-slide-diagonal-bolder" />
        <div className="absolute bottom-0 right-[-40%] w-[180%] h-[200%] bg-gradient-to-t from-white/25 via-white/10 to-transparent -rotate-45 animate-slide-diagonal-reverse-bolder" />
      </div>

      {/* Floating glowing orbs - larger, more colorful, bolder movement */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[0%] w-96 h-96 rounded-full bg-purple-500/30 blur-3xl animate-float-bold-1" />
        <div className="absolute bottom-[10%] right-[0%] w-[450px] h-[450px] rounded-full bg-blue-500/30 blur-3xl animate-float-bold-2" />
        <div className="absolute top-[35%] left-[60%] w-80 h-80 rounded-full bg-cyan-400/30 blur-3xl animate-float-bold-3" />
        <div className="absolute bottom-[25%] left-[15%] w-[400px] h-[400px] rounded-full bg-indigo-500/30 blur-3xl animate-float-bold-4" />
      </div>

      {/* Rotating geometric rings - thicker borders, more visible */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[15%] left-[10%] w-48 h-48 border-2 border-white/20 rounded-full animate-spin-slow shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
        <div className="absolute bottom-[20%] right-[8%] w-64 h-64 border-2 border-white/20 rounded-full animate-spin-slow-reverse shadow-[0_0_20px_rgba(255,255,255,0.15)]" />
        <div className="absolute top-[55%] left-[75%] w-36 h-36 border border-white/25 rounded-full animate-spin-slow shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ animationDuration: "20s" }} />
      </div>

      {/* Floating particles - more, brighter, larger drift */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/50 rounded-full shadow-[0_0_8px_white] animate-particle-drift-bold"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${18 + Math.random() * 15}s`,
            }}
          />
        ))}
      </div>

      {/* Additional pulsing soft glow spots */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[25%] left-[20%] w-2 h-2 bg-white/60 rounded-full animate-soft-pulse" />
        <div className="absolute bottom-[30%] right-[25%] w-2.5 h-2.5 bg-white/50 rounded-full animate-soft-pulse" style={{ animationDelay: "2.5s" }} />
        <div className="absolute top-[70%] left-[85%] w-2 h-2 bg-white/50 rounded-full animate-soft-pulse" style={{ animationDelay: "5s" }} />
        <div className="absolute top-[15%] right-[30%] w-1.5 h-1.5 bg-white/60 rounded-full animate-soft-pulse" style={{ animationDelay: "1.2s" }} />
      </div>

      {/* Header - unchanged */}
      <header className="relative z-50 border-b border-white/10 bg-black/10 backdrop-blur-md">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/90 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#4c1d95]" />
            </div>
            <span className="font-bold text-2xl tracking-tight">DocVerify</span>
          </div>
          <Link to="/login">
            <Button variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 text-white">
              <Lock className="w-4 h-4 mr-2" /> Admin Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section - unchanged */}
      <section className="relative z-10 container mx-auto px-6 pt-28 pb-32 text-center">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-8">
          Verify Academic Documents{" "}
          <span className="text-white">Instantly</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl leading-relaxed text-white/90 mb-16">
          Our secure verification system ensures the authenticity of academic transcripts, 
          statements of results, and other school documents using QR code technology.
        </p>

        {/* Verification Form - unchanged */}
        <form onSubmit={handleVerify} className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
          <h2 className="text-2xl font-semibold mb-2">Verify a Document</h2>
          <p className="text-white/70 mb-8">
            Enter the verification code or scan the QR code on your document.
          </p>
          
          <div className="flex flex-col gap-5">
            <div>
              <label htmlFor="verification-code" className="block text-sm font-medium text-white/80 mb-2 text-left">
                Verification Code
              </label>
              <div className="flex gap-3">
                <Input
                  id="verification-code"
                  placeholder="e.g. a1b2c3d4e5f6..."
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="bg-white/90 text-slate-900 border-0 h-14 text-lg placeholder:text-slate-500 flex-1 transition-all duration-200 focus:ring-2 focus:ring-white/50"
                />
                <Button 
                  type="submit" 
                  disabled={isVerifying}
                  className="bg-white text-[#4c1d95] hover:bg-white/90 h-14 px-10 font-semibold text-lg transition-all duration-200 hover:scale-105"
                >
                  {isVerifying ? "Verifying..." : "Verify"} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setShowScanner(true)}
              className="bg-white text-[#4c1d95] hover:bg-white/90 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full max-w-md mx-auto group"
            >
              <Scan className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" /> Scan QR Code
            </Button>
          </div>
        </form>
      </section>

      {/* Features Section - unchanged */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: QrCode, title: "QR Code Verification", desc: "Each document includes a unique QR code that can be scanned for instant verification." },
            { icon: FileSearch, title: "Real-time Lookup", desc: "Verify document authenticity in seconds with our secure online verification system." },
            { icon: Lock, title: "Tamper-proof Security", desc: "Advanced security measures ensure documents cannot be forged or tampered with." },
          ].map((feature, idx) => (
            <div 
              key={feature.title} 
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center hover:scale-105 transition-all duration-300 hover:bg-white/15"
            >
              <div className="w-20 h-20 mx-auto mb-8 bg-white/10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:rotate-3">
                <feature.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-white/80 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer - unchanged */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-white/60 text-sm">
        © {new Date().getFullYear()} DocVerify — School Document Verification System
      </footer>

      {/* QR Scanner Modal - unchanged */}
      {showScanner && (
        <QrScanner
          onScanSuccess={handleQrScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Bolder animation keyframes */}
      <style>{`
        @keyframes wave-sway {
          0%, 100% { transform: rotate(-6deg) translateX(0); }
          50% { transform: rotate(-3deg) translateX(3%); }
        }
        @keyframes wave-sway-reverse {
          0%, 100% { transform: rotate(6deg) translateX(0); }
          50% { transform: rotate(3deg) translateX(-3%); }
        }
        @keyframes gradient-breathing {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.05); }
        }
        @keyframes slide-diagonal-bolder {
          0% { transform: translateX(-40%) translateY(-40%) rotate(45deg); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateX(40%) translateY(40%) rotate(45deg); opacity: 0; }
        }
        @keyframes slide-diagonal-reverse-bolder {
          0% { transform: translateX(40%) translateY(40%) rotate(-45deg); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateX(-40%) translateY(-40%) rotate(-45deg); opacity: 0; }
        }
        @keyframes float-bold-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.15); }
        }
        @keyframes float-bold-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-35px, 25px) scale(1.18); }
        }
        @keyframes float-bold-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, 35px) scale(1.12); }
        }
        @keyframes float-bold-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-28px, -38px) scale(1.2); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes particle-drift-bold {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          15% { opacity: 0.7; }
          85% { opacity: 0.7; }
          100% { transform: translateY(-120px) translateX(40px); opacity: 0; }
        }
        @keyframes soft-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(3); opacity: 0; }
        }
        
        .animate-wave-sway { animation: wave-sway 14s ease-in-out infinite; }
        .animate-wave-sway-reverse { animation: wave-sway-reverse 15s ease-in-out infinite; }
        .animate-gradient-breathing { animation: gradient-breathing 12s ease-in-out infinite; }
        .animate-slide-diagonal-bolder { animation: slide-diagonal-bolder 14s ease-in-out infinite; }
        .animate-slide-diagonal-reverse-bolder { animation: slide-diagonal-reverse-bolder 16s ease-in-out infinite; }
        .animate-float-bold-1 { animation: float-bold-1 18s infinite ease-in-out; }
        .animate-float-bold-2 { animation: float-bold-2 20s infinite ease-in-out; }
        .animate-float-bold-3 { animation: float-bold-3 16s infinite ease-in-out; }
        .animate-float-bold-4 { animation: float-bold-4 22s infinite ease-in-out; }
        .animate-spin-slow { animation: spin-slow 25s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 23s linear infinite; }
        .animate-particle-drift-bold { animation: particle-drift-bold 20s infinite linear; }
        .animate-soft-pulse { animation: soft-pulse 4s infinite; }
      `}</style>
    </div>
  );
};

export default Landing;