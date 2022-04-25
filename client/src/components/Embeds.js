import React, { Component } from 'react'
import Embed from './Embed'


export default class Embeds extends Component {

    render() {
		return (
			<div className="embeds-container">
			{this.props.chIds.map((id) => (
				<Embed width={this.props.width} height={this.props.height} key={id} id={id} src={ "https://www.youtube.com/embed/live_stream?channel=" + id} />
			))}

			{this.props.twitchNames.map((name) => (
				<Embed width={this.props.width} height={this.props.height} key={name} id={name} src={ "https://player.twitch.tv/?channel=" + name + "&parent=localhost&autoplay=false" } />
			))}
			</div>
		)

      }


}
