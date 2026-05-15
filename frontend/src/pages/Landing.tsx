import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  FileSearch,
  QrCode,
  Lock,
  ArrowRight,
  Scan,
  Cloud,
  Zap,
  Users,
  CheckCircle,
  Award,
  Globe,
  Layout,
  Building,
  Megaphone,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { QrScanner } from "@/components/QrScanner";
import { useToast } from "@/hooks/use-toast";
import { motion, useInView } from "framer-motion";

const Landing = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Refs for scroll animations
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const securityRef = useRef(null);
  const testimonialsRef = useRef(null);
  const servicesRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true });
  const howInView = useInView(howItWorksRef, { once: true });
  const securityInView = useInView(securityRef, { once: true });
  const testimonialsInView = useInView(testimonialsRef, { once: true });
  const servicesInView = useInView(servicesRef, { once: true });

  // Prevent body/document overflow
  useEffect(() => {
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.overflowX = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
    document.body.style.height = "100%";
    document.documentElement.style.height = "100%";
    
    return () => {
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
      document.documentElement.style.overflowX = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflowX = "";
      document.body.style.height = "";
      document.documentElement.style.height = "";
    };
  }, []);

  // Smooth scroll to section using scrollIntoView with CSS offset
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

  const verificationFeatures = [
    { icon: QrCode, title: "QR Code Verification", desc: "Each document includes a unique, encrypted QR code that can be scanned for instant authenticity check." },
    { icon: FileSearch, title: "Real-time Lookup", desc: "Verify document authenticity in under 2 seconds with our global, high‑availability verification API." },
    { icon: Lock, title: "Tamper-proof Security", desc: "Blockchain‑inspired hashing ensures documents cannot be forged or altered without detection." },
    { icon: ShieldCheck, title: "Student Record Management", desc: "Centralized dashboard to upload, update, and archive student transcripts and results." },
    { icon: Cloud, title: "Document History Tracking", desc: "Full audit trail of every verification request, including timestamp and geolocation." },
    { icon: Zap, title: "Instant Validation", desc: "Get results anywhere, anytime – no login required for verifiers." }
  ];

  const coreServices = [
    { icon: Globe, title: "Domain Registration", desc: "Secure your brand with premium .com.ng, .ng, and global domains." },
    { icon: Server, title: "Web Hosting", desc: "Fast, reliable cloud hosting with 99.9% uptime and 24/7 support." },
    { icon: Layout, title: "Website Design", desc: "Modern, responsive websites tailored to your business needs." },
    { icon: Building, title: "School Management Software", desc: "Comprehensive ERP for student records, fees, and exams." },
    { icon: ShieldCheck, title: "IT Consulting", desc: "Expert guidance to digitize and scale your operations." },
    { icon: Megaphone, title: "Digital Marketing", desc: "SEO, social media, and online ads to grow your reach." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* ===== DECORATIVE LAYERS (fixed, clipped) ===== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-[#1E3A8A]/20 rounded-t-[150px] -rotate-6 animate-wave-sway" />
        <div className="absolute bottom-10 right-0 w-full h-1/2 bg-[#1E3A8A]/20 rounded-t-[180px] rotate-6 animate-wave-sway-reverse" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/20 via-transparent to-[#1E3A8A]/20 animate-gradient-breathing" />
        
        <div className="absolute top-0 left-[-40%] w-[180%] h-[200%] bg-gradient-to-b from-white/20 via-white/10 to-transparent rotate-45 animate-slide-diagonal-bolder" />
        <div className="absolute bottom-0 right-[-40%] w-[180%] h-[200%] bg-gradient-to-t from-white/15 via-white/5 to-transparent -rotate-45 animate-slide-diagonal-reverse-bolder" />
        
        <div className="absolute top-[5%] left-[0%] w-96 h-96 rounded-full bg-[#1E3A8A]/20 blur-3xl animate-float-bold-1" />
        <div className="absolute bottom-[10%] right-[0%] w-[450px] h-[450px] rounded-full bg-[#1E3A8A]/20 blur-3xl animate-float-bold-2" />
        <div className="absolute top-[35%] left-[60%] w-80 h-80 rounded-full bg-purple-600/20 blur-3xl animate-float-bold-3" />
        <div className="absolute bottom-[25%] left-[15%] w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-3xl animate-float-bold-4" />
        
        <div className="absolute top-[15%] left-[10%] w-48 h-48 border-2 border-white/20 rounded-full animate-spin-slow shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
        <div className="absolute bottom-[20%] right-[8%] w-64 h-64 border-2 border-white/20 rounded-full animate-spin-slow-reverse shadow-[0_0_20px_rgba(255,255,255,0.15)]" />
        <div className="absolute top-[55%] left-[75%] w-36 h-36 border border-white/25 rounded-full animate-spin-slow shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ animationDuration: "20s" }} />
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/40 rounded-full shadow-[0_0_8px_white] animate-particle-drift-bold"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${18 + Math.random() * 15}s`,
            }}
          />
        ))}
        
        {/* Solid clouds */}
        <div className="absolute top-[10%] left-[5%] animate-cloud-float-1 opacity-90">
          <div className="relative w-80 h-32">
            <div className="absolute w-32 h-32 bg-[#6699ff] rounded-full left-0 top-0 shadow-2xl" />
            <div className="absolute w-40 h-40 bg-[#6699ff] rounded-full left-20 top-[-10px]" />
            <div className="absolute w-36 h-36 bg-[#6699ff] rounded-full left-44 top-5" />
            <div className="absolute w-28 h-28 bg-[#6699ff] rounded-full left-60 top-16" />
            <div className="absolute w-full h-20 bg-[#6699ff] rounded-full bottom-0 left-0" />
          </div>
        </div>
        <div className="absolute bottom-[5%] right-[5%] animate-cloud-float-2 opacity-90">
          <div className="relative w-96 h-40">
            <div className="absolute w-44 h-44 bg-[#6699ff] rounded-full left-0 top-0 shadow-2xl" />
            <div className="absolute w-48 h-48 bg-[#6699ff] rounded-full left-32 top-[-20px]" />
            <div className="absolute w-40 h-40 bg-[#6699ff] rounded-full left-64 top-5" />
            <div className="absolute w-full h-24 bg-[#6699ff] rounded-full bottom-0 left-0" />
          </div>
        </div>
      </div>

      {/* Glassmorphism Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200 h-[70px] shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between h-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection("home")}>
            <img src="/logo-Neo.png" alt="Neo Cloud Technologies Logo" className="h-12 w-auto object-contain" />
          </div>
          <div className="hidden md:flex gap-8 text-gray-700 font-medium">
            {[
              { name: "Home", id: "home" },
              { name: "Services", id: "services" },
              { name: "Verification", id: "verification" },
              { name: "Security", id: "security" },
              { name: "Contact", id: "contact" }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="hover:text-[#1E3A8A] transition duration-200 cursor-pointer bg-transparent border-none text-inherit font-medium"
              >
                {item.name}
              </button>
            ))}
          </div>
          <Link to="/login">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-[#1E3A8A] hover:text-[#1E3A8A] rounded-full">
              <Lock className="w-4 h-4 mr-2" /> Admin
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow pt-[70px] relative z-10">
        {/* Hero Section with Video */}
        <section id="home" className="container mx-auto px-6 py-16 md:py-24 scroll-mt-[70px]">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 text-sm mb-6">
                <Zap className="w-4 h-4 text-[#F7941D]" />
                <span className="text-[#F7941D] font-medium">The Hybrid Experience</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Your Trusted Partner in{" "}
                <span className="bg-gradient-to-r from-[#1E3A8A] to-[#F7941D] bg-clip-text text-transparent">
                  Digital Innovation
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Domain registration, web hosting, software development, and IT consulting – tailored for African businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-8 py-6 text-lg rounded-full shadow-md hover:shadow-lg transition-all"
                  onClick={() => scrollToSection("services")}
                >
                  Explore Services <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button onClick={() => setShowScanner(true)} variant="outline" className="border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10 px-8 py-6 text-lg rounded-full">
                  <Scan className="mr-2 w-5 h-5" /> Verify Document
                </Button>
              </div>
              <div className="mt-12 flex flex-wrap gap-6 justify-center lg:justify-start text-gray-500">
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-[#1E3A8A]" /> 1000+ Clients</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#1E3A8A]" /> 10+ Years</div>
                <div className="flex items-center gap-2"><Award className="w-4 h-4 text-[#1E3A8A]" /> 24/7 Support</div>
              </div>
            </div>

            {/* Video Demonstration - Larger size, well-presented */}
            <div className="flex-1 relative flex justify-center">
              <div className="relative w-full max-w-md md:max-w-xl lg:max-w-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/15 to-[#F7941D]/15 rounded-3xl blur-2xl animate-pulse-slow" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                  <video 
                    src="/video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-sm text-center font-medium">See how verification works in seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Services Section */}
        <section id="services" ref={servicesRef} className="bg-white/60 backdrop-blur-sm py-20 scroll-mt-[70px]">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={servicesInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">What We Do</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#1E3A8A] to-[#F7941D] mx-auto rounded-full mb-6" />
              <p className="text-gray-600 text-lg">Comprehensive digital solutions to power your business online.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreServices.map((service, idx) => (
                <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} animate={servicesInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: idx * 0.1 }} whileHover={{ y: -6 }} className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100 hover:shadow-xl transition-all">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#1E3A8A]/10 to-[#F7941D]/10 rounded-xl flex items-center justify-center">
                    <service.icon className="w-8 h-8 text-[#1E3A8A]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Verification Features */}
        <section id="verification" ref={featuresRef} className="py-20 scroll-mt-[70px]">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Academic Document Verification</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#1E3A8A] to-[#F7941D] mx-auto rounded-full mb-6" />
              <p className="text-gray-600 text-lg">Our specialized software solution – trusted by schools and examination bodies.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {verificationFeatures.map((feature, idx) => (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: idx * 0.1 }} whileHover={{ y: -6 }} className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100 hover:shadow-xl transition-all">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#1E3A8A]/10 to-[#F7941D]/10 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-[#1E3A8A]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" ref={howItWorksRef} className="bg-white/60 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">How Verification Works</h2>
            <div className="flex flex-col md:flex-row justify-between gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#1E3A8A]/50 via-[#F7941D]/50 to-[#1E3A8A]/50 -translate-y-1/2" />
              {[
                { step: "1", title: "Upload Student Record", desc: "Admin securely uploads results to Neo Cloud dashboard." },
                { step: "2", title: "Generate Secure Document", desc: "System creates a QR‑coded, tamper‑proof transcript or certificate." },
                { step: "3", title: "Scan QR to Verify", desc: "Anyone scans the QR code – instant authenticity result appears." }
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={howInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.2 }} className="flex-1 text-center relative bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#1E3A8A] to-[#F7941D] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-md">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Verification Form */}
        <section id="verify" className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Verify a Document – <span className="text-[#1E3A8A]">Enter Code or Scan QR</span></h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#1E3A8A] to-[#F7941D] mx-auto rounded-full mb-6" />
              <p className="text-gray-600 text-lg">Enter the verification code printed on the document, or use your camera to scan the QR code.</p>
            </div>
            <form onSubmit={handleVerify} className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex flex-col gap-6">
                <div>
                  <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-2 text-left">Verification Code</label>
                  <div className="flex gap-3">
                    <Input id="verification-code" placeholder="e.g. a1b2c3d4e5f6..." value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="bg-gray-50 border-gray-300 text-gray-900 h-14 text-lg placeholder:text-gray-400 flex-1 transition-all focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]" />
                    <Button type="submit" disabled={isVerifying} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white h-14 px-8 font-semibold text-lg transition-all hover:scale-105 shadow-md">
                      {isVerifying ? "Verifying..." : "Verify"} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <Button type="button" onClick={() => setShowScanner(true)} className="bg-white border-2 border-[#F7941D] text-[#F7941D] hover:bg-[#F7941D] hover:text-white h-14 text-lg font-semibold transition-all w-full max-w-md mx-auto group rounded-full">
                  <Scan className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" /> Scan QR Code
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Security Showcase */}
        <section id="security" ref={securityRef} className="bg-white/60 backdrop-blur-sm py-20 scroll-mt-[70px]">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={securityInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5 }} className="bg-white rounded-3xl p-8 md:p-12 shadow-md border border-gray-100">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <ShieldCheck className="w-16 h-16 text-[#1E3A8A] mb-6" />
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Bank‑Grade Security & Compliance</h2>
                  <p className="text-gray-600 text-lg mb-6">Every document is encrypted with AES‑256 and timestamped on an immutable ledger. Our system meets global data protection standards (GDPR, NDPR) and provides tamper‑proof verification trusted by top universities and examination boards.</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div><div className="text-2xl font-bold text-[#F7941D]">99.9%</div><div className="text-sm text-gray-500">Verification Accuracy</div></div>
                    <div><div className="text-2xl font-bold text-[#F7941D]">&lt; 2s</div><div className="text-sm text-gray-500">Instant QR Validation</div></div>
                    <div><div className="text-2xl font-bold text-[#F7941D]">256‑bit</div><div className="text-sm text-gray-500">Encryption Standard</div></div>
                    <div><div className="text-2xl font-bold text-[#F7941D]">100%</div><div className="text-sm text-gray-500">Uptime SLA</div></div>
                  </div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 bg-[#1E3A8A] rounded-full blur-3xl opacity-20 animate-pulse-slow" />
                    <Lock className="w-full h-full text-gray-300 drop-shadow-2xl" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" ref={testimonialsRef} className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Trusted by Businesses & Institutions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { name: "Dr. Sarah Johnson", role: "Registrar, State University", text: "The document verification system eliminated fraud completely. Seamless integration and excellent support." },
                { name: "Michael Okafor", role: "CEO, EduTech Africa", text: "Neo Cloud's hosting and school management software have transformed our operations." },
                { name: "Prof. James Liu", role: "Dean of Academics, Asia Pacific College", text: "Tamper-proof transcripts saved us from fake credentials. A must-have for any institution." },
                { name: "Elena Vesna", role: "Director of Admissions, European University", text: "The verification dashboard gives us full visibility and peace of mind." }
              ].map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={testimonialsInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#F7941D]" />
                    <div><div className="font-semibold text-gray-800">{t.name}</div><div className="text-sm text-gray-500">{t.role}</div></div>
                  </div>
                  <p className="text-gray-600 italic leading-relaxed">"{t.text}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer / Contact Section */}
      <footer id="contact" className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-16 text-center scroll-mt-[70px]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Ready to Digitize Your Business?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">Get in touch with us for domain registration, hosting, custom software, or document verification.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-8 py-6 text-lg rounded-full shadow-md">Contact Sales</Button>
            <Button onClick={() => setShowScanner(true)} variant="outline" className="border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10 px-8 py-6 text-lg rounded-full">Verify Document</Button>
          </div>
          <div className="text-gray-500 text-sm flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2 justify-center md:justify-start"><Cloud className="w-5 h-5 text-[#1E3A8A]" /> <span>Neo Cloud Technologies — The Hybrid Experience</span></div>
            <div className="flex gap-6 justify-center"><a href="#" className="hover:text-[#1E3A8A] transition">Privacy</a><a href="#" className="hover:text-[#1E3A8A] transition">Terms</a><a href="#" className="hover:text-[#1E3A8A] transition">Contact</a></div>
            <div>© {new Date().getFullYear()} Neo Cloud Technologies — The Hybrid Experience</div>
          </div>
        </div>
      </footer>

      {/* QR Scanner Modal */}
      {showScanner && <QrScanner onScanSuccess={handleQrScanSuccess} onClose={() => setShowScanner(false)} />}

      {/* Global reset & animations */}
      <style>{`
        /* Prevent any horizontal scroll globally */
        html, body, #root {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
          height: 100%;
        }
        
        /* Animation keyframes (same as original) */
        @keyframes wave-sway { 0%,100% { transform: rotate(-6deg) translateX(0); } 50% { transform: rotate(-3deg) translateX(3%); } }
        @keyframes wave-sway-reverse { 0%,100% { transform: rotate(6deg) translateX(0); } 50% { transform: rotate(3deg) translateX(-3%); } }
        @keyframes gradient-breathing { 0%,100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.05); } }
        @keyframes slide-diagonal-bolder { 0% { transform: translateX(-40%) translateY(-40%) rotate(45deg); opacity: 0; } 20% { opacity: 0.8; } 80% { opacity: 0.8; } 100% { transform: translateX(40%) translateY(40%) rotate(45deg); opacity: 0; } }
        @keyframes slide-diagonal-reverse-bolder { 0% { transform: translateX(40%) translateY(40%) rotate(-45deg); opacity: 0; } 20% { opacity: 0.6; } 80% { opacity: 0.6; } 100% { transform: translateX(-40%) translateY(-40%) rotate(-45deg); opacity: 0; } }
        @keyframes float-bold-1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-30px) scale(1.15); } }
        @keyframes float-bold-2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-35px,25px) scale(1.18); } }
        @keyframes float-bold-3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(25px,35px) scale(1.12); } }
        @keyframes float-bold-4 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-28px,-38px) scale(1.2); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes particle-drift-bold { 0% { transform: translateY(0) translateX(0); opacity: 0; } 15% { opacity: 0.7; } 85% { opacity: 0.7; } 100% { transform: translateY(-120px) translateX(40px); opacity: 0; } }
        @keyframes cloud-float-1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px,-20px); } }
        @keyframes cloud-float-2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px,25px); } }
        @keyframes cloud-float-3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(25px,30px); } }
        @keyframes cloud-float-4 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-20px,-25px); } }
        @keyframes cloud-float-5 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(15px,-15px); } }
        @keyframes pulse-slow { 0%,100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.05); } }
        
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
        .animate-cloud-float-1 { animation: cloud-float-1 20s ease-in-out infinite; }
        .animate-cloud-float-2 { animation: cloud-float-2 25s ease-in-out infinite; }
        .animate-cloud-float-3 { animation: cloud-float-3 22s ease-in-out infinite; }
        .animate-cloud-float-4 { animation: cloud-float-4 28s ease-in-out infinite; }
        .animate-cloud-float-5 { animation: cloud-float-5 18s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Landing;