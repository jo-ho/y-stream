class Livestream {
	constructor(title, thumbnailUrl, id, channelName = "", streamInfo = null) {
	  this.title = title;
	  this.thumbnailUrl = thumbnailUrl;
	  this.id = id;
	  this.channelName = channelName
	  this.streamInfo = streamInfo
	}
  }

export default Livestream;
