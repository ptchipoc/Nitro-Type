"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Zap,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n";
import { CountdownTimer } from "./CountdownTimer";
import { usePublicEvents } from "../hooks/use-public-events";
import { useEvents } from "../hooks/use-events";

interface EventsCarouselProps {
  locale: Locale;
  labels: {
    featuredOfficial: string;
    basePrize: string;
    participants: string;
    joinNow: string;
    viewDetails: string;
    startsIn: string;
    xpValid: string;
  };
}

export function EventsCarousel({ labels }: EventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { data: result } = useEvents();
  const allEvents = result?.data || [];
  const events = allEvents.filter((event) => event.status !== "FINISHED");

  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [events.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % events.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);

  if (events.length === 0) return null;

  const currentEvent = events[currentIndex];

  // console.log("events:", events );
  if (result?.success === false) {
    return (
      <div className="p-8 rounded-sm border border-primary/30 bg-card/60 glass text-center">
        <p className="text-center text-red-500">
          Failed to load events. Please try again later.
        </p>
      </div>
    );
  }
  return (
    <div className="relative group mb-12">
      <AnimatePresence mode="wait">
        <motion.section
          key={currentEvent.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative p-8 rounded-sm border border-primary/30 bg-card/60 glass overflow-hidden min-h-[400px] flex items-center"
        >
          {/* Background Accent */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 w-full">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-widest">
                  <Trophy className="h-3 w-3" />
                  {labels.featuredOfficial}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-mono font-bold mb-4 leading-tight tracking-tight">
                {currentEvent.name}
              </h1>

              <p className="text-muted-foreground mb-6 max-w-xl leading-relaxed italic">
                &quot;{currentEvent.description}&quot;
              </p>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
                    {labels.basePrize}
                  </span>
                  <div className="flex items-center gap-2 text-primary font-mono font-bold">
                    <Zap className="h-4 w-4" />
                    <span>{currentEvent.baseXp}</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
                    {labels.participants}
                  </span>
                  <div className="font-mono font-bold text-foreground">
                    {currentEvent.participants.length} /{" "}
                    {currentEvent.maxParticipants || "∞"}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-foreground text-primary-foreground font-mono font-bold h-12 px-8"
                  onClick={() => router.push(`/events/${currentEvent.id}`)}
                >
                  {labels.joinNow}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 font-mono border-primary/30 hover:bg-primary/5"
                  onClick={() => router.push(`/events/${currentEvent.id}`)}
                >
                  {labels.viewDetails}
                </Button>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex flex-col items-center p-6 rounded-sm border border-border bg-card/40 min-w-[240px]">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">
                {labels.startsIn}
              </span>
              {currentEvent.scheduledAt && (
                <CountdownTimer targetDate={currentEvent.scheduledAt} />
              )}
              <div className="mt-6 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-primary" />
                {labels.xpValid} xxxxxx
              </div>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Navigation Controls */}
      {events.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/50 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/50 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-primary w-8"
                    : "bg-primary/20 w-4 hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
