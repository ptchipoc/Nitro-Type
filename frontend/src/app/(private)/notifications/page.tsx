"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CursorGlow } from "@/components/cursor-glow";
import { NotificationHeader } from "./components/notification-header";
import { NotificationItem } from "./components/notification-item";
import { NotificationEmpty } from "./components/notification-empty";
import { AnimatePresence } from "framer-motion";
import { Loader2, Plus } from "lucide-react";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const {
    data: results,
    isLoading,
    isFetching,
  } = useNotifications({ page, limit: 20 });

  const notificationList = results?.data;
  const notifications = notificationList?.data || [];
  const hasNotifications = notifications.length > 0;

  return (
    <main className="relative min-h-screen overflow-hidden scanlines">
      <CursorGlow />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <div className="flex-1 w-full max-w-4xl mx-auto px-4 pt-28 pb-16">
          <div className="glass border border-white/5 rounded-sm p-6 sm:p-8 min-h-[600px] flex flex-col">
            <NotificationHeader />

            <div className="flex-1">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground animate-pulse">
                    Sincronizando feed de notificações...
                  </p>
                </div>
              ) : !hasNotifications ? (
                <NotificationEmpty />
              ) : (
                <div className="divide-y divide-white/5 border-y border-white/5">
                  <AnimatePresence mode="popLayout">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {hasNotifications && (
              <div className="mt-8 flex flex-col items-center gap-4">
                {notificationList &&
                  notificationList.data.length <
                    notificationList.unreadCount +
                      notificationList.data.filter((n) => n.isRead).length && (
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={isFetching}
                      className="flex items-center gap-2 px-6 py-2 border border-primary/20 bg-primary/5 text-primary font-mono text-[10px] uppercase tracking-widest hover:bg-primary/10 transition-colors disabled:opacity-50"
                    >
                      {isFetching ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                      Carregar transmissões anteriores
                    </button>
                  )}

                <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.3em]">
                  Fim do feed oficial de comunicações
                </p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
