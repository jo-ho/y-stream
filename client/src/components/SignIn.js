import React from 'react';
import GoogleLogin from 'react-google-login';
import YoutubeService from '../services/YoutubeService';


class SignIn extends React.Component {

	constructor(props) {
		super(props)
		this.youtubeService = new YoutubeService()
	}

	onSignInSuccess = (googleUser) => {
		this.props.setSignedIn(googleUser.getId())
		this.youtubeService.getUserSubscriptions(googleUser, this.props.onGetSubscriptionsDone)

	}

	onSignInFail(googleUser) {
		alert("An error occured when signing in")
	}

	render() {
		return (
			<GoogleLogin
				clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
				onSuccess={this.onSignInSuccess}
				onFailure={this.onSignInFail}
				cookiePolicy={'single_host_origin'}
				isSignedIn={true}
				scope="https://www.googleapis.com/auth/youtube.readonly"
			/>
		)
	}
}

export default SignIn;