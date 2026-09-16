export type friendRequest = {
	id: string;
}

export type friendRequestResponse = {
	data: {
		message: string;
	};
}

export type listPendentsFriendRequests = {
	received: {
		id: string;
		senderId: string;
		receiverId: string;
		status: string;
		createdAt: string;
		updatedAt: string;
		sender: {
			id: string;
			name: string;
			email: string;
			avatarUrl: string | null;
		};
		receiver: {
			id: string;
			name: string;
			email: string;
			avatarUrl: string | null;
		};
	}[];
	sent: [];
}


// type list friends

export type listFriends = {
	data: {
		friendshipId: string;
		friendshipCreatedAt: string;
		id: string;
		name: string;
		email: string;
		avatarUrl: string | null;
	}[];
}