"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CommunitySidebar } from "../components/CommunitySidebar";
import { ChannelView } from "../components/ChannelView";
import { MemberPanel } from "../components/MemberPanel";
import { CreateGroupModal } from "../components/CreateGroupModal";
import { EditGroupModal } from "../components/EditGroupModal";
import { Header } from "@/components/header";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useCommunityPageController } from "../hooks/useCommunityPageController";

export default function CommunityPageClient() {
  const {
    labels,
    currentUserId,
    channelsLoading,
    channelsError,
    platformChannels,
    privateGroups,
    dms,
    selectableUsers,
    sidebarInvites,
    invitesLoading,
    sidebarNotice,
    setSidebarNotice,
    selectedId,
    handleSelect,
    createGroupOpen,
    setCreateGroupOpen,
    memberPanelOpen,
    setMemberPanelOpen,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    selectedChannel,
    selectedDM,
    messages,
    dmMessages,
    mentionCandidates,
    selectedChannelMembers,
    selectedDMMembers,
    handleInviteToGroup,
    handleSearchUsers,
    handleAcceptInviteCode,
    handleRejectInviteCode,
    handleAddDirectFriends,
    handleSendChannelMessage,
    handleEditChannelMessage,
    handleDeleteChannelMessage,
    handleAddChannelMessageReaction,
    handleRemoveChannelMessageReaction,
    handleSendDMMessage,
    handleEditDMMessage,
    handleDeleteDMMessage,
    handleAddDMMessageReaction,
    handleRemoveDMMessageReaction,
    handleUpdateChannelMemberRole,
    handleRemoveChannelMember,
    handleBanChannelMember,
    handleCreateGroup,
    handleUpdateGroup,
    handleDeleteGroup,
    editGroupOpen,
    setEditGroupOpen,
  } = useCommunityPageController();

  if (channelsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">
          {labels.loadingChannels}
        </p>
      </div>
    );
  }

  if (channelsError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="font-mono text-sm text-red-500 text-center">
          {channelsError}
        </p>
      </div>
    );
  }

  const memberPanelTarget = selectedChannel ?? selectedDM;
  const memberPanelMembers = selectedChannel
    ? selectedChannelMembers
    : selectedDMMembers;
  const currentUserChannelMember = selectedChannelMembers.find(
    (m) => m.id === currentUserId
  );
  const memberPanelRole = selectedChannel
    ? (currentUserChannelMember?.role ?? "GROUP_MEMBER")
    : "GROUP_MEMBER";
  const memberPanelDescription =
    selectedChannel?.description ??
    (selectedDM ? `@${selectedDM.username}` : "");
  const memberPanelCount =
    selectedChannel?.memberCount ?? selectedDMMembers.length;
  const memberPanelPrivate = selectedChannel?.isPrivate ?? true;

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 min-h-0 flex flex-col pt-[64px] overflow-hidden">
        {/* Top bar breadcrumb on mobile */}
        <div className="md:hidden flex items-center gap-2 px-4 py-2 border-b border-border bg-background shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {labels.channels}
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-xs font-mono text-foreground">
            {selectedChannel?.name ?? selectedDM?.name}
          </span>
        </div>

        {/* Main layout */}
        <div className="flex-1 min-h-0 flex overflow-hidden relative">
          {/* Left sidebar — channels */}
          {/* Desktop */}
          <div className="hidden md:flex w-56 lg:w-64 border-r border-border bg-background shrink-0">
            <CommunitySidebar
              platformChannels={platformChannels}
              privateGroups={privateGroups}
              dms={dms}
              users={selectableUsers}
              pendingInvites={sidebarInvites}
              invitesLoading={invitesLoading}
              actionNotice={sidebarNotice}
              onClearNotice={() => setSidebarNotice(null)}
              selectedId={selectedId}
              onSelect={handleSelect}
              onCreateGroup={() => setCreateGroupOpen(true)}
              onInviteToGroup={handleInviteToGroup}
              onSearchUsers={handleSearchUsers}
              onAcceptInvite={handleAcceptInviteCode}
              onRejectInvite={handleRejectInviteCode}
              onAddDirectFriends={handleAddDirectFriends}
            />
          </div>

          {/* Mobile sidebar overlay */}
          <AnimatePresence>
            {mobileSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
                  onClick={() => setMobileSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-background z-50 md:hidden pt-14"
                >
                  <CommunitySidebar
                    platformChannels={platformChannels}
                    privateGroups={privateGroups}
                    dms={dms}
                    users={selectableUsers}
                    pendingInvites={sidebarInvites}
                    invitesLoading={invitesLoading}
                    actionNotice={sidebarNotice}
                    onClearNotice={() => setSidebarNotice(null)}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    onCreateGroup={() => {
                      setCreateGroupOpen(true);
                      setMobileSidebarOpen(false);
                    }}
                    onInviteToGroup={handleInviteToGroup}
                    onSearchUsers={handleSearchUsers}
                    onAcceptInvite={handleAcceptInviteCode}
                    onRejectInvite={handleRejectInviteCode}
                    onAddDirectFriends={handleAddDirectFriends}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Middle — channel/DM content */}
          <div className="flex-1 min-h-0 overflow-hidden bg-background">
            {selectedChannel ? (
              <ChannelView
                channelId={selectedChannel.id}
                channelName={selectedChannel.name}
                channelDescription={selectedChannel.description}
                // memberCount={selectedChannel.memberCount}
                isPrivate={selectedChannel.isPrivate}
                isPlatformManaged={selectedChannel.isPlatformManaged}
                messages={messages}
                currentUserRole={memberPanelRole}
                onToggleMemberPanel={() => setMemberPanelOpen((p) => !p)}
                memberPanelOpen={memberPanelOpen}
                forceReadOnly={selectedChannel.slug === "announcements"}
                mentionCandidates={mentionCandidates}
                onSendMessage={handleSendChannelMessage}
                onEditMessage={handleEditChannelMessage}
                onDeleteMessage={handleDeleteChannelMessage}
                onAddReaction={handleAddChannelMessageReaction}
                onRemoveReaction={handleRemoveChannelMessageReaction}
              />
            ) : selectedDM ? (
              <ChannelView
                channelId={selectedDM.id}
                channelName={selectedDM.name}
                channelDescription={`@${selectedDM.username}`}
                // memberCount={2}
                isPrivate={true}
                isPlatformManaged={false}
                messages={dmMessages}
                currentUserRole="GROUP_MEMBER"
                onToggleMemberPanel={() => setMemberPanelOpen((p) => !p)}
                memberPanelOpen={memberPanelOpen}
                mentionCandidates={[]}
                onSendMessage={handleSendDMMessage}
                onEditMessage={handleEditDMMessage}
                onDeleteMessage={handleDeleteDMMessage}
                onAddReaction={handleAddDMMessageReaction}
                onRemoveReaction={handleRemoveDMMessageReaction}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 rounded-sm border border-border bg-card flex items-center justify-center mb-4">
                  <MessageCircle className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="font-mono text-sm text-muted-foreground">
                  {labels.empty}
                </p>
              </div>
            )}
          </div>

          {/* Right — member panel */}
          <AnimatePresence>
            {memberPanelOpen && memberPanelTarget && (
              <>
                <motion.div
                  key="member-panel-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
                  onClick={() => setMemberPanelOpen(false)}
                />
                <motion.div
                  key="member-panel-mobile"
                  initial={{ x: 280 }}
                  animate={{ x: 0 }}
                  exit={{ x: 280 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="fixed right-0 top-0 bottom-0 w-72 border-l border-border bg-background z-50 lg:hidden"
                >
                  <MemberPanel
                    members={memberPanelMembers}
                    currentUserId={currentUserId}
                    currentUserRole={memberPanelRole}
                    channelName={memberPanelTarget.name}
                    channelDescription={memberPanelDescription}
                    memberCount={memberPanelCount}
                    isPrivate={memberPanelPrivate}
                    isPlatformManaged={selectedChannel?.isPlatformManaged}
                    onRoleChange={
                      selectedChannel ? handleUpdateChannelMemberRole : undefined
                    }
                    onRemoveMember={
                      selectedChannel ? handleRemoveChannelMember : undefined
                    }
                    onBanMember={selectedChannel ? handleBanChannelMember : undefined}
                    onEditChannel={
                      selectedChannel ? () => setEditGroupOpen(true) : undefined
                    }
                  />
                </motion.div>
                <motion.div
                  key="member-panel-desktop"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 200 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hidden lg:flex border-l border-border bg-background overflow-hidden shrink-0"
                >
                  <div className="w-[200px]">
                    <MemberPanel
                      members={memberPanelMembers}
                      currentUserId={currentUserId}
                      currentUserRole={memberPanelRole}
                      channelName={memberPanelTarget.name}
                      channelDescription={memberPanelDescription}
                      memberCount={memberPanelCount}
                      isPrivate={memberPanelPrivate}
                      isPlatformManaged={selectedChannel?.isPlatformManaged}
                      onRoleChange={
                        selectedChannel ? handleUpdateChannelMemberRole : undefined
                      }
                      onRemoveMember={
                        selectedChannel ? handleRemoveChannelMember : undefined
                      }
                      onBanMember={selectedChannel ? handleBanChannelMember : undefined}
                      onEditChannel={
                        selectedChannel ? () => setEditGroupOpen(true) : undefined
                      }
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create group modal */}
      <CreateGroupModal
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        onCreate={handleCreateGroup}
      />

      {/* Edit group modal */}
      {selectedChannel && (
        <EditGroupModal
          open={editGroupOpen}
          onClose={() => setEditGroupOpen(false)}
          onUpdate={handleUpdateGroup}
          onDelete={handleDeleteGroup}
          initialName={selectedChannel.name}
          initialDescription={selectedChannel.description}
        />
      )}
    </div>
  );
}