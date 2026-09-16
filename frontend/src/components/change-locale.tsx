import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"


export const ChangeLocale = () => {
	const { locale, setLocale } = useTranslation()

	return (
		<div className="absolute top-6 right-6 z-20 flex gap-2">
			<button
				onClick={() => setLocale("pt")}
				className={cn(
					"px-2 py-1 rounded border font-mono text-[10px] uppercase transition-all",
					locale === "pt"
						? "border-primary bg-primary/10 text-primary"
						: "border-border bg-card/40 text-muted-foreground",
				)}
			>
				PT
			</button>
			<button
				onClick={() => setLocale("en")}
				className={cn(
					"px-2 py-1 rounded border font-mono text-[10px] uppercase transition-all",
					locale === "en"
						? "border-primary bg-primary/10 text-primary"
						: "border-border bg-card/40 text-muted-foreground",
				)}
			>
				EN
			</button>
			<button
				onClick={() => setLocale("fr")}
				className={cn(
					"px-2 py-1 rounded border font-mono text-[10px] uppercase transition-all",
					locale === "fr"
						? "border-primary bg-primary/10 text-primary"
						: "border-border bg-card/40 text-muted-foreground",
				)}
			>
				FR
			</button>
		</div>
	)
}


