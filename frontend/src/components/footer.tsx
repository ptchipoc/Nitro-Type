"use client";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
	const { t } = useTranslation();
	return (
		<footer className="border-t border-border/30 px-4 sm:px-6 py-8">
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">
					<p className="font-mono text-xs text-muted-foreground text-center sm:text-left">
						© {new Date().getFullYear()} NT — {t("home.footer.rights_reserved")}
					</p>
					<Link
						href="/privacy-policy"
						className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
					>
						{t("home.footer.privacy_policy")}
					</Link>
				</div>
				
			</div>
		</footer>
	);
}
