class TwitchService {

	// constructor() {
	// 	this.accessToken = null
	// }

	getToken() {
		console.log(document.location.hash)
		const query = document.location.hash.split('/')[1]
		console.log(query)

		if (query.includes("access_token")) {
			const params = new URLSearchParams(query);
			const token = params.get('access_token'); 
			return token
		} else {
			return ""
		}
	}

	async getLiveChannels() {
		var token = this.getToken()
		if (token) {
			const users = await fetch("https://api.twitch.tv/helix/users", {    
				headers: {
				'Authorization': 'Bearer ' + token,
				'Client-Id': `${process.env.REACT_APP_TWITCH_CLIENT_ID}`
			},}).then(response => response.json())
	
			const activeUser = users.data[0]
	

			const liveChannels = await fetch("https://api.twitch.tv/helix/streams/followed?user_id=" + activeUser.id, {    
				headers: {
				'Authorization': 'Bearer ' + token,
				'Client-Id': `${process.env.REACT_APP_TWITCH_CLIENT_ID}`
			},})
			.then(response => response.json())

			const ids = liveChannels.data.map(liveChannel => liveChannel.user_id)

			console.log(ids)

			const idsQuery = new URLSearchParams()
			ids.forEach(id => {
				idsQuery.append('id', id)
			});

			

			console.log(idsQuery.toString())

			const liveUsers = await fetch("https://api.twitch.tv/helix/users?" + idsQuery.toString(), {    
				headers: {
				'Authorization': 'Bearer ' + token,
				'Client-Id': `${process.env.REACT_APP_TWITCH_CLIENT_ID}`
			},}).then(response => response.json())

			console.log("liveUsers",liveUsers)

			return liveUsers.data
		} return []

	}

}

export default TwitchService