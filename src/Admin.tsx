import React, { useState } from "react";
import { Copy, Link, MessageSquare } from "lucide-react";

export default function Admin() {
  const [prefix, setPrefix] = useState("Mr.");
  const [guestName, setGuestName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const prefixes = ["Mr.", "Mrs.", "Miss", "Mr. & Mrs.", "Family of", "Dear"];

  const generate = () => {
    if (!guestName.trim()) return;
    
    // Construct the URL with current origin
    const baseUrl = window.location.origin;
    const url = new URL(baseUrl);
    url.searchParams.set("p", prefix);
    url.searchParams.set("n", guestName.trim());
    
    const link = url.toString();
    setGeneratedLink(link);

    const message = `Dear ${prefix} ${guestName.trim()} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ Stephen & Krishani`;

    setGeneratedMessage(message);
    setCopySuccess("");
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`Copied ${type}!`);
      setTimeout(() => setCopySuccess(""), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopySuccess("Failed to copy");
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center py-12 px-4 selection:bg-sage/20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-transparent to-paper/40 pointer-events-none" />
      
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-sage/20 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <h1 className="serif text-3xl md:text-4xl text-sage mb-2">Invitation Generator</h1>
          <p className="text-zinc-500 text-sm tracking-widest uppercase">Admin Panel</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-zinc-600 ml-1">Prefix</label>
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full rounded-xl border border-sage/30 bg-white px-4 py-3 text-sm text-zinc-800 outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-all"
              >
                {prefixes.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-zinc-600 ml-1">Guest Name</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Sanjaya"
                className="w-full rounded-xl border border-sage/30 bg-white px-4 py-3 text-sm text-zinc-800 outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-all"
                onKeyDown={(e) => e.key === "Enter" && generate()}
              />
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!guestName.trim()}
            className="w-full bg-sage text-white py-4 rounded-xl text-xs uppercase tracking-widest font-bold disabled:opacity-50 hover:bg-sage/90 transition-colors shadow-md flex justify-center items-center gap-2"
          >
            <Link size={16} /> Generate Link
          </button>

          {generatedLink && (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="h-px bg-sage/20 w-full" />
              
              <div className="space-y-4">
                <div className="bg-sage/5 rounded-2xl p-6 border border-sage/10 relative">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => copyToClipboard(generatedLink, "Link")}
                      className="p-2 bg-white rounded-lg shadow-sm text-sage hover:bg-sage hover:text-white transition-colors border border-sage/20 group relative"
                      title="Copy Link Only"
                    >
                      <Link size={16} />
                    </button>
                    <button
                      onClick={() => copyToClipboard(generatedMessage, "Full Message")}
                      className="p-2 bg-white rounded-lg shadow-sm text-sage hover:bg-sage hover:text-white transition-colors border border-sage/20 group relative"
                      title="Copy Full Message"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  
                  <p className="text-xs uppercase tracking-widest font-bold text-sage mb-4">Preview</p>
                  
                  <div className="whitespace-pre-wrap font-sans text-zinc-700 text-sm md:text-base leading-relaxed bg-white/50 p-4 rounded-xl">
                    {generatedMessage}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => copyToClipboard(generatedLink, "Link")}
                    className="flex-1 bg-white border border-sage/30 text-sage py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-sage/5 transition-colors flex justify-center items-center gap-2"
                  >
                    <Link size={16} /> Copy Link Only
                  </button>
                  <button
                    onClick={() => copyToClipboard(generatedMessage, "Full Message")}
                    className="flex-1 bg-sage text-white py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-sage/90 shadow-md transition-colors flex justify-center items-center gap-2"
                  >
                    <MessageSquare size={16} /> Copy Full Message
                  </button>
                </div>

                {copySuccess && (
                  <p className="text-center text-sm font-medium text-sage animate-in fade-in">
                    {copySuccess}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
