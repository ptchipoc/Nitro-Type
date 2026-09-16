import { Github } from "lucide-react"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"

export const SocialButtons = () => {
	return (
		<div className="grid grid-cols-2 gap-3">
			<button
				onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
				className="cursor-pointer flex items-center justify-center h-12 rounded-xl border border-border bg-card/40 hover:bg-secondary/50 transition-all group"
			>
				<FcGoogle className="h-5 w-5 group-hover:text-primary transition-colors" />
			</button>
			<button
				onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
				className="cursor-pointer flex items-center justify-center h-12 rounded-xl border border-border bg-card/40 hover:bg-secondary/50 transition-all group"
			>
				<Github className="h-5 w-5 group-hover:text-primary transition-colors" />
			</button>
			<button
				onClick={() => signIn("42-school", { callbackUrl: "/dashboard" })}
				className="cursor-pointer flex items-center justify-center h-12 rounded-xl border border-border bg-card/40 hover:bg-secondary/50 transition-all group font-mono font-bold text-sm"
			>
				42
			</button>
		</div>
	)
}