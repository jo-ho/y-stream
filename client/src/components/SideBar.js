import React, { Component } from 'react'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import ReactTooltip from 'react-tooltip';


export default class SideBar extends Component {
	render() {
		return (
			<div>
				<ProSidebar width="87px">
					<Menu>
						{this.props.infos.map((info) => (
							<MenuItem key={info.resourceId.channelId}>
								<img data-tip={info.title} width="32px" height="32px" src={info.thumbnails.default.url } onClick={() => {this.props.toggleShowEmbed(info.resourceId.channelId)}}/>
								<ReactTooltip />
							</MenuItem>

						))}
		
					</Menu>
				</ProSidebar>
			</div>
		)
	}
}
