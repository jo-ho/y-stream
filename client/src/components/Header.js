import React, { Component } from 'react'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
  } from "react-router-dom";
import SignIn from './SignIn';

export default class Header extends Component {
	render() {
		return (
			<div  >
				<nav >
					<ul className="nav-bar">
						<li> <Link to="/">Following</Link></li>
						<li> <Link to="/subscriptions">Subscriptions</Link></li>
						<li><Link to="/watch">Watch</Link></li>
						<li style={{marginLeft : "auto"}}><SignIn  onGetLiveStatusesDone={this.props.onGetLiveStatusesDone} onGetSubscriptionsDone={this.props.onGetSubscriptionsDone}/></li>

					</ul>

				</nav>
			</div>
		)
	}
}
