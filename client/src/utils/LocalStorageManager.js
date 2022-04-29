class LocalStorageManager {
	static initialize() {
		if (JSON.parse(localStorage.getItem('follows')) === null) {
			localStorage.setItem('follows', JSON.stringify({}))
		}

		if (localStorage.getItem('access_token') === null) {
			localStorage.setItem('access_token', "")
		}
	}

	static syncFollowsAndSubscriptions(userId, subscriptionsMap) {
		var storedFollows = LocalStorageManager.getStoredFollows(userId)
		for (var i = 0; i < storedFollows.length; i++) {
			var followId = subscriptionsMap[storedFollows[i]]
			if (followId === undefined) {
				storedFollows = storedFollows.filter(id => storedFollows[i] !== id)
			}
		}

		LocalStorageManager.saveFollows(userId, storedFollows)
	}

	static getStoredFollows(userId) {

		var storedFollows = JSON.parse(localStorage.getItem('follows'))[userId]

		if (storedFollows === null || storedFollows === undefined) {
			storedFollows = []
		}
		return storedFollows
	}

	static getAccessToken() {
		return localStorage.getItem('access_token')
	}

	static setAccessToken(token) {
		localStorage.setItem('access_token', token)
	}

	static saveFollows(userId, follows) {

		var followsMap = JSON.parse(localStorage.getItem('follows'))
		followsMap[userId] = follows
		localStorage.setItem('follows', JSON.stringify(followsMap))
	}
}

export default LocalStorageManager;