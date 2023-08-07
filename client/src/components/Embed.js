import React, { Component } from 'react'



export default class Embed extends Component {
	render() {
		return (
			<div className="embed-element">
				<iframe
					style={{ width: this.props.width, height: this.props.height }}
					src={"https://www.youtube.com/embed/" + this.props.linkId}
					frameborder="0"
					allowFullScreen />
			</div>
		)
	}
}
