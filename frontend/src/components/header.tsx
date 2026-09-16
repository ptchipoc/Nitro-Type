"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { LanguageSelector } from "./language-selector";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslation } from "@/lib/i18n";
import { userGetMeHook } from "@/features/users/hooks/user-get-me.hook";
import Image from "next/image";

export function Header() {
  const { t, locale } = useTranslation();

  const navItems = [
    { label: t("nav.dashboard"), href: "/dashboard" },
    { label: t("nav.typing"), href: "/typing" },
    // { label: t("nav.learn"), href: "/learn" },
    { label: t("nav.community"), href: "/community" },
    { label: t("nav.events"), href: "/events" },
    { label: t("nav.ranking"), href: "/ranking" },
    { label: t("nav.friends"), href: "/friends" },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { data: user, refetch: refetchUser, error } = userGetMeHook();
  const avatarUrl = user?.data?.avatarUrl;
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobileMenuOpen) return;

      const target = event.target as Node;
      if (
        mobileMenuRef.current &&
        hamburgerButtonRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !hamburgerButtonRef.current.contains(target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  // Validate backend session when NextAuth considers user authenticated
  const sessionCheckedRef = useRef(false);
  useEffect(() => {
    if (status !== "authenticated" || sessionCheckedRef.current) return;
    sessionCheckedRef.current = true;

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) return;

    // fetch(`${API_URL}/users/me`, {
    //   credentials: "include",
    //   headers: { "Content-Type": "application/json" },
    // })
    //   .then((res) => {
    //     if (!res.ok && (res.status === 401 || res.status === 403 || res.status === 404 || res.status === 500)) {
    //       signOut({ callbackUrl: "/login" });
    //     }
    //   })
    //   .catch(() => {
    //     // Network error — don't force logout
    //   });
  }, [status]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/dashboard" className="group flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-primary/50 bg-primary/10 font-mono text-sm text-primary transition-all duration-400 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/25">
              {/* <span className="glitch">{"⚡"}</span> */}
              <span className="glitch">
                <Image
                  src="/nt/icone.png"
                  alt="Icone"
                  width={20}
                  height={15}
                  priority
                  style={{
                    width: "20x",
                    height: "15px",
                  }}
                />
              </span>
            </div>
            <span className="font-mono text-sm tracking-tight">
              <span className="bg-linear-to-l from-primary/50 to-accent bg-clip-text text-transparent font-semibold">
                NT
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 xl:flex">
            {status === "authenticated" &&
              navItems.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-all duration-300 rounded-lg",
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                    hoveredIndex === index &&
                    !isActive(item.href) &&
                    "text-foreground",
                  )}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span
                    className={cn(
                      "absolute left-1.5 text-primary transition-all duration-200",
                      isActive(item.href)
                        ? "opacity-100 translate-x-0"
                        : hoveredIndex === index
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2",
                    )}
                  >
                    {">"}
                  </span>
                  <span
                    className={cn(
                      "transition-transform duration-200",
                      (hoveredIndex === index || isActive(item.href)) &&
                      "translate-x-2",
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300",
                      isActive(item.href)
                        ? "w-6"
                        : hoveredIndex === index
                          ? "w-6"
                          : "w-0",
                    )}
                  />
                </Link>
              ))}
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector compact showNotifications layout="horizontal" />

            <div className="hidden h-5 w-px bg-border sm:block" />

            {/* Auth Section */}
            {status === "authenticated" ? (
              <div className="relative hidden xl:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-border bg-card/40 hover:bg-secondary/50 transition-all font-mono text-xs text-foreground group"
                >
                  <span className="max-w-25 truncate">
                    {session.user?.name}
                  </span>
                  <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
                    {session.user?.image ? (
                      <img
                        src={avatarUrl || session.user.image}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src="/default-image.png"
                        alt="Default Avatar"
                        className="h-full w-full object-cover "
                      />
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 text-muted-foreground transition-transform",
                      isUserMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-xl p-1 animate-in fade-in zoom-in-95 duration-200">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary text-xs font-mono transition-colors"
                    >
                      <User className="h-3.5 w-3.5" /> {t("nav.my_profile")}
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-500 text-xs font-mono transition-colors border-t border-border mt-1 pt-3"
                    >
                      <LogOut className="h-3.5 w-3.5" /> {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : status === "loading" ? (
              <div className="h-9 w-24 bg-card/40 animate-pulse rounded-full border border-border hidden xl:block" />
            ) : (
              <div className="hidden items-center gap-3 xl:flex">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 font-mono text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-4 py-2 font-mono text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {t("nav.register")}
                </Link>
              </div>
            )}

            <button
              ref={hamburgerButtonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/50 xl:hidden transition-colors hover:bg-secondary"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={cn(
            "transition-all duration-400 xl:hidden bg-background overflow-visible",
            isMobileMenuOpen
              ? "max-h-fit opacity-100 pt-4"
              : "max-h-0 opacity-0 pointer-events-none",
          )}
        >
          <div className="flex flex-col gap-1 border-t border-border/50 pt-4">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3.5 font-mono text-sm uppercase tracking-widest transition-all duration-200",
                  isActive(item.href)
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground active:bg-secondary hover:text-foreground",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-primary">{">"}</span>
                {item.label}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-3 px-4 pb-6 border-t border-border/50 pt-6">
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-12 items-center justify-center gap-3 rounded-lg border border-border font-mono text-xs text-foreground bg-card/40"
                  >
                    <User className="h-4 w-4" /> {session.user?.name}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex h-12 items-center justify-center gap-3 rounded-lg border border-red-500/20 text-red-500 font-mono text-xs bg-red-500/5"
                  >
                    <LogOut className="h-4 w-4" /> {t("nav.logout")}
                  </button>
                  <div className="border-t border-border/50 pt-4 mt-2 flex justify-center">
                    <LanguageSelector compact={false} showNotifications={false} layout="horizontal" hideOnMobile={false} />
                  </div>
                </>
              ) : status === "loading" ? (
                <div className="space-y-2">
                  <div className="h-12 bg-card/40 animate-pulse rounded-lg" />
                  <div className="h-12 bg-card/40 animate-pulse rounded-lg" />
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-full items-center">
                  <LanguageSelector compact={false} showNotifications={false} layout="vertical" hideOnMobile={false} />
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex h-12 items-center justify-center rounded-lg border border-border font-mono text-xs text-muted-foreground"
                    >
                      {t("nav.login")}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex h-12 items-center justify-center rounded-lg bg-primary font-mono text-xs font-bold text-primary-foreground"
                    >
                      {t("nav.register")}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
