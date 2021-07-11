import React, { Component } from 'react'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

export default class SideBar extends Component {
	render() {
		return (
			<div>
				<ProSidebar width="87px">
					<Menu>
						{this.props.infos.map((info) => (
							<MenuItem key={info.resourceId.channelId}><img width="32px" height="32px" src={info.thumbnails.default.url}/></MenuItem>
						))}
		
					</Menu>
				</ProSidebar>
			</div>
		)
	}
}
