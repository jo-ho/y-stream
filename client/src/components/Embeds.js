import React, { Component } from 'react'
import TwitchEmbeds from './TwitchEmbeds';
import YoutubeEmbeds from './YoutubeEmbeds';

export default class Embeds extends Component {
  render() {
	  let content;

	  let width = "25vw"
	  let height = "30vh"

	  if (this.props.userId) {
		if (this.props.infos == null) {
			content = <p>Loading ...</p>
		} else if (this.props.infos.length == 0) {
			content = <p>No streams are live</p>
		} else {
			if (this.props.isYoutube) {
				const ids = (this.props.infos != null) ? this.props.infos.map(info => info.id) : []
				content = <YoutubeEmbeds 
				width={width}
				height={height}
				ids={ids}/>
			} else {

				content = <TwitchEmbeds 
				width={width}
				height={height}
				infos={this.props.infos}/>
			}
		} 
	} else {
		content = <p>Please login</p>
	}
	return (
		<div>

	  {content}

		</div>
	)
  }
}
