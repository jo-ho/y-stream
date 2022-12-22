const express = require('express');
const app = express(),
      bodyParser = require("body-parser"),
      port = 5000;
const https = require('https');
const cors = require('cors');
const HttpsAgent = require('agentkeepalive').HttpsAgent;

const keepaliveAgent = new HttpsAgent({
	timeout: 600000, // active socket keepalive for 60 seconds
	freeSocketTimeout: 600000, // free socket keepalive for 30 seconds
});

const options = {
	method: 'GET',
	agent: keepaliveAgent,
}

app.use(cors())
app.use(bodyParser.json());

var followChannelIds = []
var liveChannelIds = []


function determineLiveStatus(channelId) {
	return new Promise(resolve => {
		const url = 'https://www.youtube.com/channel/' + channelId + '/live'
		var temp = []

		https.request(url, options, (res) => {
			res.on('data', (chunk) => {
				temp.push(chunk)
			});
			res.on('end', function () {
				var htmlString = temp.join("");

				if (htmlString.includes("watching now") || htmlString.includes("Started streaming") ) {
					liveChannelIds.push(channelId)
				}
				return resolve()
			})
		}).on('error', (err) => {
			console.error(err);
		}).end();

	})
}

app.get('/api/:obj', (req, res) => {

 	liveChannelIds = []
	followChannelIds = JSON.parse(req.params.obj)["ids"]

	var functions = []
	followChannelIds.forEach(channelId => {
		functions.push( determineLiveStatus(channelId) )
	});

	Promise.all(functions).then(() => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.json({channels : liveChannelIds})
	})


})


const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
