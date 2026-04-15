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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">DocVerify</span>
          </div>
          <Link to="/login">
            <Button variant="outline" size="sm" className="gap-2">
              <Lock className="w-4 h-4" /> Admin Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-8">
          <ShieldCheck className="w-4 h-4" />
          Trusted Document Verification
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground max-w-3xl mx-auto leading-tight">
          Verify Academic Documents{" "}
          <span className="text-accent">Instantly</span>
        </h1>
        <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
          Our secure verification system ensures the authenticity of academic transcripts, 
          statements of results, and other school documents using QR code technology.
        </p>

        {/* Verification Form */}
        <form
          onSubmit={handleVerify}
          className="mt-12 max-w-xl mx-auto bg-card rounded-2xl border border-border p-8 shadow-lg"
        >
          <h2 className="text-lg font-semibold text-card-foreground mb-1">Verify a Document</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Enter the verification code found on the document or scan the QR code
          </p>
          <div className="flex gap-3">
            <Input
              placeholder="e.g. VRF-2024-A1B2C3"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              Verify <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: QrCode, title: "QR Code Verification", desc: "Each document includes a unique QR code that can be scanned for instant verification." },
            { icon: FileSearch, title: "Real-time Lookup", desc: "Verify document authenticity in seconds with our secure online verification system." },
            { icon: Lock, title: "Tamper-proof Security", desc: "Advanced security measures ensure documents cannot be forged or tampered with." },
          ].map((feature) => (
            <div key={feature.title} className="bg-card rounded-xl border border-border p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-card-foreground text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mt-3">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} DocVerify — School Document Verification System
        </div>
      </footer>
    </div>
  );
};

export default Landing;
