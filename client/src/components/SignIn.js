import React from 'react';
import GoogleLogin from 'react-google-login';

const YOUTUBE_SUBS_API = "https://www.googleapis.com/youtube/v3/subscriptions"
const YOUTUBE_VIDEOS_API = "https://www.googleapis.com/youtube/v3/subscriptions"
var channels = []
var channelIds = []
var liveChannels = []

class SignIn extends React.Component {

	constructor(props) {
		super(props);
		this.fetchNextPage = this.fetchNextPage.bind(this);
		this.onSignInSuccess = this.onSignInSuccess.bind(this)
        this.retrieveLiveStatus = this.retrieveLiveStatus.bind(this)
	  }

    retrieveLiveStatus(channelIds) {
        var obj = {ids : channelIds}
        // console.log(obj)

        var url = 'http://localhost:4000/api/' + JSON.stringify(obj)
        fetch(url, {   
            headers: {
            'Content-Type': 'application/json',
         } })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

	fetchNextPage(params) {
		fetch(`${YOUTUBE_SUBS_API}?` + params)
		.then(response => response.json())
		.then(data => {
			// console.log('Success:', data);
            
            data.items.forEach(element => {
                var snip = element.snippet
                channelIds.push(snip.resourceId.channelId)
                channels.push(snip)
            });
			var nextToken = data.nextPageToken

			if (nextToken !== undefined) {
				params.set('pageToken', nextToken)
				this.fetchNextPage(params)

			} else {

                // console.log(channels)

                this.retrieveLiveStatus(channelIds)
                // this.retrieveLiveStatus([channelIds[0]])
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}




    onSignInSuccess(googleUser) {
        // console.log(googleUser)
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