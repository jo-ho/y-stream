import React, { Component } from 'react'



export default class Embed extends Component {
	render() {
		return (
			<div className="embed-element">
				<iframe
					style={{ width: this.props.width, height: this.props.height }}
					src={this.props.src}
					frameBorder="0"
					allowFullScreen />
			</div>
		)
	}
}
