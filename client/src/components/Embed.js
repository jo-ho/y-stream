import React, { Component } from 'react'

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/live_stream?channel="
const FRAME_WIDTH = "560"
const FRAME_HEIGHT = "315"

export default class Embed extends Component {
    render() {
        return (
            <iframe width={FRAME_WIDTH} height={FRAME_HEIGHT} src={YOUTUBE_EMBED_URL + this.props.id } frameBorder="0" allowFullScreen/>
        )
    }
}
