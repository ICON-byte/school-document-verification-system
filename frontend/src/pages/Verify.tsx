import { useSearchParams, Link } from "react-router-dom";
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { mockDocuments } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const codeFromUrl = searchParams.get("code") || "";
  const [code, setCode] = useState(codeFromUrl);
  const [searched, setSearched] = useState(!!codeFromUrl);

  const doc = mockDocuments.find((d) => d.verificationCode === code);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">DocVerify</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16 max-w-xl">
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">Document Verification</h1>
        <p className="text-muted-foreground text-center mb-8">Enter a verification code to check document authenticity</p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <Input
            placeholder="e.g. VRF-2024-A1B2C3"
            value={code}
            onChange={(e) => { setCode(e.target.value); setSearched(false); }}
            className="flex-1"
          />
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">Verify</Button>
        </form>

        {searched && doc && doc.status === "valid" && (
          <div className="bg-card rounded-xl border border-success/30 p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-bold text-success mb-2">Document Verified</h2>
            <p className="text-sm text-muted-foreground mb-6">This document is authentic and valid.</p>
            <div className="text-left space-y-3 bg-muted/50 rounded-lg p-5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Student Name</span><span className="font-medium text-card-foreground">{doc.studentName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Matric Number</span><span className="font-medium text-card-foreground">{doc.matricNumber}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Document Type</span><span className="font-medium text-card-foreground capitalize">{doc.type.replace("_", " ")}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date Issued</span><span className="font-medium text-card-foreground">{new Date(doc.generatedAt).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Verification Code</span><span className="font-mono font-medium text-card-foreground">{doc.verificationCode}</span></div>
            </div>
          </div>
        )}

        {searched && doc && doc.status === "revoked" && (
          <div className="bg-card rounded-xl border border-destructive/30 p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-destructive mb-2">Document Revoked</h2>
            <p className="text-sm text-muted-foreground">This document has been revoked and is no longer valid.</p>
          </div>
        )}

        {searched && !doc && code && (
          <div className="bg-card rounded-xl border border-border p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Document Not Found</h2>
            <p className="text-sm text-muted-foreground">No document matches this verification code. Please check and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
