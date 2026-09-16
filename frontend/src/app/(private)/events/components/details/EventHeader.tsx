import { motion } from "framer-motion";
import { Crown, ShieldCheck, Lock, Users } from "lucide-react";
import { EventBadge } from "@/components/events/EventBadge";
import { TypingEvent } from "@/features/events/types";

interface EventHeaderProps {
  eventData: TypingEvent;
  labels: {
    official: string;
    casual: string;
    organizedBy: string;
    start: string;
    description: string;
  };
  locale: string;
  participantsCount: number;
}

/**
 * Header section for the event details page.
 * Displays title, organization, status, start time, participant count, and description.
 */
export function EventHeader({
  eventData,
  labels,
  locale,
  participantsCount,
}: EventHeaderProps) {
  const isPublic = eventData.type === "PUBLIC";

  const getCreatorName = () => {
    const name = eventData.participants.find(
      (participant) => participant.userId === eventData.creatorId
    )?.user.name || "";
    return name;
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 rounded-sm border border-border bg-card/40 glass relative overflow-hidden"
    >
      {isPublic && (
        <div className="absolute top-0 right-0 p-3 flex items-center gap-1.5 opacity-20">
          <Crown className="h-12 w-12 text-primary" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <EventBadge value={eventData.status} />
        {isPublic ? (
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-primary uppercase">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{labels.official}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-muted-foreground uppercase opacity-50">
            <Lock className="h-3.5 w-3.5" />
            <span>{labels.casual}</span>
          </div>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-mono font-bold mb-4 tracking-tight leading-tight">
        {eventData.name}
      </h1>

      <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-muted-foreground mb-8">
        <div className="flex items-center gap-2">
          <span className="text-foreground/40">{labels.organizedBy}</span>
          {eventData.type === "PUBLIC" ? (
            <span className="text-primary font-bold">NT</span>
          ) : (
            <span className="text-foreground">{getCreatorName()}</span>
          )}
        </div>
        {eventData.scheduledAt && (
          <div className="flex items-center gap-2">
            <span className="text-foreground/40">{labels.start}</span>
            <span className="text-foreground">
              {new Date(eventData.scheduledAt).toLocaleString(locale)}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5" />
          <span className="text-foreground">
            {participantsCount}
            {eventData.maxParticipants ? ` / ${eventData.maxParticipants}` : ""}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {labels.description}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
          &quot;{eventData.description}&quot;
        </p>
      </div>
    </motion.div>
  );
}
