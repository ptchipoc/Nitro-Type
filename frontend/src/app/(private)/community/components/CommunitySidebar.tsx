"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Plus, Search, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { InviteMemberModal } from "./InviteMemberModal";
import { useTranslation } from "@/lib/i18n";
import { formatRelativeTime } from "../utils/format-relative-time";
import { communitySidebarLabelsByLocale } from "../locates/community-sidebar.labels";
import {
  ChannelRow,
  DMRow,
  SectionLabel,
} from "./CommunitySidebarParts";
import type {
  CommunityChannel,
  DirectMessage,
  CommunityUser,
} from "../types";

interface Props {
  platformChannels: CommunityChannel[];
  privateGroups: CommunityChannel[];
  dms: DirectMessage[];
  users: CommunityUser[];
  actionNotice?: {
    kind: "success" | "error" | "info";
    message: string;
  } | null;
  onClearNotice?: () => void;
  pendingInvites?: Array<{
    code: string;
    channelName: string;
    expiresAt: string;
  }>;
  invitesLoading?: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onCreateGroup: () => void;
  onInviteToGroup?: (groupId: string, userIds: string[]) => void;
  onSearchUsers?: (query: string) => Promise<CommunityUser[]>;
  onAcceptInvite?: (code: string) => Promise<void> | void;
  onRejectInvite?: (code: string) => Promise<void> | void;
  onAddDirectFriends?: (users: CommunityUser[]) => void;
}

export function CommunitySidebar({
  platformChannels,
  privateGroups,
  dms,
  users,
  actionNotice = null,
  onClearNotice,
  pendingInvites = [],
  invitesLoading = false,
  selectedId,
  onSelect,
  onCreateGroup,
  onInviteToGroup,
  onSearchUsers,
  onAcceptInvite,
  onRejectInvite,
  onAddDirectFriends,
}: Props) {
  const { locale } = useTranslation();
  const labels = communitySidebarLabelsByLocale[locale];
  const [inviteGroup, setInviteGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CommunityUser[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const searchRequestIdRef = useRef(0);
  const usersRef = useRef(users);

  const normalizedQuery = query.trim().toLowerCase();
  const hasQuery = normalizedQuery.length > 0;
  const dmUserIds = useMemo(() => new Set(dms.map((dm) => dm.userId)), [dms]);

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  useEffect(() => {
    if (!searchOpen) {
      searchRequestIdRef.current += 1;
      setSearchingUsers(false);
      setSearchResults([]);
      return;
    }

    const localUsers = usersRef.current;
    const shouldQueryApi = Boolean(onSearchUsers) && normalizedQuery.length >= 3;

    if (!shouldQueryApi) {
      setSearchingUsers(false);
      setSearchResults(
        !normalizedQuery
          ? localUsers
          : localUsers.filter(
            (user) =>
              user.name.toLowerCase().includes(normalizedQuery) ||
              user.username.toLowerCase().includes(normalizedQuery)
          ),
      );
      return;
    }

    const requestId = searchRequestIdRef.current + 1;
    searchRequestIdRef.current = requestId;
    setSearchingUsers(true);

    const timeoutId = window.setTimeout(() => {
      if (!onSearchUsers) {
        setSearchResults([]);
        setSearchingUsers(false);
        return;
      }
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
          setSearchingUsers(false);
        });
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [normalizedQuery, onSearchUsers, searchOpen]);

  const matchChannel = (channel: CommunityChannel) =>
    channel.name.toLowerCase().includes(normalizedQuery) ||
    channel.description.toLowerCase().includes(normalizedQuery);
  const matchDM = (dm: DirectMessage) =>
    dm.name.toLowerCase().includes(normalizedQuery) ||
    dm.username.toLowerCase().includes(normalizedQuery) ||
    dm.lastMessage.toLowerCase().includes(normalizedQuery);

  const filteredPlatformChannels = hasQuery
    ? platformChannels.filter(matchChannel)
    : platformChannels;
  const filteredPrivateGroups = hasQuery
    ? privateGroups.filter(matchChannel)
    : privateGroups;
  const filteredDMs = hasQuery ? dms.filter(matchDM) : dms;
  const filteredSearchUsers = searchResults.filter((user) => {
    if (!hasQuery) return true;

    return (
      user.name.toLowerCase().includes(normalizedQuery) ||
      user.username.toLowerCase().includes(normalizedQuery)
    );
  });

  const noResults =
    hasQuery &&
    filteredPlatformChannels.length === 0 &&
    filteredPrivateGroups.length === 0 &&
    filteredDMs.length === 0 &&
    filteredSearchUsers.length === 0 &&
    !searchingUsers;

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-full overflow-hidden"
      >
        {/* Header */}
        <div className="px-3 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-sm bg-primary/20 border border-primary/30 flex items-center justify-center">
                <MessageCircle className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-mono text-sm font-bold text-foreground">
                {labels.community}
              </span>
            </div>
            <button
              onClick={() => {
                setSearchOpen((prev) => {
                  const next = !prev;
                  if (!next) {
                    setQuery("");
                  }
                  return next;
                });
              }}
              className={cn(
                "p-1 rounded-sm transition-colors",
                searchOpen
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted/50",
              )}
              title={labels.search}
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
          {searchOpen && (
            <div className="flex items-center gap-2 px-2 py-2 mt-2 border border-border rounded-sm bg-card focus-within:border-primary/40 transition-colors">
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={labels.searchPlaceholder}
                className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
              />
            </div>
          )}
          {searchOpen && (
            <div className="mt-2 max-h-40 overflow-y-auto pr-1">
              <p className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-muted-foreground/70">
                {labels.users}
              </p>
              {searchingUsers ? (
                <p className="text-[10px] text-muted-foreground/50 font-mono px-2 py-1.5 italic">
                  {labels.searchingUsers}
                </p>
              ) : filteredSearchUsers.length === 0 ? (
                <p className="text-[10px] text-muted-foreground/50 font-mono px-2 py-1.5 italic">
                  {labels.noUsersFound}
                </p>
              ) : (
                <div className="space-y-1">
                  {filteredSearchUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onAddDirectFriends?.([user]);
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-left transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      title={labels.openDm}
                    >
                      <div className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-[9px] font-mono font-bold text-foreground shrink-0 overflow-hidden">
                        {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" /> : user.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs text-foreground truncate">
                          {user.name}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-primary shrink-0">
                        {dmUserIds.has(user.id) ? labels.openDm : labels.startDm}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-2 py-2">
          {/* Platform Channels */}
          <SectionLabel label={labels.platform} />
          {filteredPlatformChannels.map((ch) => (
            <ChannelRow
              key={ch.id}
              channel={ch}
              selected={selectedId === ch.id}
              onClick={() => onSelect(ch.id)}
            />
          ))}

          {/* My Groups */}
          <SectionLabel
            label={labels.myGroups}
            action={
              <button
                onClick={onCreateGroup}
                className="p-0.5 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-primary transition-colors"
                title={labels.createGroup}
              >
                <Plus className="h-3 w-3" />
              </button>
            }
          />
          {filteredPrivateGroups.length === 0 && !hasQuery ? (
            <p className="text-[10px] text-muted-foreground/50 font-mono px-2 py-1.5 italic">
              {labels.noGroups}
            </p>
          ) : (
            filteredPrivateGroups.map((ch) => (
              <ChannelRow
                key={ch.id}
                channel={ch}
                selected={selectedId === ch.id}
                onClick={() => onSelect(ch.id)}
                inviteLabel={labels.inviteMembers}
                onInvite={() => setInviteGroup({ id: ch.id, name: ch.name })}
              />
            ))
          )}

          {/* Pending invites */}
          <SectionLabel label={labels.pendingInvites} />
          {invitesLoading ? (
            <p className="text-[10px] text-muted-foreground/50 font-mono px-2 py-1.5 italic">
              {labels.loadingInvites}
            </p>
          ) : pendingInvites.length === 0 ? (
            <p className="text-[10px] text-muted-foreground/50 font-mono px-2 py-1.5 italic">
              {labels.noInvites}
            </p>
          ) : (
            pendingInvites.map((invite) => (
              <div
                key={invite.code}
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm border border-border/50 bg-muted/20"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] text-foreground truncate">
                    {invite.channelName}
                  </p>
                  <p className="text-[9px] text-muted-foreground/70 truncate">
                    {formatRelativeTime(invite.expiresAt, locale)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    Promise.resolve(onAcceptInvite?.(invite.code)).catch(() => { });
                  }}
                  className="inline-flex items-center gap-1 px-1.5 py-1 rounded-sm border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                  title={labels.acceptInvite}
                >
                  <Check className="h-3 w-3" />
                  <span className="text-[9px] font-mono">{labels.acceptInvite}</span>
                </button>
                <button
                  onClick={() => {
                    Promise.resolve(onRejectInvite?.(invite.code)).catch(() => { });
                  }}
                  className="inline-flex items-center gap-1 px-1.5 py-1 rounded-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  title={labels.rejectInvite}
                >
                  <X className="h-3 w-3" />
                  <span className="text-[9px] font-mono">{labels.rejectInvite}</span>
                </button>
              </div>
            ))
          )}

          {/* Direct Messages */}
          <SectionLabel label={labels.directMessages} />
          {filteredDMs.map((dm) => (
            <DMRow
              key={dm.id}
              dm={dm}
              selected={selectedId === dm.id}
              onClick={() => onSelect(dm.id)}
              locale={locale}
            />
          ))}
          {noResults && (
            <p className="text-[10px] text-muted-foreground/50 font-mono px-2 py-3 italic text-center">
              {labels.noResults}
            </p>
          )}
        </div>

        {/* Footer — current user */}
        {actionNotice && (
          <div className="px-3 py-2.5 border-t border-border shrink-0">
            <div
              className={cn(
                "flex items-start gap-2 rounded-sm border px-2 py-1.5",
                actionNotice.kind === "success" &&
                "border-green-500/30 bg-green-500/10 text-green-400",
                actionNotice.kind === "error" &&
                "border-red-500/30 bg-red-500/10 text-red-400",
                actionNotice.kind === "info" &&
                "border-blue-500/30 bg-blue-500/10 text-blue-400",
              )}
            >
              <p className="flex-1 font-mono text-[10px] leading-4">
                {actionNotice.message}
              </p>
              <button
                onClick={() => onClearNotice?.()}
                className="shrink-0 text-[10px] font-mono opacity-70 hover:opacity-100"
                title={labels.close}
              >
                x
              </button>
            </div>
          </div>
        )}
      </motion.aside>

      <InviteMemberModal
        open={!!inviteGroup}
        groupName={inviteGroup?.name ?? ""}
        users={users}
        onSearchUsers={onSearchUsers}
        onClose={() => setInviteGroup(null)}
        onInvite={(userIds) => {
          if (inviteGroup) onInviteToGroup?.(inviteGroup.id, userIds);
          setInviteGroup(null);
        }}
      />
    </>
  );
}
