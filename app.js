const express = require('express');
const path = require('path');
const app = express(),
      bodyParser = require("body-parser");
      port = 4000;
const https = require('https');
const cors = require('cors');
const HttpsAgent = require('agentkeepalive').HttpsAgent;

const keepaliveAgent = new HttpsAgent({
	timeout: 600000, // active socket keepalive for 60 seconds
	freeSocketTimeout: 600000, // free socket keepalive for 30 seconds
});
const threshold = 0.6
const options = {
	method: 'HEAD',
	agent: keepaliveAgent
}

app.use(cors())

app.use(bodyParser.json());


// var liveContentLength;
// var channelContentLength;

var ids = []
var i = 0
var j = 0
var liveChannels = []
var liveDone = false
var channelDone = false

var arr1 = []
var arr2 = []

function retrieveLiveStatus(channelId, serverResp) {
	var liveUrl = 'https://www.youtube.com/channel/' + channelId + '/live'
	https.request(liveUrl, options, (res) => {
		arr1.push(res.headers['content-length'])


		if (i < ids.length - 1) {
			i += 1
			retrieveLiveStatus(ids[i], serverResp)
		} else {
			console.log("done live")
			liveDone = true
			if (channelDone) {
				computeLiveStatus(arr1, arr2, serverResp)
			}
			

		}

	}).on('error', (err) => {
		console.error(err);
	}).end();
}

function retrieveChannelStatus(channelId, serverResp) {
	var chUrl = 'https://www.youtube.com/channel/' + channelId
	https.request(chUrl, options, (res2) => {
		arr2.push(res2.headers['content-length'])
		if (j < ids.length - 1) {
			j += 1
			retrieveChannelStatus(ids[j], serverResp)
		} else {
			console.log("done channels")
			channelDone = true
			if (liveDone) {
				computeLiveStatus(arr1, arr2, serverResp)
			}
			
		}
	}).on('error', (err) => {
		console.error(err);
	}).end();
}

function computeLiveStatus(liveContentLengths, channelContentLengths, serverResp) {


	for (var i = 0; i < ids.length; i++) {
		if (liveContentLengths[i] / channelContentLengths[i] < threshold) {
			console.log("live")
			liveChannels.push(ids[i])
			
		}
		
	}

	var obj = {channels : liveChannels}
	serverResp.header("Access-Control-Allow-Origin", "*");
	serverResp.header("Access-Control-Allow-Headers", "X-Requested-With");
	serverResp.json(obj)
}

app.get('/api/:obj', (req, res) => {
  console.log('/api called!')
 	ids = []
  	i = 0
 	j = 0
 	liveChannels = []
	liveDone = false
  	channelDone = false

  ids = JSON.parse(req.params.obj)["ids"]
  // var channelId = "UCiqtXLBjDT6TRLhetkqO4nA"
//   console.log(ids)
  retrieveLiveStatus(ids[0], res)
  retrieveChannelStatus(ids[0], res)
});






app.get('/', (req,res) => {
  res.send(`<h1>API Running on the port ${port}</h1>`);
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});