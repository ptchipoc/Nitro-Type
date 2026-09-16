import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { ParticipantList } from "@/components/events/ParticipantList";
import { EventParticipant } from "@/features/events/types";

interface ParticipantsLobbyProps {
  participants: EventParticipant[];
  labels: {
    lobbyChatActive: string;
  };
}
export function ParticipantsLobby({
  participants,
  labels,
}: ParticipantsLobbyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-6 rounded-sm border border-border bg-card/20 min-h-[300px]"
    >
      <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-card rounded-sm border border-border">
        <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] font-mono text-muted-foreground">
          {labels.lobbyChatActive}
        </span>
      </div>
      <ParticipantList participants={participants} />
    </motion.div>
  );
}
