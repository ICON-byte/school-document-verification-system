import { useSearchParams, Link } from "react-router-dom";
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle, Loader2, FileText, Calendar, User, Hash, UserCircle, Mail, Phone, RefreshCw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface VerificationResult {
  valid: boolean;
  document?: {
    type: string;
    issueDate: string;
    student: {
      name: string;
      admissionNo: string;
      className: string;
      photo?: string | null;
      email?: string;
      phone?: string;
    };
  };
  message?: string;
}

const Verify = () => {
  const [searchParams] = useSearchParams();
  const codeFromUrl = searchParams.get("code") || "";
  const [code, setCode] = useState(codeFromUrl);
  const [searched, setSearched] = useState(!!codeFromUrl);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (codeFromUrl) {
      performVerification(codeFromUrl);
    }
  }, [codeFromUrl]);

  const performVerification = async (verificationCode: string) => {
    setLoading(true);
    setSearched(true);
    setResult(null);
    try {
      const response = await fetch(`${API_BASE}/documents/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }
      setResult(data);
    } catch (error: any) {
      setResult({ valid: false, message: error.message });
      // toast({
      //   title: "Verification error",
      //   description: error.message,
      //   variant: "destructive",
      // });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast({ title: "Empty code", description: "Please enter a verification code", variant: "destructive" });
      return;
    }
    performVerification(code.trim());
  };

  const resetAndTryAgain = () => {
    setCode("");
    setSearched(false);
    setResult(null);
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    input?.focus();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatDocType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getPhotoUrl = (photo: string | null | undefined): string | undefined => {
    if (!photo || photo.trim() === "") return undefined;
    if (photo.startsWith('data:image/')) return photo;
    return `data:image/jpeg;base64,${photo}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
  };

  return (
    <div className="min-h-screen bg-[#f8faff]">
      {/* Header – Neo Cloud branding */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            {/* Logo image – same as used in PDF certificate */}
            <div className="w-9 h-9 rounded-lg bg-[#FFFFFF] flex items-center justify-center shadow-md overflow-hidden">
              <img src="/logo-Neo.png" alt="Neo Cloud Logo" className="w-7 h-7 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-slate-800 tracking-tight leading-tight">Neo Cloud</span>
              <span className="text-[10px] text-[#6699ff] font-medium tracking-wider">ICT SKILLS ANYWHERE</span>
            </div>
          </Link>
          {searched && !loading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAndTryAgain}
              className="text-slate-500 hover:text-slate-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Verify Another
            </Button>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 tracking-tight">
            Document Verification
          </h1>
          <p className="text-slate-500">Enter the verification code from your document</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="e.g. 1a2b3c4d5e6f7890..."
                value={code}
                onChange={(e) => { setCode(e.target.value); setSearched(false); setResult(null); }}
                className="h-12 text-md bg-white border-slate-200 focus:border-[#6699ff] focus:ring-2 focus:ring-[#6699ff]/20"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="h-12 px-8 bg-[#6699ff] hover:bg-[#5588ee] text-white font-semibold shadow-sm transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>

        {loading && (
          <Card className="p-12 text-center bg-white shadow-md rounded-md">
            <Loader2 className="w-12 h-12 text-[#6699ff] animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Verifying document, please wait...</p>
          </Card>
        )}

        {!loading && searched && result?.valid === true && result.document && (
          <Card className="bg-white shadow-md rounded-md overflow-hidden">
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h2 className="text-lg font-bold text-green-800">Document Verified ✓</h2>
                  <p className="text-green-700 text-sm">This document is authentic and valid</p>
                </div>
              </div>
            </div>
            <div className="p-6 divide-y divide-slate-100">
              <div className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-20 h-20 border-2 border-slate-200 shadow-sm">
                    {(() => {
                      const photoUrl = getPhotoUrl(result.document?.student?.photo);
                      return photoUrl ? (
                        <AvatarImage 
                          src={photoUrl} 
                          alt={result.document!.student.name}
                          className="object-cover"
                          onError={handleImageError}
                        />
                      ) : null;
                    })()}
                    <AvatarFallback className="bg-slate-100 text-slate-600">
                      <UserCircle className="w-10 h-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-xl text-slate-800">{result.document.student.name}</h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                      <Hash className="w-3 h-3" />
                      {result.document.student.admissionNo}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-3">
                  <User className="w-4 h-4" />
                  <span>Student Information</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Department / Class</span>
                    <span className="text-slate-700 font-medium">{result.document.student.className}</span>
                  </div>
                  {result.document.student.email && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email
                      </span>
                      <span className="text-slate-700 text-sm">{result.document.student.email}</span>
                    </div>
                  )}
                  {result.document.student.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Phone
                      </span>
                      <span className="text-slate-700 text-sm">{result.document.student.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-3">
                  <FileText className="w-4 h-4" />
                  <span>Document Details</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Document Type</span>
                    <span className="font-medium text-slate-700 capitalize">{formatDocType(result.document.type)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Date Issued</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-700">{formatDate(result.document.issueDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {!loading && searched && result?.valid === false && (
          <div className="space-y-4">
            {result?.message?.toLowerCase().includes("revoked") && (
              <Card className="bg-white shadow-md rounded-md overflow-hidden">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                    <div>
                      <h2 className="text-lg font-bold text-amber-800">Document Revoked</h2>
                      <p className="text-amber-700 text-sm">This document is no longer valid</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center space-y-4">
                  <p className="text-slate-600">
                    The document has been revoked by the issuing authority. This could be due to administrative changes, cancellation, or other official reasons.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-left">
                    <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-2">
                      <HelpCircle className="w-4 h-4" />
                      What you can do:
                    </h4>
                    <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                      <li>Contact the institution directly for clarification</li>
                      <li>Request a new document if eligible</li>
                      <li>Check if this was done in error by the issuing authority</li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {!result?.message?.toLowerCase().includes("revoked") && (
              <Card className="bg-white shadow-md rounded-md overflow-hidden">
                <div className="bg-slate-100 border-l-4 border-slate-400 p-4">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-6 h-6 text-slate-600" />
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Document Not Found</h2>
                      <p className="text-slate-600 text-sm">No matching document in our records</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center space-y-4">
                  <p className="text-slate-600">
                    {result.message || "The verification code you entered does not correspond to any issued document in our system."}
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-left">
                    <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-2">
                      <HelpCircle className="w-4 h-4" />
                      Possible reasons & recommendations:
                    </h4>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      <li>Double‑check the code for typos or missing characters</li>
                      <li>Ensure the code is from a document issued by this verification system</li>
                      <li>The document might have been issued but not yet indexed — try again later</li>
                      <li>Contact the issuing institution to confirm the correct verification code</li>
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={resetAndTryAgain}
                      className="bg-[#6699ff] hover:bg-[#5588ee]"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Another Code
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = 'mailto:support@docverify.com?subject=Verification%20Issue'}
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;