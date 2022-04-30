import Livestream from "../model/Livestream";
import LocalStorageManager from "../utils/LocalStorageManager";

class TwitchService {


	getToken() {
		console.log(document.location.hash)
		const query = document.location.hash.split('/')[1]
		document.location.hash = ''
		console.log(query)
		if (!LocalStorageManager.getAccessToken()) {
			if (query.includes("access_token")) {
				const params = new URLSearchParams(query);
				const token = params.get('access_token'); 
				LocalStorageManager.setAccessToken(token)
				return true
			} else {
				return false
			}
		}

		return true

	}

	async getLiveChannels() {


		if (this.getToken()) {
			var token = LocalStorageManager.getAccessToken()

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


			liveChannels.data.sort((a,b) => ('' + a.user_login).localeCompare(b.user_login))
			liveUsers.data.sort((a,b) => ('' + a.login).localeCompare(b.login))

			
			console.log("liveChannels",liveChannels)

			var arr = []

			liveUsers.data.forEach((user, i) => {
				user.streamInfo = liveChannels.data[i]
				user.streamInfo.thumbnail_url = user.streamInfo.thumbnail_url.replace('{width}', '640')
				user.streamInfo.thumbnail_url = user.streamInfo.thumbnail_url.replace('{height}', '360')
				arr.push(new Livestream(user.display_name, user.profile_image_url, user.id, user.login, user.streamInfo))

			});



			console.log("liveUsers",liveUsers)
			

			return arr
		} return []

	}

}

export default TwitchService
