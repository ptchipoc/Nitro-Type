"use client";

import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFriendPendentsFriendsHook } from "@/features/friends/hooks/friend-pendents-friends.hook";
import { friendAcceptFriendshipHook } from "@/features/friends/hooks/friend-accept-friendship.hook";
import { friendRejectFriendshipHook } from "@/features/friends/hooks/friend-reject-friendship.hook";
import { ApiUser } from "@/features/users/type";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { FRIENDS_LABEL } from "./constants";

type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
};

interface FriendsRequestsProps {
  users: ApiUser[];
}

export function FriendsRequests({ users }: FriendsRequestsProps) {
  const { data, isLoading, error } = useFriendPendentsFriendsHook();
  const acceptMutation = friendAcceptFriendshipHook();
  const rejectMutation = friendRejectFriendshipHook();

  const requests = data?.data?.received || [];
  const router = useRouter();
  const { locale } = useTranslation();
  const labels = FRIENDS_LABEL[locale as keyof typeof FRIENDS_LABEL] || FRIENDS_LABEL.pt;


  const handleAccept = async (id: string, request: FriendRequest) => {
    try {
      await acceptMutation.mutateAsync(id);
    } catch (err) {
      console.error("Erro ao aceitar pedido:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectMutation.mutateAsync(id);
    } catch (err) {
      console.error("Erro ao rejeitar pedido:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            {labels.loadingRequests}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6 text-center">
        <p className="font-mono text-sm text-red-500">
          {labels.errorLoadingRequests}
        </p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-lg border border-border/30 bg-card/20 p-12 text-center">
        <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
          {labels.noPendentsRequests}
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-3">
      {requests.map((request: FriendRequest) => (
        <div
          key={request.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-lg border border-border/50 bg-card/40 p-3 sm:p-4 transition-all hover:bg-card/60 hover:border-border/80"
        >
          {/* User Info */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 shrink-0 overflow-hidden">
              {request.sender.avatarUrl ? (
                <img
                  src={request.sender.avatarUrl}
                  alt={request.sender.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="font-mono text-xs font-bold text-primary">
                    {request.sender.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <button
                className="text-left w-full flex flex-col items-start gap-1 cursor-pointer"
                onClick={() => router.push(`/friends/${request.sender.id}`)}
              >
                <span className="font-mono text-xs sm:text-sm font-medium text-foreground truncate">
                  {request.sender.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground truncate">
                  {request.sender.email}
                </span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => handleAccept(request.id, request)}
              disabled={acceptMutation.isPending || rejectMutation.isPending}
              className={cn(
                "flex-1 sm:flex-none flex h-9 sm:w-9 items-center justify-center gap-1 sm:gap-0 rounded-lg transition-all duration-200 font-mono text-xs sm:text-base",
                acceptMutation.isPending
                  ? "bg-primary/20 text-primary"
                  : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
              )}
              title="Aceitar"
            >
              {acceptMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span className="sm:hidden">{labels.accept}</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleReject(request.id)}
              disabled={acceptMutation.isPending || rejectMutation.isPending}
              className={cn(
                "flex-1 sm:flex-none flex h-9 sm:w-9 items-center justify-center gap-1 sm:gap-0 rounded-lg transition-all duration-200 font-mono text-xs sm:text-base",
                rejectMutation.isPending
                  ? "bg-red-500/20 text-red-500"
                  : "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
              )}
              title="Rejeitar"
            >
              {rejectMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <X className="h-4 w-4" />
                  <span className="sm:hidden">{labels.reject}</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
