"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { createGroupLabelsByLocale } from "../locates/create-group.labels";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string) => Promise<void>;
}

export function CreateGroupModal({ open, onClose, onCreate }: Props) {
  const { locale } = useTranslation();
  const labels = createGroupLabelsByLocale[locale];
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    const trimmedName = name.trim();
    if (!trimmedName || creating) return;

    try {
      setCreating(true);
      const trimmedDescription = description.trim();
      await onCreate(trimmedName, trimmedDescription || undefined);

      setName("");
      setDescription("");
    } catch {
      // Error already handled and toasted by useGroupManagement
    } finally {
      setCreating(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="glass border border-border rounded-sm w-full max-w-md mx-4 p-6 pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-mono text-sm font-bold text-foreground">
                    {labels.title}
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    {labels.subtitle}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-1.5">
                    {labels.nameLabel}
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={labels.namePlaceholder}
                    className="w-full font-mono text-xs bg-card border border-border rounded-sm px-3 py-2 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-1.5">
                    {labels.descriptionLabel}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={labels.descriptionPlaceholder}
                    rows={2}
                    className="w-full font-mono text-xs bg-card border border-border rounded-sm px-3 py-2 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                {/* Privacy info */}
                <div className="flex items-start gap-2 p-3 rounded-sm bg-primary/5 border border-primary/15">
                  <Lock className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <p className="text-[10px] font-mono text-primary/80 leading-relaxed">
                    {labels.privateInfoPrefix}
                    <strong>{labels.inviteOnly}</strong>
                    {labels.privateInfoSuffix}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2 rounded-sm border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
                  >
                    {labels.cancel}
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!name.trim() || creating}
                    className={cn(
                      "flex-1 py-2 rounded-sm flex items-center justify-center gap-1.5 text-xs font-mono font-bold transition-all",
                      name.trim()
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "bg-muted/30 text-muted-foreground/40 cursor-not-allowed",
                    )}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {creating ? labels.creating : labels.create}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
