import React, { Component } from 'react'
import { Link } from "react-router-dom";
import SignIn from './SignIn';
import Logout from './Logout';
import TwitchSignIn from './TwitchSignIn';

export default class Header extends Component {
	render() {
		return (
			<div>
				<nav>
					<ul className="nav-bar">
						<li> <Link to="/">Following</Link></li>
						<li> <Link to="/subscriptions">Subscriptions</Link></li>
						<li><Link to="/watch">Watch</Link></li>
						<ul>
						<li style={{ marginLeft: "auto" }}>
							{
								!this.props.isSignedIn ?
									<SignIn onGetLiveStatusesDone={this.props.onGetLiveStatusesDone} onGetSubscriptionsDone={this.props.onGetSubscriptionsDone} setSignedIn={this.props.setSignedIn} /> :
									<Logout setSignedIn={this.props.setSignedIn} />
								

							}

						</li>
						<li>
						<TwitchSignIn/>
						</li>
						</ul>

					</ul>


				</nav>
			</div>
		)
	}
}
