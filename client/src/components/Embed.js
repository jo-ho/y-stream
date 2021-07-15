import React, { Component } from 'react'

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/live_stream?channel="
const FRAME_WIDTH = "560"
const FRAME_HEIGHT = "315"

export default class Embed extends Component {
    render() {
        return (
			<div className="embed-element">
            <iframe style={{width: this.props.width, height: this.props.height}} 
			src={
				this.props.autoPlay ?
				YOUTUBE_EMBED_URL + this.props.id + "&autoplay=1" : 
				YOUTUBE_EMBED_URL + this.props.id } frameBorder="0" allowFullScreen/>
			</div>
        )
    }
}
