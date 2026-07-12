import React, { useState, ReactNode, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
} from "motion/react";
import {
  HelpCircle,
  MapPin,
  Clock,
  Heart,
  CheckCircle2,
  Flower2,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react";

// FlipCard Component with 3D Tilt Effect + Premium Mobile Tap Hint
function FlipCard({
  front,
  back,
  className,
  containerClassName,
  rounded = "rounded-[2rem]",
  ...motionProps
}: {
  front: ReactNode;
  back: ReactNode;
  className?: string;
  containerClassName?: string;
  rounded?: string;
  [key: string]: any;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  useEffect(() => {
    const mql = window.matchMedia("(hover: none) and (pointer: coarse)");

    const update = () => setIsTouchDevice(mql.matches);
    update();

    // Safari iOS compatibility
    if (typeof mql.addEventListener === "function") mql.addEventListener("change", update);
    else (mql as any).addListener?.(update);

    return () => {
      if (typeof mql.removeEventListener === "function") mql.removeEventListener("change", update);
      else (mql as any).removeListener?.(update);
    };
  }, []);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsFlipped(false);
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-no-flip]")) return;

    setIsFlipped((prev) => !prev);
  }

  return (
    <motion.div
      {...motionProps}
      ref={cardRef}
      className={`perspective-1000 cursor-pointer relative ${containerClassName || ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        if (!isTouchDevice) setIsFlipped(true);
      }}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        rotateX: isFlipped ? 0 : springRotateX,
        rotateY: isFlipped ? 0 : springRotateY,
      }}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className={`w-full h-full transform-style-3d relative ${className || ""}`}
        style={{ WebkitTransformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 backface-hidden flip-face w-full h-full ${rounded} overflow-hidden shadow-2xl border border-white/40 ring-1 ring-black/5`}
          style={{ transform: "rotateY(0deg) translateZ(1px)", WebkitTransform: "rotateY(0deg) translateZ(1px)" }}
        >
          {front}
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-white/30 rounded-tl-lg" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-white/30 rounded-br-lg" />
        </div>

        {/* Back */}
        <div
          style={{ transform: "rotateY(180deg) translateZ(1px)", WebkitTransform: "rotateY(180deg) translateZ(1px)" }}
          className={`absolute inset-0 backface-hidden flip-face w-full h-full bg-paper border border-sage/20 ${rounded} flex flex-col justify-center items-center text-center p-3 md:p-8 shadow-2xl overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none" />
          <div className="absolute top-5 left-5 w-10 h-10 border-t-2 border-l-2 border-sage/10 rounded-tl-xl" />
          <div className="absolute bottom-5 right-5 w-10 h-10 border-b-2 border-r-2 border-sage/10 rounded-br-xl" />
          <div className="relative z-10 w-full h-full flex flex-col py-4 overflow-y-auto overflow-x-hidden ios-scroll">{back}</div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isTouchDevice && !isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.4 } }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none z-50"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex items-center gap-2 bg-black/35 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/25 shadow-xl"
            >
              <span className="relative flex items-center justify-center w-4 h-4 shrink-0">
                <motion.span
                  animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-white/70"
                />
                <span className="relative w-2 h-2 rounded-full bg-white shadow-sm" />
              </span>
              <span
                className="text-white text-[9px] uppercase tracking-[0.2em] font-bold whitespace-nowrap"
                style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.18em" }}
              >
                Tap to reveal
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RealisticPetal({ size = 20, className = "" }: { size?: number; className?: string }) {
  const organicPetal = "M15 30C15 30 0 25 0 15C0 5 10 0 15 0C20 0 30 5 30 15C30 25 15 30 15 30Z";

  return (
    <motion.div
      animate={{
        rotateX: [0, 45, -45, 0],
        rotateY: [0, 180, 360],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ width: size, height: size }}
      className={className}
    >
      <svg width="100%" height="100%" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="petalGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B5955C" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#8B7345" stopOpacity="0.65" />
          </radialGradient>
        </defs>
        <path
          d={organicPetal}
          fill="url(#petalGrad)"
          style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.05))" }}
        />
      </svg>
    </motion.div>
  );
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date("2026-12-05T11:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-3 md:gap-6 mt-6 md:mt-8">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-14 h-16 md:w-20 md:h-24 bg-[#ffffff] rounded-xl md:rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#D4C19C]/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
            <span className="serif text-2xl md:text-4xl text-[#332A19] font-medium z-10">{item.value.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-[9px] md:text-xs uppercase tracking-[0.2em] text-[#8B7345] font-semibold mt-3 md:mt-4">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

type Attendance = "yes" | "no";
type PartyType = "individual" | "family";
type MealPreference = "veg" | "non-veg";

type GuestEntry = {
  name: string;
  meal: MealPreference;
};

function RSVPForm() {
  const endpoint = (import.meta as any).env?.VITE_RSVP_ENDPOINT as string | undefined;

  const [attendance, setAttendance] = useState<Attendance>("yes");
  const [partyType, setPartyType] = useState<PartyType>("individual");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [guests, setGuests] = useState<GuestEntry[]>([{ name: "", meal: "non-veg" }]);

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAttending = attendance === "yes";
  const effectiveGuestCount = partyType === "family" ? Math.max(2, guestCount) : 1;

  useEffect(() => {
    if (partyType === "individual") {
      setGuestCount(1);
      setGuests((prev) => [prev[0] ?? { name: "", meal: "non-veg" }]);
      return;
    }

    setGuestCount((c) => (c < 2 ? 2 : c));
  }, [partyType]);

  useEffect(() => {
    const desiredCount = partyType === "family" ? Math.max(2, guestCount) : 1;
    setGuests((prev) => {
      if (prev.length === desiredCount) return prev;
      const next = prev.slice(0, desiredCount);
      while (next.length < desiredCount) next.push({ name: "", meal: "non-veg" });
      return next;
    });
  }, [guestCount, partyType]);

  function updateGuest(index: number, patch: Partial<GuestEntry>) {
    setGuests((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  }

  function validate(): string | null {
    const primaryName = guests[0]?.name?.trim();
    if (!primaryName) return "Please enter your name.";
    if (attendance === "no") return null;

    const missingName = guests.some((g) => !g.name.trim());
    if (missingName) return "Please enter all guest names.";

    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!endpoint) {
      setErrorMessage("RSVP saving is not configured yet (missing VITE_RSVP_ENDPOINT).");
      return;
    }

    const payload = {
      attendance,
      partyType,
      guestCount: isAttending ? effectiveGuestCount : 0,
      guests: isAttending ? guests : [guests[0]],
      submittedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      // Try JSON request first (works if endpoint supports CORS).
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSuccessMessage("RSVP saved. Thank you!");
    } catch {
      try {
        // Fallback for Apps Script deployments without CORS.
        const fd = new FormData();
        fd.append("payload", JSON.stringify(payload));
        await fetch(endpoint, { method: "POST", mode: "no-cors", body: fd });
        setSuccessMessage("RSVP submitted. Thank you!");
      } catch {
        setErrorMessage("Could not submit RSVP. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div data-no-flip className="w-full cursor-auto">
      <CheckCircle2 size={24} className="text-sage mb-2 md:mb-4 mx-auto opacity-70 md:w-8 md:h-8" />
      <h4 className="serif text-2xl md:text-3xl text-sage mb-2 md:mb-3 text-center">RSVP</h4>
      <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mb-4 md:mb-6 text-center leading-relaxed">
        Please let us know by
        <br />
        30.09.2026
      </p>

      <form onSubmit={submit} className="space-y-4 md:space-y-4 px-1 md:px-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            data-no-flip
            onClick={() => setAttendance("yes")}
            className={`py-3 md:py-2.5 rounded-xl text-[10px] md:text-xs uppercase tracking-widest font-bold border transition-colors ${attendance === "yes" ? "bg-sage text-white border-sage" : "bg-white/40 text-sage border-sage/30"
              }`}
          >
            Attending
          </button>
          <button
            type="button"
            data-no-flip
            onClick={() => setAttendance("no")}
            className={`py-3 md:py-2.5 rounded-xl text-[10px] md:text-xs uppercase tracking-widest font-bold border transition-colors ${attendance === "no" ? "bg-zinc-800 text-white border-zinc-800" : "bg-white/40 text-zinc-700 border-zinc-300/60"
              }`}
          >
            Not Attending
          </button>
        </div>

        <div className={`grid grid-cols-2 gap-2 ${!isAttending ? "opacity-60 pointer-events-none" : ""}`}>
          <button
            type="button"
            data-no-flip
            onClick={() => setPartyType("individual")}
            className={`py-3 md:py-2 rounded-xl text-[10px] md:text-xs uppercase tracking-widest font-bold border transition-colors ${partyType === "individual" ? "bg-sage/90 text-white border-sage" : "bg-white/40 text-sage border-sage/30"
              }`}
          >
            Individual
          </button>
          <button
            type="button"
            data-no-flip
            onClick={() => setPartyType("family")}
            className={`py-3 md:py-2 rounded-xl text-[10px] md:text-xs uppercase tracking-widest font-bold border transition-colors ${partyType === "family" ? "bg-sage/90 text-white border-sage" : "bg-white/40 text-sage border-sage/30"
              }`}
          >
            Family
          </button>
        </div>

        {isAttending && partyType === "family" && (
          <div className="flex items-center justify-between gap-3">
            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-zinc-600">Family Count</label>
            <input
              data-no-flip
              type="number"
              min={2}
              max={12}
              value={effectiveGuestCount}
              onChange={(ev) => setGuestCount(Number(ev.target.value || 2))}
              className="w-28 rounded-xl border border-sage/20 bg-white/60 px-3 py-2.5 text-xs text-zinc-700 outline-none"
            />
          </div>
        )}

        <div className="space-y-2">
          {(isAttending ? guests : [guests[0]]).map((guest, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-2">
              <input
                data-no-flip
                value={guest?.name ?? ""}
                onChange={(ev) => updateGuest(idx, { name: ev.target.value })}
                placeholder={
                  isAttending
                    ? partyType === "family"
                      ? `Guest ${idx + 1} name`
                      : "Your name"
                    : "Your name"
                }
                className="w-full rounded-xl border border-sage/20 bg-white/60 px-3 py-2.5 text-xs text-zinc-700 outline-none"
              />

              <select
                data-no-flip
                disabled={!isAttending}
                value={guest?.meal ?? "non-veg"}
                onChange={(ev) => updateGuest(idx, { meal: ev.target.value as MealPreference })}
                className={`w-full rounded-xl border border-sage/20 bg-white/60 px-3 py-2.5 text-xs text-zinc-700 outline-none ${!isAttending ? "opacity-60" : ""
                  }`}
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            </div>
          ))}
        </div>

        {errorMessage && <p className="text-[10px] md:text-xs text-red-700 font-semibold">{errorMessage}</p>}
        {successMessage && <p className="text-[10px] md:text-xs text-sage font-bold">{successMessage}</p>}

        <button
          type="submit"
          data-no-flip
          disabled={submitting}
          className="w-full bg-sage text-white py-3 md:py-3 rounded-xl text-[10px] md:text-xs uppercase tracking-widest font-bold disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit RSVP"}
        </button>

        {!endpoint && (
          <p className="text-[10px] md:text-[10px] text-zinc-500 leading-relaxed">
            Admin setup needed: set <span className="font-bold">VITE_RSVP_ENDPOINT</span> to your Google Apps Script URL.
          </p>
        )}
      </form>
    </div>
  );
}

export default function App() {
  const [isFlapOpen, setIsFlapOpen] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const updateSize = () => setIsSmallScreen(mediaQuery.matches);
    updateSize();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateSize);
      return () => mediaQuery.removeEventListener("change", updateSize);
    }

    // iOS Safari < 14
    mediaQuery.addListener(updateSize);
    return () => mediaQuery.removeListener(updateSize);
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setPrefersReducedMotion(motionQuery.matches);
    updateMotion();
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", updateMotion);
      return () => motionQuery.removeEventListener("change", updateMotion);
    }
    motionQuery.addListener(updateMotion);
    return () => motionQuery.removeListener(updateMotion);
  }, []);

  const isIOS =
    typeof navigator !== "undefined" &&
    (/iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1));

  const reduceEffects = prefersReducedMotion || isIOS;

  const handleOpen = () => {
    setIsOpened(true);
    setIsMuted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = isMuted;

    if (isMuted) {
      audio.pause();
      return;
    }

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // iOS/Safari may block playback until a user gesture; the button tap will retry.
      });
    }
  }, [isMuted]);

  return (
    <div
      className="min-h-screen bg-paper text-zinc-800 selection:bg-sage/20 overflow-x-hidden relative"
    >
      <audio ref={audioRef} src="/song.mp3" loop preload="auto" />

      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-sage origin-left z-[1000]" style={{ scaleX }} />



      <AnimatePresence>
        {!isOpened && !showVideo && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 z-[110] bg-[#ffffff] flex flex-col items-center justify-center overflow-hidden"
          >
             <div className="absolute inset-0 opacity-[0.25] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] pointer-events-none" />
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ffffff]/60 via-transparent to-transparent pointer-events-none" />

             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.2, delay: 0.2 }}
               className="flex flex-col items-center z-10 px-4"
             >
                <img src="/images/logo.png" alt="Z&H Logo" className="w-20 h-20 md:w-28 md:h-28 object-contain mb-8 opacity-90" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 md:w-20 h-[1px] bg-[#B5955C]/60" />
                  <h2 className="serif text-xs md:text-sm text-[#8B7345] tracking-[0.4em] uppercase font-bold">
                    You are invited
                  </h2>
                  <div className="w-12 md:w-20 h-[1px] bg-[#B5955C]/60" />
                </div>

                <h1 className="script text-[50px] sm:text-[70px] md:text-[90px] text-[#332A19] mb-12 drop-shadow-sm text-center leading-[1.1]">
                  Stephen & Krishani
                </h1>
                
                <button
                  onClick={() => {
                    setShowVideo(true);
                    setIsMuted(false);
                  }}
                  className="px-10 py-4 bg-[#ffffff] border border-[#B5955C]/40 text-[#332A19] rounded-full uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#f5f5f5] hover:scale-105 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                  View Invitation
                </button>
             </motion.div>
          </motion.div>
        )}

        {!isOpened && showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8 } }}
            exit={{ opacity: 0, transition: { duration: 0.8, delay: 0.2 } }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden cursor-pointer"
            onClick={handleOpen}
          >
            <video
              src="/intro-video.mp4"
              autoPlay
              muted
              playsInline
              onEnded={handleOpen}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/background1.png" alt="Background" className="w-full h-full object-cover opacity-[0.35] md:opacity-[0.45]" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-transparent to-paper/40" />
      </div>

      <motion.main
        initial={false}
        animate={isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="max-w-[1600px] mx-auto px-4 py-10 sm:py-12 md:px-12 md:py-24 flex flex-col gap-10 md:gap-16 relative z-10 min-h-screen"
      >

        {/* Hero Invitation Section */}
        <div className="flex flex-col items-center justify-center w-full mb-12 mt-16 md:mt-24 relative px-4">
          {!isOpened ? (
            <div className="w-full max-w-3xl relative h-[340px] sm:h-[380px] md:h-[460px]" />
          ) : (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-xl md:max-w-2xl relative"
            >
              <div className="relative bg-[#ffffff] rounded-t-full rounded-b-3xl md:rounded-t-[240px] md:rounded-b-[40px] shadow-2xl border-4 border-[#D4C19C]/40 overflow-hidden min-h-[550px] md:min-h-[650px] flex flex-col items-center pt-20 md:pt-28 pb-16 px-6 md:px-12">
                {/* Background texture */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] pointer-events-none" />

                {/* Top curved text approximation */}
                <div className="absolute top-10 w-full flex justify-center pointer-events-none">
                   <p className="serif text-[9px] md:text-[11px] tracking-[0.25em] text-[#8B7345] uppercase opacity-70 font-semibold">
                     Together with their families
                   </p>
                </div>
                
                <div className="flex flex-col items-center text-center w-full z-10 mt-6">
                  <img src="/images/logo.png" alt="Z&H Logo" className="w-20 h-20 md:w-28 md:h-28 object-contain mb-8 opacity-90" />
                  
                  <div className="flex flex-col items-center gap-2 md:gap-4 mb-10">
                    <span className="script text-[50px] md:text-[76px] text-[#332A19] leading-[0.9] drop-shadow-sm">Stephen</span>
                    <span className="serif text-xl md:text-3xl text-[#B5955C] italic font-light">&amp;</span>
                    <span className="script text-[50px] md:text-[76px] text-[#332A19] leading-[0.9] drop-shadow-sm">Krishani</span>
                  </div>

                  <p className="serif text-[10px] md:text-xs tracking-[0.2em] text-[#8B7345] uppercase max-w-[220px] md:max-w-sm mb-12 leading-relaxed font-medium">
                    Invite you to share in the celebration of their marriage
                  </p>

                  {/* Interlocking Rings SVG */}
                  <div className="flex items-center justify-center">
                     <svg width="64" height="42" viewBox="0 0 48 32" className="drop-shadow-md opacity-80">
                        <circle cx="18" cy="16" r="10" stroke="#B5955C" strokeWidth="2.5" fill="none" />
                        <circle cx="30" cy="16" r="10" stroke="#E5D3B3" strokeWidth="2.5" fill="none" />
                     </svg>
                  </div>
                </div>
              </div>

              {/* Music Seal Button - Repositioned for Hero section */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted((m) => !m);
                }}
                className="absolute -bottom-6 -right-2 md:-bottom-10 md:-right-6 z-[70] w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#B5955C] shadow-2xl flex items-center justify-center border-[3px] border-[#8B7345] group hover:scale-105 transition-transform"
              >
                {/* Vinyl record grooves */}
                <div className="absolute inset-1 rounded-full border border-white/10" />
                <div className="absolute inset-2.5 rounded-full border border-white/5" />
                <div className="absolute inset-4 rounded-full border border-white/10" />
                <div className="absolute inset-5.5 rounded-full border border-white/5" />
                
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]">
                  <path id="curve" d="M 15,50 A 35,35 0 1,1 85,50 A 35,35 0 1,1 15,50" fill="transparent" />
                  <text className="text-[10px] md:text-[11px] fill-[#D4C19C] font-serif tracking-[0.15em] uppercase font-bold">
                    <textPath href="#curve" startOffset="50%" textAnchor="middle">
                      Click to play music
                    </textPath>
                  </text>
                </svg>

                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#B5955C] flex items-center justify-center z-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] border border-[#E5D3B3]/50">
                  {isMuted ? (
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#332A19] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  ) : (
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#332A19]" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  )}
                </div>
              </button>
            </motion.div>
          )}

          {isOpened && (
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2 }}
                className="mt-12 mb-8 text-center flex flex-col items-center z-20"
             >
                <p className="serif text-xs md:text-sm text-umber/70 tracking-[0.25em] uppercase font-semibold mb-2">
                  Counting days until
                </p>
                <p className="serif italic text-2xl md:text-3xl text-umber/80 tracking-widest font-light">
                  we say "I Do"
                </p>
                <Countdown />
             </motion.div>
          )}
        </div>

        {/* Event Details Section - Matching Provided UI */}
        <div className="w-full flex flex-col items-center mt-12 mb-10 relative z-20 text-center">
          {/* Venue image */}
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-10 w-full max-w-lg md:max-w-2xl px-6"
          >
             <img 
               src="https://lakpura.com/cdn/shop/files/LK1500D2C9-01-E.jpg?v=1692087200" 
               alt="The Grand Hotel Nuwara Eliya" 
               className="w-full h-auto object-cover opacity-95 shadow-2xl rounded-2xl md:rounded-[2rem] border-4 border-white/40" 
             />
          </motion.div>

          <motion.h2 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="script text-[50px] md:text-[70px] text-zinc-700 drop-shadow-sm mb-6"
          >
            Ceremony & Reception
          </motion.h2>
          
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="flex flex-col items-center w-full max-w-sm mx-auto mb-12 relative px-4"
          >
            <div className="w-full py-8 md:py-10 flex flex-col items-center bg-[#ffffff]/80 backdrop-blur-md border border-[#D4C19C]/40 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
               
               <div className="flex flex-col items-center space-y-6 md:space-y-8 z-10 w-full px-6">
                 
                 <div className="flex flex-col items-center text-center">
                   <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#8B7345] font-semibold mb-2">When</p>
                   <p className="serif italic text-xl md:text-2xl text-[#332A19]">Saturday</p>
                   <p className="serif text-xs md:text-sm text-[#332A19] tracking-widest uppercase mt-2">December 5th, 2026</p>
                 </div>

                 <div className="w-16 h-[1px] bg-[#B5955C]/30" />

                 <div className="flex flex-col items-center text-center">
                   <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#8B7345] font-semibold mb-2">Time</p>
                   <p className="serif italic text-xl md:text-2xl text-[#332A19]">Begins at 11:00 AM</p>
                 </div>

                 <div className="w-16 h-[1px] bg-[#B5955C]/30" />

                 <div className="flex flex-col items-center text-center">
                   <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#8B7345] font-semibold mb-2">Where</p>
                   <p className="serif text-lg md:text-xl text-[#332A19] tracking-widest uppercase">The Grand Hotel</p>
                   <p className="serif italic text-sm md:text-base text-[#332A19]/80 mt-1">Nuwara Eliya</p>
                 </div>
                 
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open("https://maps.app.goo.gl/ZnnLSGLFKRhb4U7N6", "_blank")}
            className="flex items-center gap-4 cursor-pointer mb-16"
          >
             <div className="text-[50px] md:text-[60px] drop-shadow-lg -mt-2">📍</div>
             <p className="serif uppercase tracking-widest text-[10px] md:text-xs max-w-[200px] text-zinc-700 leading-loose text-left font-semibold">
               Click the map to<br/>get the direction<br/>of the venue
             </p>
          </motion.div>


          
          <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="w-full max-w-md mx-auto"
          >
            <RSVPForm />
          </motion.div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={isOpened ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5, delay: 2 }}
          className="text-center pt-12 pb-12 space-y-6"
        >
          <div className="flex items-center justify-center gap-6 text-sage/40">
            <div className="h-px w-16 bg-current" />
            <span className="text-xs uppercase tracking-[0.6em] font-medium">Est. 2026</span>
            <div className="h-px w-16 bg-current" />
          </div>
          <p className="serif italic text-zinc-500 text-xl max-w-lg mx-auto leading-relaxed">
            "Love brought us together, made more beautiful with your presence"
          </p>
          <p className="serif text-sage/60 text-sm italic">We can't wait to celebrate with you</p>

        </motion.footer>
      </motion.main>

      {/* Heavy background motion removed for iOS stability */}
    </div>
  );
}