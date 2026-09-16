"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Search, Check, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import type { CommunityUser } from "../types/user.types";
import { addFriendLabelsByLocale } from "../locates/add-friend.labels";

interface Props {
  open: boolean;
  users: CommunityUser[];
  existingUserIds: string[];
  onClose: () => void;
  onAdd: (users: CommunityUser[]) => void;
}

export function AddFriendModal({
  open,
  users,
  existingUserIds,
  onClose,
  onAdd,
}: Props) {
  const { locale } = useTranslation();
  const labels = addFriendLabelsByLocale[locale];
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [added, setAdded] = useState(false);

  const existingSet = useMemo(
    () => new Set(existingUserIds),
    [existingUserIds],
  );

  const availableUsers = useMemo(
    () => users.filter((user) => !existingSet.has(user.id)),
    [existingSet, users],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return availableUsers;
    return availableUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(normalized) ||
        u.username.toLowerCase().includes(normalized),
    );
  }, [availableUsers, query]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleClose() {
    setQuery("");
    setSelected([]);
    setAdded(false);
    onClose();
  }

  function handleAdd() {
    if (selected.length === 0) return;
    const selectedUsers = availableUsers.filter((u) => selected.includes(u.id));
    onAdd(selectedUsers);
    setAdded(true);
    setTimeout(() => {
      handleClose();
    }, 800);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4"
          >
            <div className="glass border border-border rounded-sm w-full max-w-md pointer-events-auto overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h2 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-primary" />
                    {labels.title}
                  </h2>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    {labels.subtitle}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-5 py-4 space-y-4">
                <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-sm bg-card focus-within:border-primary/40 transition-colors">
                  <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={labels.searchPlaceholder}
                    className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
                  />
                </div>

                <div className="space-y-1 max-h-52 overflow-y-auto scrollbar-hide">
                  {filtered.length === 0 ? (
                    <p className="text-[10px] font-mono text-muted-foreground/50 text-center py-3 italic">
                      {labels.noneFound}
                    </p>
                  ) : (
                    filtered.map((u) => {
                      const isSelected = selected.includes(u.id);
                      return (
                        <button
                          key={u.id}
                          onClick={() => toggle(u.id)}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-2 py-2 rounded-sm border text-left transition-all",
                            isSelected
                              ? "border-primary/40 bg-primary/5"
                              : "border-transparent hover:bg-muted/30",
                          )}
                        >
                          <div className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center text-[10px] font-mono font-bold text-foreground shrink-0">
                            {u.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-xs text-foreground">
                              {u.name}
                            </p>
                            <p className="text-[9px] text-muted-foreground">
                              @{u.username}
                            </p>
                          </div>
                          <div
                            className={cn(
                              "w-4 h-4 rounded-[3px] border flex items-center justify-center shrink-0 transition-all",
                              isSelected
                                ? "bg-primary border-primary"
                                : "border-border",
                            )}
                          >
                            {isSelected && (
                              <Check className="h-2.5 w-2.5 text-primary-foreground" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {selected.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap p-2 rounded-sm bg-muted/20 border border-border/50">
                    <Users className="h-3 w-3 text-muted-foreground shrink-0" />
                    {selected.map((id) => {
                      const user = availableUsers.find((u) => u.id === id);
                      if (!user) return null;
                      return (
                        <span
                          key={id}
                          className="flex items-center gap-1 text-[9px] font-mono bg-card border border-border rounded-full px-2 py-0.5"
                        >
                          {user.username}
                          <button
                            onClick={() => toggle(id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-2 rounded-sm border border-border text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {labels.cancel}
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={selected.length === 0 || added}
                    className={cn(
                      "flex-1 py-2 rounded-sm flex items-center justify-center gap-1.5 text-xs font-mono font-bold transition-all",
                      added
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : selected.length > 0
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "bg-muted/30 text-muted-foreground/40 cursor-not-allowed",
                    )}
                  >
                    {added ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> {labels.added}
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3.5 w-3.5" /> {labels.addSelected}{" "}
                        ({selected.length})
                      </>
                    )}
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
