import React, { Component } from 'react'
import { MenuItem } from 'react-pro-sidebar';
import ReactTooltip from 'react-tooltip';




export default class Thumbnail extends Component {


	render() {
		return (
			<MenuItem >
				<img
        alt={this.props.info.title}
        data-tip={this.props.info.title}
					width="32px" height="32px" src={this.props.info.thumbnailUrl}
					onClick={() => {
						if (typeof this.props.info.streamInfo === "string") {
							window.open("https://www.youtube.com/channel/" + this.props.info.id + "/live", '_blank', 'noopener noreferrer');
						} else {
              window.open(this.props.streamInfo, '_blank', 'noopener noreferrer');
						}
						 }}
				/>
				<ReactTooltip />
			</MenuItem>
		)
	}
}



