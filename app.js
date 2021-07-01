const express = require('express');
const path = require('path');
const app = express(),
      bodyParser = require("body-parser");
      port = 4000;
const https = require('https');
var cors = require('cors');

app.use(cors())

app.use(bodyParser.json());
const threshold = 0.6

// var liveContentLength;
// var channelContentLength;

var ids = []
var i = 0
var liveStatuses = []

function retrieveLiveStatus(channelId, serverResp) {
	var liveUrl = 'https://www.youtube.com/channel/' + channelId + '/live'

	https.request(liveUrl, { method: 'HEAD' }, (res) => {
	var liveContentLength = res.headers['content-length']
	var chUrl = 'https://www.youtube.com/channel/' + channelId
	https.request(chUrl, { method: 'HEAD' }, (res2) => {
		var channelContentLength = res2.headers['content-length']
		// console.log("liveCL: " + liveContentLength)
		// console.log("channel: " + channelContentLength)
		console.log(channelId)
		console.log(liveContentLength / channelContentLength)
		if (liveContentLength / channelContentLength < threshold) {
			console.log("live")
			liveStatuses.push(true)
		} else {
			console.log("not live")
			liveStatuses.push(false)
		}
		if (i < ids.length - 1) {
			i += 1
			retrieveLiveStatus(ids[i], serverResp)
		} else {
			console.log("done")
			var obj = {statuses : liveStatuses}
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

  ids = JSON.parse(req.params.obj)["ids"]
  // var channelId = "UCiqtXLBjDT6TRLhetkqO4nA"
  console.log(ids)
  retrieveLiveStatus(ids[0], res)
});






app.get('/', (req,res) => {
  res.send(`<h1>API Running on the port ${port}</h1>`);
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});