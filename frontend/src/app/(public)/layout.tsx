"use client";

import { CursorGlow } from "@/components/cursor-glow";
import { Footer } from "@/components/footer";
import { HeaderPublic } from "@/components/header-public";
import { Header } from "@/components/header";
import { useSession } from "next-auth/react";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;

  return (
    <main className="relative min-h-screen overflow-hidden scanlines">
      <CursorGlow />
      <div className="relative z-10">
        {isLoggedIn ? <Header /> : <HeaderPublic />}
        {children}
        <Footer />
      </div>
    </main>
  );
}
