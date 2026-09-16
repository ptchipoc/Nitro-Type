"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

import { NotificationItem } from "./NotificationItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  useNotifications,
  useReadAllNotifications,
} from "../hooks/use-notifications";
import { useNotificationSocket } from "../hooks/use-notification-socket";
import { NOTIFICATION_LABELS } from "./constants";
import { useTranslation } from "@/lib/i18n";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: results, isLoading } = useNotifications();
  const readAllMutation = useReadAllNotifications();
  const { locale } = useTranslation();
  const labels = NOTIFICATION_LABELS[locale as keyof typeof NOTIFICATION_LABELS] || NOTIFICATION_LABELS["en"];

  const notificationData = results?.data;
  // Activate socket listener
  useNotificationSocket();

  const unreadCount = notificationData?.unreadCount ?? 0;
  const notifications = notificationData?.data ?? [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/40 transition-all hover:bg-secondary/80 hover:border-primary/50 group",
          isOpen && "bg-secondary border-primary/50",
        )}
      >
        <Bell
          className={cn(
            "h-4 w-4 transition-all group-hover:scale-110",
            unreadCount > 0
              ? "text-primary animate-ring"
              : "text-muted-foreground",
          )}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground border-2 border-background ring-1 ring-primary/20">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 sm:w-80 md:w-96 rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-2xl overflow-hidden z-60 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-border flex items-center justify-between bg-card/20">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest leading-none">
                {labels.notification}
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-bold border border-primary/20">
                  {unreadCount} {labels.new}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={() => readAllMutation.mutate()}
                className="text-[10px] font-mono text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                disabled={readAllMutation.isPending}
              >
                <CheckCheck className="h-3 w-3" />
                {labels.mark_all}
              </button>
            )}
          </div>

          <div className="max-h-105 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-8 text-center space-y-3">
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-mono text-muted-foreground animate-pulse uppercase tracking-tighter">
                  {labels.syncing}
                </p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClose={() => setIsOpen(false)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-4 opacity-40">
                <div className="h-12 w-12 rounded-full border border-dashed border-border flex items-center justify-center">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-xs font-mono uppercase tracking-widest italic">
                  {labels.empty}
                </p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 bg-card/20 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/notifications" onClick={() => setIsOpen(false)}>
                  {labels.see_history}
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
