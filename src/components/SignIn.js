import React from 'react';
import GoogleLogin from 'react-google-login';

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3/subscriptions"

class SignIn extends React.Component {

	constructor(props) {
		super(props);
		this.fetchNextPage = this.fetchNextPage.bind(this);
		this.onSignInSuccess = this.onSignInSuccess.bind(this)
	  }

	fetchNextPage(params) {
		fetch(`${YOUTUBE_API}?` + params)
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data);
			var nextToken = data.nextPageToken

			if (nextToken !== undefined) {
				params.set('pageToken', nextToken)
				this.fetchNextPage(params)

			} else {
				console.log('done');
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}


    onSignInSuccess(googleUser) {
        console.log(googleUser)
        // var profile = googleUser.getBasicProfile();
        // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        // console.log('Name: ' + profile.getName());
        // console.log('Image URL: ' + profile.getImageUrl());
        // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present
        var params =  new URLSearchParams({            
            key : `${process.env.REACT_APP_YOUTUBE_API_KEY}`,
            part: 'snippet',
            mine: true,
            access_token: `${googleUser.accessToken}`,
            maxResults: 50
        })        
        
        // fetch(`${YOUTUBE_API}?` + params)
        // .then(response => response.json())
        // .then(data => {
        //   console.log('Success:', data);
        // })
        // .catch((error) => {
        //   console.error('Error:', error);
        // });
		this.fetchNextPage(params)

    }

    onSignInFail(googleUser) {
        console.log("Sign in failure")
    }

    render() {
        return (
            <GoogleLogin
            clientId="64635892556-vn29tp5i3g7e6dct5td6a68bmcb563ji.apps.googleusercontent.com"
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