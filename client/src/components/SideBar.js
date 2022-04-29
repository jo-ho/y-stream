import React, { Component } from 'react'
import { ProSidebar, Menu } from 'react-pro-sidebar';
import Thumbnails from './Thumbnails';


export default class SideBar extends Component {
	render() {
		return (
			<div>
				<ProSidebar width="87px">
					<Menu>
						<Thumbnails infos={this.props.infos}  selectStream={this.props.selectStream} />
						<Thumbnails infos={this.props.twitchInfos} selectStream={this.props.selectStream} />
					</Menu>
				</ProSidebar>
			</div>
		)
	}
}
