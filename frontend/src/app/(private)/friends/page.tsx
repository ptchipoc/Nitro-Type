"use client";

import { useState } from "react";
import type { ApiUser } from "@/features/users/type";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { FriendsRequests } from "./components/FriendsRequests";
import { FriendsList } from "./components/FriendsList";
import { SearchFriend } from "./components/SearchFriend";
import { Header } from "@/components/header";
import { useUserGetAll } from "@/features/users/hooks/user-get-all.hook";
import { Footer } from "@/components/footer";
import { FRIENDS_LABEL } from "./components/constants";

type TabType = "requests" | "friends";

export default function FriendsPage() {
	const { locale } = useTranslation();
	const [activeTab, setActiveTab] = useState<TabType>("requests");
	const { data: usersData, isLoading: usersLoading } = useUserGetAll();
	const labels = FRIENDS_LABEL[locale as keyof typeof FRIENDS_LABEL] || FRIENDS_LABEL.pt;
	

	// Extrair o array de usuários corretamente
	const users: ApiUser[] = Array.isArray(usersData?.data) ? usersData?.data : [];
	return (
		<main className="min-h-screen pt-24 pb-12">
			<Header />
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="font-mono text-2xl sm:text-3xl font-bold tracking-widest mb-2">
						{labels.friends}
					</h1>
					<p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
						{labels.subtitle}
					</p>
				</div>

				{/* Search Section - Full Width */}
				<div className="mb-8">
					<SearchFriend users={users} />
				</div>

				{/* Tabs */}
				<div className="flex gap-2 mb-8 border-b border-border/50 overflow-x-auto">
					<button
						onClick={() => setActiveTab("requests")}
						className={cn(
							"px-3 sm:px-4 py-3 font-mono text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 border-b-2 whitespace-nowrap",
							activeTab === "requests"
								? "border-b-primary text-primary"
								: "border-b-transparent text-muted-foreground hover:text-foreground"
						)}
					>
						{labels.requests}
					</button>
					<button
						onClick={() => setActiveTab("friends")}
						className={cn(
							"px-3 sm:px-4 py-3 font-mono text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 border-b-2 whitespace-nowrap",
							activeTab === "friends"
								? "border-b-primary text-primary"
								: "border-b-transparent text-muted-foreground hover:text-foreground"
						)}
					>
						{labels.friends}
					</button>
				</div>

				{/* Content */}
				<div className="animate-in fade-in duration-200">
					{activeTab === "requests" && <FriendsRequests users={users} />}
					{activeTab === "friends" && <FriendsList users={users} />}
				</div>
			</div>
		</main>
	);
}