const express = require('express');
const path = require('path');
const app = express(),
      bodyParser = require("body-parser");
      port = 4000;
const https = require('https');
const cors = require('cors');
const HttpsAgent = require('agentkeepalive').HttpsAgent;
const { resolveSoa } = require('dns');

const keepaliveAgent = new HttpsAgent({
	timeout: 600000, // active socket keepalive for 60 seconds
	freeSocketTimeout: 600000, // free socket keepalive for 30 seconds
});
const threshold = 0.9
const options = {
	method: 'HEAD',
	agent: keepaliveAgent,
}

app.use(cors())

app.use(bodyParser.json());


// var liveContentLength;
// var channelContentLength;

var ids = []
var i = 0
var j = 0
var liveChannels = []


var liveContentLengths = []
var channelContentLengths = []



function retrieveLiveStatus(channelId) {
	
	return new Promise(resolve => {
		var liveUrl = 'https://www.youtube.com/channel/' + channelId + '/live'
		https.request(liveUrl, options, (res) => {
			liveContentLengths.push(res.headers['content-length'])
	
	
			if (i < ids.length - 1) {
				i += 1
				return resolve(retrieveLiveStatus(ids[i]))
			} else {
				console.log("done live")			
				return resolve(liveContentLengths)
	
			}
	
		}).on('error', (err) => {
			console.error(err);
		}).end();
		
	})  

}

function retrieveChannelStatus(channelId) {
	return new Promise(resolve => {
		var url = 'https://www.youtube.com/channel/' + channelId
		https.request(url, options, (res) => {
			channelContentLengths.push(res.headers['content-length'])
			if (j < ids.length - 1) {
				j += 1
				return resolve(retrieveChannelStatus(ids[j]))
			} else {
				console.log("done channels")						
				return resolve(channelContentLengths)
				
			}
		}).on('error', (err) => {
			console.error(err);
		}).end();
	})

}

function computeLiveStatus(res) {


	for (var i = 0; i < ids.length; i++) {
		console.log(ids[i])
		console.log(liveContentLengths[i] / channelContentLengths[i])
		if (liveContentLengths[i] / channelContentLengths[i] < threshold || liveContentLengths[i] / channelContentLengths[i] > 1.1) {
			console.log("live")
			liveChannels.push(ids[i])
			
		}
		
	}

	var obj = {channels : liveChannels}
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.json(obj)
}

function retrieveStatus(channelId, serverResp) {
	var liveUrl = 'https://www.youtube.com/channel/' + channelId + '/live'

	https.request(liveUrl, options, (res) => {
		var liveContentLength = res.headers['content-length']
		// console.log(res.headers)
		var chUrl = 'https://www.youtube.com/channel/' + channelId
		https.request(chUrl, options, (res2) => {
			var channelContentLength = res2.headers['content-length']

			// console.log("liveCL: " + liveContentLength)
			// console.log("channel: " + channelContentLength)
			// console.log(channelId)
			// console.log(liveContentLength / channelContentLength)
			if (liveContentLength / channelContentLength < threshold) {
				console.log("live")
				liveChannels.push(channelId)
			} else {
				console.log("not live")
			}
			if (i < ids.length - 1) {
				i += 1
				retrieveStatus(ids[i], serverResp)
			} else {
				console.log("done")
				var obj = {channels : liveChannels}
				serverResp.header("Access-Control-Allow-Origin", "*");
				serverResp.header("Access-Control-Allow-Headers", "X-Requested-With");
				serverResp.json(obj)
			}
		}).on('error', (err) => {
			console.error(err);
		}).end();
	}).on('error', (err) => {
	console.error(err);
	}).end();
}

app.get('/api/:obj', (req, res) => {
	console.log('/api called!')
	liveContentLengths = []
	channelContentLengths = []
 	ids = []
  	i = 0
 	j = 0
 	liveChannels = []


	ids = JSON.parse(req.params.obj)["ids"]
	// var channelId = "UCiqtXLBjDT6TRLhetkqO4nA"
	//   console.log(ids)

	Promise.all([retrieveLiveStatus(ids[0]), retrieveChannelStatus(ids[0])]).then(values  => {
		console.log(liveContentLengths)
		console.log(values)
		computeLiveStatus(res)
	});


	// retrieveStatus(ids[0], res)
})


app.get('/', (req,res) => {
  res.send(`<h1>API Running on the port ${port}</h1>`);
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});