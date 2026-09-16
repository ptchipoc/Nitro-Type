"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useFriendListAllHook } from "@/features/friends/hooks/friend-list-all.hook";
import { usefriendDeleteHook } from "@/features/friends/hooks/friend-delete.hook";
import { ApiUser } from "@/features/users/type";
import { FRIENDS_LABEL } from "./constants";
import { useTranslation } from "@/lib/i18n";
import { ApiClientError } from "@/features/apiClient";
import { toast } from "sonner";


type Friend = {
  friendshipId: string;
  friendshipCreatedAt: string;
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

interface FriendsListProps {
  users: ApiUser[];
}

export function FriendsList({ users }: FriendsListProps) {
  const { data, isLoading, error } = useFriendListAllHook();
  const deleteMutation = usefriendDeleteHook();
  const { locale } = useTranslation();
  const labels = FRIENDS_LABEL[locale as keyof typeof FRIENDS_LABEL] || FRIENDS_LABEL.pt;

  const friends = data?.data;
  const router = useRouter();

  const handleDeleteFriend = async (e: React.MouseEvent, friendshipId: string) => {
    e.stopPropagation();
    try {
      await deleteMutation.mutateAsync(friendshipId);
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.status === 404) {
          toast.error(labels.friendNotFound);
          return;
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            {labels.loadingFriends}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6 text-center">
        <p className="font-mono text-sm text-red-500">
          {labels.errorLoadingFriends}
        </p>
      </div>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <div className="rounded-lg border border-border/30 bg-card/20 p-12 text-center">
        <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
          {labels.noFriends}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {friends.map((friend: Friend) => (
        <div
          key={friend.friendshipId}
          className="group cursor-pointer rounded-lg border border-border/50 bg-card/40 p-4 transition-all hover:bg-card/60 hover:border-border/80"
          onClick={() => router.push(`/friends/${friend.id}`)}
        >
          {/* Friend Card */}
          <div className="flex flex-col items-center gap-3 text-center">
            {/* Avatar */}
            <div className="h-12 w-12 rounded-full bg-primary/20 border border-primary/30 overflow-hidden">
              {friend.avatarUrl ? (
                <img
                  src={friend.avatarUrl}
                  alt={friend.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="font-mono text-sm font-bold text-primary">
                    {friend.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Friend Info */}
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm font-medium text-foreground truncate">
                {friend.name}
              </p>
              <p className="font-mono text-xs text-muted-foreground truncate">
                {friend.email}
              </p>
            </div>

            {/* Creation Date */}
            <p className="font-mono text-[10px] text-muted-foreground/70">
              {labels.friendsSince} {new Date(friend.friendshipCreatedAt).toLocaleDateString("pt-BR")}
            </p>

            {/* Delete Button */}
            <button
              onClick={(e) => handleDeleteFriend(e, friend.friendshipId)}
              disabled={deleteMutation.isPending}
              className={cn(
                "w-full mt-2 cursor-pointer flex h-8 items-center justify-center gap-2 rounded-lg transition-all duration-200 font-mono text-xs uppercase tracking-widest",
                deleteMutation.isPending
                  ? "bg-red-500/20 text-red-500"
                  : "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
              )}
              title="Remover amigo"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>{labels.removing}</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-3 w-3" />
                  <span>{labels.remove}</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
