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
const lowerThreshold = 0.9
const upperThreshold = 1.05
const options = {
	method: 'HEAD',
	agent: keepaliveAgent,
}

app.use(cors())

app.use(bodyParser.json());


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
				return resolve(channelContentLengths)
			}
		}).on('error', (err) => {
			console.error(err);
		}).end();
	})

}

function computeLiveStatus(res) {
	for (var i = 0; i < ids.length; i++) {

		if (liveContentLengths[i] / channelContentLengths[i] < lowerThreshold || liveContentLengths[i] / channelContentLengths[i] > upperThreshold) {
			liveChannels.push(ids[i])

			
		}
	}

	var obj = {channels : liveChannels}
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.json(obj)
}


app.get('/api/:obj', (req, res) => {
	liveContentLengths = []
	channelContentLengths = []
 	ids = []
  	i = 0
 	j = 0
 	liveChannels = []

	ids = JSON.parse(req.params.obj)["ids"]

	Promise.all([retrieveLiveStatus(ids[0]), retrieveChannelStatus(ids[0])]).then(()  => {
		computeLiveStatus(res)
	});
})


const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

app.listen((process.env.PORT || 5000), () => {
    console.log(`Server listening on the port::${port}`);
});