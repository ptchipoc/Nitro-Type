import { motion } from "framer-motion";
import { Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/events/CountdownTimer";
import { cn } from "@/lib/utils";
import { EventStatus } from "@/lib/api/endpoints/events/event.type";

interface JoinCardProps {
  eventData: {
    status: EventStatus;
    scheduledAt?: string | Date;
  };
  isParticipant: boolean;
  isCreator: boolean;
  labels: {
    lobbyActive: string;
    joinEvent: string;
  };
  onSchedule: () => void;
  isScheduling: boolean;
}

/**
 * Action card for the event details page.
 * Handles event scheduling and displays the countdown timer.
 * Note: Start and Join logic is currently commented out in the implementation.
 */
export function JoinCard({
  eventData,
  isParticipant,
  isCreator,
  labels,
  onSchedule,
  isScheduling,
}: JoinCardProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "p-6 rounded-sm border glass overflow-hidden flex flex-col items-center text-center",
          isParticipant
            ? "border-primary/40 bg-primary/5"
            : "border-border bg-card/40",
        )}
      >
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">
          {eventData.status === EventStatus.ACTIVE
            ? "Evento em curso"
            : isParticipant
              ? labels.lobbyActive
              : labels.joinEvent}
        </div>

        {eventData.scheduledAt && !isCreator && (
          <div className="mb-6">
            <CountdownTimer
              targetDate={
                typeof eventData.scheduledAt === "string"
                  ? eventData.scheduledAt
                  : eventData.scheduledAt.toISOString()
              }
              variant="normal"
            />
          </div>
        )}
      </motion.div>

      {eventData.status === EventStatus.DRAFT && (
        <Button
          className="w-full h-12 font-mono font-bold bg-primary hover:bg-primary/90 text-primary-foreground group"
          onClick={onSchedule}
          disabled={isScheduling}
        >
          {isScheduling ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Calendar className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
          )}
          Agendar Evento
        </Button>
      )}
    </>
  );
}
