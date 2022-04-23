import React, { Component } from 'react'
import { MenuItem } from 'react-pro-sidebar';
import ReactTooltip from 'react-tooltip';




export default class Thumbnail extends Component {


	render() {



		return (
			<MenuItem >
				<	
					img data-tip={this.props.info.title}
					width="32px" height="32px" src={this.props.info.thumbnailUrl}
					onClick={() => { this.props.selectStream(this.props.info.channelId) }} 
				/>
				<ReactTooltip />
			</MenuItem>
		)
	}
}



