"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFriendSendRequestHook } from "@/features/friends/hooks/friend-send-request.hook";
import type { ApiUser } from "@/features/users/type";
import { ApiClientError } from "@/features/apiClient";
import { useTranslation } from "@/lib/i18n";
import { FRIENDS_LABEL } from "./constants";

interface SearchFriendProps {
	users: ApiUser[];
}

export function SearchFriend({ users }: SearchFriendProps) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [messageError, setMessageError] = useState("");
	const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
	const sendRequestMutation = useFriendSendRequestHook();
	const { locale } = useTranslation();
	const labels = FRIENDS_LABEL[locale as keyof typeof FRIENDS_LABEL] || FRIENDS_LABEL.pt;

	// Filtrar usuários baseado na busca por email ou nome
	const filteredUsers = useMemo(() => {
		if (!searchQuery.trim()) return [];

		const query = searchQuery.toLowerCase();
		return users.filter(
			(user) =>
				user.email.toLowerCase().includes(query) ||
				user.name.toLowerCase().includes(query)
		);
	}, [searchQuery, users]);

	const handleSelectUser = (user: ApiUser) => {
		setSelectedUser(user);
		setSearchQuery("");
	};

	const handleViewProfile = (user: ApiUser) => {
		router.push(`/friends/${user.id}`);
	};

	const handleSendRequest = async () => {
		if (!selectedUser) return;

		try {
			await sendRequestMutation.mutateAsync(selectedUser.id);
			setSelectedUser(null);
			setMessageError("");
		} catch (err) {
			if (err instanceof ApiClientError) {
				// console.log("Erro ao enviar pedido de amizade:", err.getMessage());
				setMessageError(err.getMessage());
			}
		}
	};

	return (
		<div className="bg-card/40 rounded-lg border border-border/50 p-4 sm:p-6">
			{/* Search Input */}
			<div className="relative mb-4">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<input
					type="text"
					placeholder={labels.placeholder}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full pl-10 pr-4 py-2 rounded-lg border border-border/50 bg-background/50 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
				/>
			</div>

			{/* Search Results Dropdown */}
			{searchQuery && filteredUsers.length > 0 && !selectedUser && (
				<div className="absolute mt-2 w-auto max-w-2xl rounded-lg border border-border/50 bg-card/95 backdrop-blur-md shadow-xl overflow-hidden z-50">
					<div className="max-h-60 overflow-y-auto custom-scrollbar">
						{filteredUsers.map((user) => (
							<button
								key={user.id}
								onClick={() => handleSelectUser(user)}
								className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border/20 last:border-b-0 text-left"
							>
								<div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 shrink-0 overflow-hidden">
									{user.avatarUrl ? (
										<img
											src={user.avatarUrl}
											alt={user.name}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="h-full w-full flex items-center justify-center">
											<span className="font-mono text-[10px] font-bold text-primary">
												{user.name.charAt(0).toUpperCase()}
											</span>
										</div>
									)}
								</div>

								<div className="flex-1 min-w-0">
									<p className="font-mono text-sm font-medium text-foreground truncate">
										{user.name}
									</p>
									<p className="font-mono text-xs text-muted-foreground truncate">
										{user.email}
									</p>
								</div>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Selected User Display */}
			{selectedUser && (
				<div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-4 sm:p-6">
					<div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
						{/* user information container */}
						<button
							onClick={() => handleViewProfile(selectedUser)}
							className="flex-1 text-center sm:text-left hover:opacity-80 transition-opacity cursor-pointer w-full"
						>
							{/* user information container */}
							<div className="flex gap-2">
								{/* img container */}
								<div className="h-16 w-16 rounded-full bg-primary/20 border-2 border-primary/30 shrink-0 overflow-hidden">
									{selectedUser.avatarUrl ? (
										<img
											src={selectedUser.avatarUrl}
											alt={selectedUser.name}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="h-full w-full flex items-center justify-center">
											<span className="font-mono text-lg font-bold text-primary">
												{selectedUser.name.charAt(0).toUpperCase()}
											</span>
										</div>
									)}
								</div>

								{/* name email container */}
								<div>
									<p className="font-mono text-lg font-bold text-foreground mb-1">
										{selectedUser.name}
									</p>
									<p className="font-mono text-sm text-muted-foreground mb-4">
										{selectedUser.email}
									</p>
								</div>
							</div>
						</button>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-3">
							<button
								onClick={handleSendRequest}
								disabled={sendRequestMutation.isPending}
								className={cn(
									"flex p-1 h-10 cursor-pointer items-center justify-center gap-2 rounded-lg transition-all duration-200 font-mono text-sm uppercase tracking-widest",
									sendRequestMutation.isPending
										? "bg-primary/20 text-primary"
										: "bg-primary text-primary-foreground hover:opacity-90"
								)}
							>
								{sendRequestMutation.isPending ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										<span>{labels.sending}</span>
									</>
								) : (
									<>
										<UserPlus className="h-4 w-4" />
										<span>{labels.sendingRequest}</span>
									</>
								)}
							</button>

							<button
								onClick={() => setSelectedUser(null)}
								disabled={sendRequestMutation.isPending}
								className="flex p-1 h-10 items-center hover:border-primary cursor-pointer justify-center gap-2 rounded-lg border border-border/50 bg-card/40 hover:bg-card/60 transition-all duration-200 font-mono text-sm uppercase tracking-widest text-muted-foreground"
							>
								{labels.cancel}
							</button>
						</div>
					</div>

					{sendRequestMutation.isError && (
						<div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
							<p className="font-mono text-sm text-red-500">
								{messageError}
							</p>
						</div>
					)}

					{sendRequestMutation.isSuccess && (
						<div className="mt-4 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
							<p className="font-mono text-sm text-green-500">
								{labels.sendingRequesSuccess}
							</p>
						</div>
					)}
				</div>
			)}

			{/* No Results */}
			{searchQuery && filteredUsers.length === 0 && !selectedUser && (
				<div className="mt-4 text-center">
					<p className="font-mono text-sm text-muted-foreground">
						{labels.noUserFound}
					</p>
				</div>
			)}
		</div>
	);
}