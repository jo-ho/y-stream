import React, { Component } from 'react'
import { Link } from "react-router-dom";
import LoginDropdown from './LoginDropdown';

export default class Header extends Component {
	render() {
		return (
			<div>
				<nav>
					<ul className="nav-bar">
						<li> <Link to="/">Following</Link></li>
						<li> <Link to="/subscriptions">Subscriptions</Link></li>


						<LoginDropdown
						isSignedIn={this.props.isSignedIn}
						onGetLiveStatusesDone={this.props.onGetLiveStatusesDone} onGetSubscriptionsDone={this.props.onGetSubscriptionsDone} setSignedIn={this.props.setSignedIn} revokeTwitchToken={this.props.revokeTwitchToken}>

						</LoginDropdown>

					</ul>


				</nav>
			</div>
		)
	}
}
