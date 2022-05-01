import React, { Component } from 'react'
import { GoogleLogout } from 'react-google-login';


export default class Logout extends Component {
	onLogoutSuccess = () => {
		this.props.setSignedIn(null)
	}

	onLogoutFail = () => {
		alert("An error occured when logging out")
	}

	render() {
		return (
			<GoogleLogout
			className='menu-item'
				clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
				buttonText="Logout"
				onLogoutSuccess={this.onLogoutSuccess}
				onFailure={this.onLogoutFail}
			/>


		)
	}
}
