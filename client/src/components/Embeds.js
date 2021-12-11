import React, { Component } from 'react'
import Embed from './Embed'


export default class Embeds extends Component {

    render() {
		return (
			<div className="embeds-container">
			{this.props.chIds.map((info) => (
				<Embed width={this.props.width} height={this.props.height} key={info.resourceId.channelId} id={info.resourceId.channelId} />
			))}
			</div>
		)

      }


}
