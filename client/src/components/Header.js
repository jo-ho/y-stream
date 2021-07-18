import React, { Component } from 'react'
import { Link } from "react-router-dom";
import SignIn from './SignIn';
import Logout from './Logout';

export default class Header extends Component {
	render() {
		return (
			<div  >
				<nav >
					<ul className="nav-bar">
						<li> <Link to="/">Following</Link></li>
						<li> <Link to="/subscriptions">Subscriptions</Link></li>
						<li><Link to="/watch">Watch</Link></li>
						<li style={{marginLeft : "auto"}}>
							{
								!this.props.isSignedIn ? 
								<SignIn setSignedIn={this.props.setSignedIn}  onGetLiveStatusesDone={this.props.onGetLiveStatusesDone} onGetSubscriptionsDone={this.props.onGetSubscriptionsDone}/> :
								<Logout setSignedIn={this.props.setSignedIn}/>
							}
						</li>

					</ul>

				</nav>
			</div>
		)
	}
}
