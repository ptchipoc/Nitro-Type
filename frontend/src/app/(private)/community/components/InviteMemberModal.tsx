"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Search, Link2, Check, Copy, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import type { CommunityUser } from "@/app/(private)/community/types";
import { inviteMemberLabelsByLocale } from "../locates/invite-member.labels";

interface Props {
  open: boolean;
  groupName: string;
  users: CommunityUser[];
  onSearchUsers?: (query: string) => Promise<CommunityUser[]>;
  onClose: () => void;
  onInvite: (userIds: string[]) => void;
}

export function InviteMemberModal({
  open,
  groupName,
  users,
  onSearchUsers,
  onClose,
  onInvite,
}: Props) {
  const { locale } = useTranslation();
  const labels = inviteMemberLabelsByLocale[locale];
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [searchResults, setSearchResults] = useState<CommunityUser[] | null>(null);
  const [searching, setSearching] = useState(false);
  const searchRequestIdRef = useRef(0);
  const inviteBaseUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite`
      : "https://NT.dev/invite";

  const normalizedQuery = query.trim().toLowerCase();
  const shouldQueryApi = Boolean(onSearchUsers) && normalizedQuery.length >= 3;

  const localFiltered = useMemo(
    () =>
      normalizedQuery
        ? users.filter(
          (u) =>
            u.name.toLowerCase().includes(normalizedQuery) ||
            u.username.toLowerCase().includes(normalizedQuery) ||
            u.avatarUrl.toLowerCase().includes(normalizedQuery)
        )
        : users,
    [normalizedQuery, users],
  );

  useEffect(() => {
    if (!shouldQueryApi || !onSearchUsers) {
      return;
    }

    const requestId = searchRequestIdRef.current + 1;
    searchRequestIdRef.current = requestId;

    const timeoutId = window.setTimeout(() => {
      void onSearchUsers(normalizedQuery)
        .then((results) => {
          if (searchRequestIdRef.current !== requestId) return;
          setSearchResults(results);
        })
        .catch(() => {
          if (searchRequestIdRef.current !== requestId) return;
          setSearchResults([]);
        })
        .finally(() => {
          if (searchRequestIdRef.current !== requestId) return;
          setSearching(false);
        });
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [normalizedQuery, onSearchUsers, shouldQueryApi]);

  const filtered = shouldQueryApi
    ? (searchResults ?? localFiltered)
    : localFiltered;

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleQueryChange(value: string) {
    const normalized = value.trim().toLowerCase();
    if (normalized.length < 3 || !onSearchUsers) {
      searchRequestIdRef.current += 1;
      setSearchResults(null);
      setSearching(false);
    } else {
      setSearching(true);
    }
    setQuery(value);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(
      `${inviteBaseUrl}/${groupName.toLowerCase().replace(/\s/g, "-")}`,
    );
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  function handleSend() {
    if (selected.length === 0) return;
    onInvite(selected);
    setSent(true);
    setTimeout(() => {
      searchRequestIdRef.current += 1;
      setSent(false);
      setSelected([]);
      setQuery("");
      setSearchResults(null);
      setSearching(false);
      onClose();
    }, 900);
  }

  function handleClose() {
    searchRequestIdRef.current += 1;
    setSelected([]);
    setQuery("");
    setSent(false);
    setSearchResults(null);
    setSearching(false);
    onClose();
  }

  const selectedUsers = useMemo(() => {
    const byId = new Map<string, CommunityUser>();
    [...users, ...(searchResults ?? [])].forEach((user) => {
      byId.set(user.id, user);
    });

    return selected
      .map((id) => byId.get(id))
      .filter((user): user is CommunityUser => Boolean(user));
  }, [searchResults, selected, users]);

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
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h2 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-primary" />
                    {labels.title}
                  </h2>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    {labels.subtitle}{" "}
                    <span className="text-foreground font-bold">
                      {groupName}
                    </span>
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
                {/* Invite link */}
                {/* <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">
                    {labels.shareLink}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted/20 border border-border rounded-sm min-w-0">
                      <Link2 className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="font-mono text-[10px] text-muted-foreground truncate">
                        {inviteBaseUrl.replace(/^https?:\/\//, "")}/
                        {groupName.toLowerCase().replace(/\s/g, "-")}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-sm border text-[10px] font-mono shrink-0 transition-all",
                        linkCopied
                          ? "border-green-500/30 text-green-400 bg-green-500/10"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-border/80",
                      )}
                    >
                      {linkCopied ? (
                        <>
                          <Check className="h-3 w-3" /> {labels.copied}
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> {labels.copy}
                        </>
                      )}
                    </button>
                  </div>
                </div> */}

                {/* Search users */}
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">
                    {labels.inviteByUsername}
                  </p>
                  <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-sm bg-card focus-within:border-primary/40 transition-colors mb-2">
                    <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <input
                      value={query}
                      onChange={(e) => handleQueryChange(e.target.value)}
                      placeholder={labels.searchPlaceholder}
                      className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
                    />
                  </div>

                  <div className="space-y-1 max-h-44 overflow-y-auto scrollbar-hide">
                    {filtered.length === 0 ? (
                      <p className="text-[10px] font-mono text-muted-foreground/50 text-center py-3 italic">
                        {searching ? labels.searching : labels.noneFound}
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
                            <div className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center text-[10px] font-mono font-bold text-foreground shrink-0 overflow-hidden">
                              {u.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-xs text-foreground">
                                {u.name}
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
                </div>

                {/* Selected preview
                {selected.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap p-2 rounded-sm bg-muted/20 border border-border/50">
                    <Users className="h-3 w-3 text-muted-foreground shrink-0" />
                    {selectedUsers.map((u) => (
                      <span
                        key={u.id}
                        className="flex items-center gap-1 text-[9px] font-mono bg-card border border-border rounded-full px-2 py-0.5"
                      >
                        {u.name}
                        <button
                          onClick={() => toggle(u.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )} */}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-2 rounded-sm border border-border text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {labels.cancel}
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={selected.length === 0 || sent}
                    className={cn(
                      "flex-1 py-2 rounded-sm flex items-center justify-center gap-1.5 text-xs font-mono font-bold transition-all",
                      sent
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : selected.length > 0
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "bg-muted/30 text-muted-foreground/40 cursor-not-allowed",
                    )}
                  >
                    {sent ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> {labels.sent}
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3.5 w-3.5" /> {labels.inviteSelected}{" "}
                        {selected.length > 0 ? `(${selected.length})` : ""}
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
