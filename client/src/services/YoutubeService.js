import LocalStorageManager from "../utils/LocalStorageManager"

const YOUTUBE_SUBS_API = "https://www.googleapis.com/youtube/v3/subscriptions"
class YoutubeService {

	#fetchNextPage  (params, channels, userId, callback) {
		fetch(`${YOUTUBE_SUBS_API}?` + params)
			.then(response => response.json())
			.then(data => {
				var storedFollows = LocalStorageManager.getStoredFollows(userId)
				data.items.forEach(element => {
					var snip = element.snippet
					var channelId = snip.resourceId.channelId
					if (storedFollows.includes(channelId)) {
						snip.isFollowed = true
					} else {
						snip.isFollowed = false

					}
					channels.push(snip)
				});
				var nextToken = data.nextPageToken

				if (nextToken !== undefined) {
					params.set('pageToken', nextToken)
					this.#fetchNextPage(params, channels, userId, callback)

				} else {
					console.log(callback)
					callback(channels)
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	getUserSubscriptions(googleUser, callback) {

		var channels = []

		var params = new URLSearchParams({
			key: `${process.env.REACT_APP_YOUTUBE_API_KEY}`,
			part: 'snippet',
			mine: true,
			access_token: `${googleUser.accessToken}`,
			maxResults: 50
		})
		this.#fetchNextPage(params, channels, googleUser.getId(), callback)
		
	}

	
}


export default YoutubeService