"use client";

import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { ThemeChanger } from "./theme-changer";
import { ThemeToggle } from "./theme-toggle";

interface LanguageSelectorProps {
	className?: string;
	compact?: boolean;
	showNotifications?: boolean;
	layout?: "horizontal" | "vertical";
	hideOnMobile?: boolean;
}

export function LanguageSelector({
	className,
	compact = false,
	showNotifications = true,
	layout = "horizontal",
	hideOnMobile = true
}: LanguageSelectorProps) {
	const { locale, setLocale } = useTranslation();
	const { status } = useSession();

	const containerClass = hideOnMobile
		? cn(
			layout === "horizontal" ? "flex items-center gap-1" : "flex flex-col gap-3",
			"hidden sm:flex relative z-50",
			className
		)
		: cn(
			layout !== "horizontal" ? "flex items-center gap-1" : "flex flex-col gap-3",
			"relative z-50",
			className
		);

	return (
		<div className={containerClass}>
			<div className={cn(
				" flex items-center bg-secondary/30 rounded-lg p-0.5 border border-border/50 w-[100px] ",
			)}>
				<button
					onClick={() => setLocale("pt")}
					className={cn(
						"px-2 py-1 rounded-md font-mono text-[10px] uppercase transition-all",
						layout === "vertical" && "flex-1 py-2",
						locale === "pt"
							? "bg-primary text-primary-foreground shadow-sm"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					PT
				</button>
				<button
					onClick={() => setLocale("en")}
					className={cn(
						"px-2 py-1 rounded-md font-mono text-[10px] uppercase transition-all",
						layout === "vertical" && "flex-1 py-2",
						locale === "en"
							? "bg-primary text-primary-foreground shadow-sm"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					EN
				</button>
				<button
					onClick={() => setLocale("fr")}
					className={cn(
						"px-2 py-1 rounded-md font-mono text-[10px] uppercase transition-all",
						layout === "vertical" && "flex-1 py-2",
						locale === "fr"
							? "bg-primary text-primary-foreground shadow-sm"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					FR
				</button>
			</div>
			<div className="flex flex-row">
				<NotificationBell />
				<ThemeChanger />
				<ThemeToggle />
			</div>
		</div>
	);
}
