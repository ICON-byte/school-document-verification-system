import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  FileSearch,
  QrCode,
  Lock,
  ArrowRight,
  Scan,
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

  useEffect(() => {
    const originalStyle =
      window.getComputedStyle(document.documentElement).overscrollBehavior;

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
      toast({
        title: "Empty code",
        description: "Please enter a verification code.",
        variant: "destructive",
      });
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
      toast({
        title: "Invalid QR",
        description:
          "Scanned QR did not contain a verification code.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c1d95] via-[#3b82f6] to-[#22d3ee] text-white overflow-hidden relative">

      {/* Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes drift {
          0% {
            transform: translate(0,0) rotate(-6deg);
          }
          50% {
            transform: translate(25px,-30px) rotate(-3deg);
          }
          100% {
            transform: translate(0,0) rotate(-6deg);
          }
        }

        @keyframes float {
          0%,100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-slide-up {
          opacity: 0;
          animation: slideUp 0.45s cubic-bezier(0.25,1,0.5,1) forwards;
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }

        .animate-drift {
          animation: drift 8s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 5s linear infinite;
        }

        .animate-spin-slow {
          animation: slowSpin 18s linear infinite;
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-[#22d3ee]/30 rounded-t-[150px] animate-drift" />

        <div
          className="absolute bottom-10 right-0 w-full h-1/2 bg-[#c026d3]/30 rounded-t-[180px] rotate-6"
          style={{
            animation: "drift 10s ease-in-out infinite reverse",
          }}
        />

        <div className="absolute top-24 left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl animate-float" />

        <div
          className="absolute top-1/3 right-10 w-52 h-52 rounded-full bg-cyan-300/10 blur-3xl"
          style={{
            animation: "float 6s ease-in-out infinite",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-black/10 backdrop-blur-md">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">

          {/* LOGO MOTION REMOVED */}
          <div className="flex items-center gap-3 animate-slide-up">
            <div className="w-10 h-10 rounded-2xl bg-white/90 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#4c1d95]" />
            </div>

            <span className="font-bold text-2xl tracking-tight">
              DocVerify
            </span>
          </div>

          <Link to="/login">
            <Button className="bg-white/10 border-white/30 hover:bg-white/20 text-white transition-all duration-300 active:scale-90 animate-slide-up">
              <Lock className="w-4 h-4 mr-2" />
              Admin Login
            </Button>
          </Link>

        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-6 pt-28 pb-32 text-center">

        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-8 animate-slide-up">
          Verify Academic Documents{" "}
          <span className="animate-shimmer bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
            Instantly
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-xl leading-relaxed text-white/90 mb-16 animate-slide-up delay-1">
          Our secure verification system ensures the authenticity
          of academic transcripts, statements of results, and other
          school documents using QR code technology.
        </p>

        {/* FORM */}
        <form
          onSubmit={handleVerify}
          className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl animate-slide-up delay-2 hover:border-white/30 transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold mb-2">
            Verify a Document
          </h2>

          <p className="text-white/70 mb-8">
            Enter the verification code or scan the QR code on your
            document.
          </p>

          <div className="flex flex-col gap-5">

            <div>
              <label
                htmlFor="verification-code"
                className="block text-sm font-medium text-white/80 mb-2 text-left"
              >
                Verification Code
              </label>

              <div className="flex gap-3">

                <Input
                  id="verification-code"
                  placeholder="e.g. a1b2c3d4e5f6..."
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value)
                  }
                  className="bg-white/90 text-slate-900 border-0 h-14 text-lg placeholder:text-slate-500 flex-1 focus:ring-2 focus:ring-white/50 transition-all"
                />

                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="bg-white text-[#4c1d95] hover:bg-white/90 h-14 px-10 font-semibold text-lg transition-all duration-300 active:scale-90 shadow-lg hover:-translate-y-1"
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                  <ArrowRight className="ml-2 w-5 h-5 animate-float" />
                </Button>

              </div>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                OR
              </span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <Button
              type="button"
              onClick={() => setShowScanner(true)}
              className="bg-white text-[#4c1d95] hover:bg-white/90 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] w-full max-w-md mx-auto hover:-translate-y-1"
            >
              <Scan className="w-5 h-5 mr-3 animate-spin-slow" />
              Scan QR Code
            </Button>

          </div>
        </form>

      </section>

      {/* Features */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">

          {[
            {
              icon: QrCode,
              title: "QR Code Verification",
              desc:
                "Each document includes a unique QR code that can be scanned for instant verification.",
            },
            {
              icon: FileSearch,
              title: "Real-time Lookup",
              desc:
                "Verify document authenticity in seconds with our secure online verification system.",
            },
            {
              icon: Lock,
              title: "Tamper-proof Security",
              desc:
                "Advanced security measures ensure documents cannot be forged or tampered with.",
            },
          ].map((feature, idx) => (
            <div
              key={feature.title}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center transition-all duration-300 hover:scale-105 hover:bg-white/20 animate-slide-up"
              style={{
                animationDelay: `${0.35 + idx * 0.08}s`,
              }}
            >
              <div className="w-20 h-20 mx-auto mb-8 bg-white/10 rounded-2xl flex items-center justify-center animate-float">
                <feature.icon className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-semibold mb-4">
                {feature.title}
              </h3>

              <p className="text-white/80 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-white/60 text-sm animate-slide-up">
        © {new Date().getFullYear()} DocVerify — School Document
        Verification System
      </footer>

      {/* Scanner */}
      {showScanner && (
        <div className="animate-slide-up">
          <QrScanner
            onScanSuccess={handleQrScanSuccess}
            onClose={() => setShowScanner(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Landing;