"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { editGroupLabelsByLocale } from "../locates/edit-group.labels";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdate: (name: string, description?: string) => Promise<void>;
  onDelete: () => Promise<void>;
  initialName: string;
  initialDescription?: string;
}

export function EditGroupModal({
  open,
  onClose,
  onUpdate,
  onDelete,
  initialName,
  initialDescription,
}: Props) {
  const { locale } = useTranslation();
  const labels = editGroupLabelsByLocale[locale];
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription || "");
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setDescription(initialDescription || "");
      setShowDeleteConfirm(false);
    }
  }, [open, initialName, initialDescription]);

  async function handleUpdate() {
    const trimmedName = name.trim();
    if (!trimmedName || updating) return;

    try {
      setUpdating(true);
      await onUpdate(trimmedName, description.trim() || undefined);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (updating) return;
    try {
      setUpdating(true);
      await onDelete();
    } finally {
      setUpdating(false);
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

                {/* Danger Zone */}
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1.5 text-[10px] font-mono text-red-500/70 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    {labels.delete}
                  </button>
                ) : (
                  <div className="p-3 rounded-sm bg-red-500/5 border border-red-500/20">
                    <p className="text-[10px] font-mono text-red-500/80 mb-3">
                      {labels.deleteConfirm}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-1.5 rounded-sm border border-border text-[10px] font-mono text-muted-foreground hover:text-foreground"
                      >
                        {labels.cancel}
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 py-1.5 rounded-sm bg-red-500 text-white text-[10px] font-mono font-bold hover:bg-red-600"
                      >
                        {labels.delete}
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2 rounded-sm border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
                  >
                    {labels.cancel}
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={!name.trim() || updating}
                    className={cn(
                      "flex-1 py-2 rounded-sm flex items-center justify-center gap-1.5 text-xs font-mono font-bold transition-all",
                      name.trim()
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "bg-muted/30 text-muted-foreground/40 cursor-not-allowed",
                    )}
                  >
                    <Save className="h-3.5 w-3.5" />
                    {updating ? labels.saving : labels.save}
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
