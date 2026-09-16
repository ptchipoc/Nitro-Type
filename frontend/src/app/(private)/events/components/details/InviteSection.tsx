import { motion } from "framer-motion";
import { Mail, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InviteSectionProps {
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  onInvite: () => void;
  isInviting: boolean;
  labels: {
    inviteParticipants: string;
    inviteEmailPlaceholder: string;
    inviteButton: string;
  };
}

/**
 * Section for inviting users to the event.
 * Includes an email input and a submission button.
 */
export function InviteSection({
  inviteEmail,
  setInviteEmail,
  onInvite,
  isInviting,
  labels,
}: InviteSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-sm border border-primary/20 bg-primary/5 space-y-6"
    >
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-primary" />
        <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
          {labels.inviteParticipants}
        </h4>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder={labels.inviteEmailPlaceholder}
            className="w-full bg-background/50 border border-border rounded-sm px-3 py-2 text-xs outline-none focus:border-primary/50"
            onKeyDown={(e) => e.key === "Enter" && onInvite()}
          />
        </div>
        <Button
          className="w-full h-9 text-[10px] font-bold uppercase tracking-widest"
          onClick={onInvite}
          disabled={isInviting || !inviteEmail}
        >
          {isInviting ? (
            <Loader2 className="w-3 h-3 animate-spin mr-2" />
          ) : (
            <Plus className="w-3 h-3 mr-2" />
          )}
          {labels.inviteButton}
        </Button>
      </div>
    </motion.div>
  );
}
