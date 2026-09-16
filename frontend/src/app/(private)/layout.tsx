"use client";

import { useSessionValidator } from "@/hooks/use-session-validator";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useSessionValidator();
  return <>{children}</>;
}
