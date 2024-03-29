import React, { Component } from 'react'
import Logout from './Logout';
import SignIn from './SignIn';
import TwitchSignIn from './TwitchSignIn';

class LoginDropdown extends Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false
		};

	}


  render() {
	return (
	  <li style={{ marginLeft: "auto" }} >
		  <a  href='#' onClick={() => this.setState({open: !this.state.open})}>Accounts</a>

		  <ul style={{listStyle: 'none'}} className='dropdown' hidden={!this.state.open}>
			  <TwitchSignIn revokeTwitchToken={this.props.revokeTwitchToken}/>
			  <li >
							{
								!this.props.isSignedIn ?
									<SignIn onGetLiveStatusesDone={this.props.onGetLiveStatusesDone} onGetSubscriptionsDone={this.props.onGetSubscriptionsDone} setSignedIn={this.props.setSignedIn} /> :
									<Logout setSignedIn={this.props.setSignedIn} />


							}
</li>
		  </ul>

		</li>
	)
  }


}

export default LoginDropdown;
