import React, { Component } from 'react'
import { Link } from "react-router-dom";
import SignIn from './SignIn';
import Logout from './Logout';
import TwitchSignIn from './TwitchSignIn';
import LoginDropdown from './LoginDropdown';

export default class Header extends Component {
	render() {
		return (
			<div>
				<nav>
					<ul className="nav-bar">
						<li> <Link to="/">Following</Link></li>
						<li> <Link to="/subscriptions">Subscriptions</Link></li>
						<li><Link to="/watch">Watch</Link></li>


						<LoginDropdown 
						isSignedIn={this.props.isSignedIn}
						onGetLiveStatusesDone={this.props.onGetLiveStatusesDone} onGetSubscriptionsDone={this.props.onGetSubscriptionsDone} setSignedIn={this.props.setSignedIn}>

						</LoginDropdown>

					</ul>


				</nav>
			</div>
		)
	}
}
