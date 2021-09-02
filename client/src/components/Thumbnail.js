import React, { Component } from 'react'
import { MenuItem } from 'react-pro-sidebar';
import ReactTooltip from 'react-tooltip';




export default class Thumbnail extends Component {


	render() {



		return (
			<MenuItem >
				<	
					img data-tip={this.props.info.title}
					width="32px" height="32px" src={this.props.info.thumbnails.default.url}
					onClick={() => { this.props.selectStream(this.props.info.resourceId.channelId) }} 
				/>
				<ReactTooltip />
			</MenuItem>
		)
	}
}



