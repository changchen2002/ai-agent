// read from show result content
"use client"

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Loader2, Copy, ArrowLeft } from "lucide-react"

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const persona = searchParams.get("persona");
  const target = searchParams.get("target");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessage() {
      if (!persona || !target) {
        router.push("/input");
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona, target }),
        });

        if (!res.ok) {
          throw new Error("Failed to generate message");
        }

        const data = await res.json();
        setMessage(data.message || "Error generating message.");
      } catch (error) {
        setError("Failed to generate message. Please try again.");
        setMessage("");
      } finally {
        setLoading(false);
      }
    }

    fetchMessage();
  }, [persona, target, router]);

  const handleCopy = async () => {
    if (!message) return;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        setError("Failed to copy to clipboard. Please try again.");
      }
    } else {
      setError("Clipboard API is not available in your browser.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/input")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Form
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Generated Message</h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Generating your message...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      ) : (
        <>
          <div className="bg-gray-50 p-6 rounded-lg mb-6 whitespace-pre-wrap border border-gray-200">
            {message}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleCopy}
              className="flex items-center gap-2"
              disabled={!message}
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/input")}
            >
              Generate Another
            </Button>
          </div>
        </>
      )}
    </div>
  );
}