class LocalStorageManager {
	static initialize() {
		if (JSON.parse(localStorage.getItem('follows')) === null) {
			localStorage.setItem('follows', JSON.stringify({}))
		}
	}


	static getStoredFollows(userId) {
		var storedFollows =  JSON.parse(localStorage.getItem('follows'))[userId]

		if (storedFollows === null || storedFollows == undefined) {
			storedFollows = []
		} 
		return storedFollows
	
	}

	static saveFollows(userId, follows) {
		var followsMap = JSON.parse(localStorage.getItem('follows'))
		followsMap[userId] = follows
		localStorage.setItem('follows', JSON.stringify(followsMap))
	}


}

export default LocalStorageManager;