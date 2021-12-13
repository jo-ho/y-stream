import React, { Component } from 'react'
import { GoogleLogout } from 'react-google-login';


export default class Logout extends Component {
	onLogoutSuccess = () => {
		this.props.setSignedIn(null)
	}

	onLogoutFail = () => {
		console.log("logout fail")
	}

	render() {
		return (
			<GoogleLogout
				clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
				buttonText="Logout"
				onLogoutSuccess={this.onLogoutSuccess}
				onFailure={this.onLogoutFail}
			/>


		)
	}
}
