import React, { Component } from 'react'
import Embed from './Embed'
import TwitchEmbed from './TwitchEmbed'


export default class Embeds extends Component {

    render() {
		return (
			<div className="embeds-container">
			{this.props.chIds.map((id) => (
				<Embed width={this.props.width} height={this.props.height} key={id} id={id} src={ "https://www.youtube.com/embed/live_stream?channel=" + id} />
			))}

			{this.props.twitchInfos.map((info) => (
				<TwitchEmbed width={this.props.width} height={this.props.height} key={info.id} info={info}  />
			))}
			</div>
		)

      }


}
