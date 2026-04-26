import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, FileSearch, QrCode, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Landing = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim()) {
      navigate(`/verify?code=${encodeURIComponent(verificationCode.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c1d95] via-[#3b82f6] to-[#22d3ee] text-white overflow-hidden relative">
      {/* Background decorative waves */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-[#22d3ee]/30 rounded-t-[150px] -rotate-6" />
        <div className="absolute bottom-10 right-0 w-full h-1/2 bg-[#c026d3]/30 rounded-t-[180px] rotate-6" />
      </div>

      {/* Header */}
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

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-28 pb-32 text-center">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-8">
          Verify Academic Documents{" "}
          <span className="text-white">Instantly</span>
        </h1>

        <p className="max-w-2xl mx-auto text-xl leading-relaxed text-white/90 mb-16">
          Our secure verification system ensures the authenticity of academic transcripts, 
          statements of results, and other school documents using QR code technology.
        </p>

        {/* Verification Form */}
        <form
          onSubmit={handleVerify}
          className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold mb-2">Verify a Document</h2>
          <p className="text-white/70 mb-8">
            Enter the verification code found on the document or scan the QR code
          </p>
          <div className="flex gap-3">
            <Input
              placeholder="e.g. VRF-2024-A1B2C3"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="bg-white/90 text-slate-900 border-0 h-14 text-lg placeholder:text-slate-500"
            />
            <Button 
              type="submit" 
              className="bg-white text-[#4c1d95] hover:bg-white/90 h-14 px-10 font-semibold text-lg"
            >
              Verify <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </form>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: QrCode, 
              title: "QR Code Verification", 
              desc: "Each document includes a unique QR code that can be scanned for instant verification." 
            },
            { 
              icon: FileSearch, 
              title: "Real-time Lookup", 
              desc: "Verify document authenticity in seconds with our secure online verification system." 
            },
            { 
              icon: Lock, 
              title: "Tamper-proof Security", 
              desc: "Advanced security measures ensure documents cannot be forged or tampered with." 
            },
          ].map((feature) => (
            <div 
              key={feature.title} 
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="w-20 h-20 mx-auto mb-8 bg-white/10 rounded-2xl flex items-center justify-center">
                <feature.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-white/80 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-white/60 text-sm">
        © {new Date().getFullYear()} DocVerify — School Document Verification System
      </footer>
    </div>
  );
};

export default Landing;