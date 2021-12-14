
class ProxyService {


	getLiveChannels (channelIds, callback) {
		var channels = { ids: channelIds }
		var url = `${process.env.REACT_APP_SERVER_URL}` + 'api/' + JSON.stringify(channels)
		fetch(url, {
			headers: {
				'Content-Type': 'application/json',
			}
		})
			.then(response => response.json())
			.then(data => 
				callback(data.channels)
			)
	}
	
}


export default ProxyService