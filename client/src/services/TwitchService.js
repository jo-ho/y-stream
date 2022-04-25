class TwitchService {

	constructor() {
		this.accessToken = null
	}

	getToken() {
		console.log(document.location.hash)
		const query = document.location.hash.split('/')[1]
		document.location.hash = ''
		console.log(query)
		if (!this.accessToken) {
			if (query.includes("access_token")) {
				const params = new URLSearchParams(query);
				const token = params.get('access_token'); 
				this.accessToken = token
				return true
			} else {
				return false
			}
		}

		return true

	}

	async getLiveChannels() {

		if (this.getToken()) {
			const users = await fetch("https://api.twitch.tv/helix/users", {    
				headers: {
				'Authorization': 'Bearer ' + this.accessToken,
				'Client-Id': `${process.env.REACT_APP_TWITCH_CLIENT_ID}`
			},}).then(response => response.json())
	
			const activeUser = users.data[0]
	

			const liveChannels = await fetch("https://api.twitch.tv/helix/streams/followed?user_id=" + activeUser.id, {    
				headers: {
				'Authorization': 'Bearer ' + this.accessToken,
				'Client-Id': `${process.env.REACT_APP_TWITCH_CLIENT_ID}`
			},})
			.then(response => response.json())

			console.log("liveChannels",liveChannels)

			const ids = liveChannels.data.map(liveChannel => liveChannel.user_id)

			console.log(ids)

			const idsQuery = new URLSearchParams()
			ids.forEach(id => {
				idsQuery.append('id', id)
			});

			

			console.log(idsQuery.toString())

			const liveUsers = await fetch("https://api.twitch.tv/helix/users?" + idsQuery.toString(), {    
				headers: {
				'Authorization': 'Bearer ' + this.accessToken,
				'Client-Id': `${process.env.REACT_APP_TWITCH_CLIENT_ID}`
			},}).then(response => response.json())

			console.log("liveUsers",liveUsers)
			

			return liveUsers.data
		} return []

	}

}

export default TwitchService