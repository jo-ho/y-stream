import React from 'react';
import GoogleLogin from 'react-google-login';
import LocalStorageManager from '../utils/LocalStorageManager';

const YOUTUBE_SUBS_API = "https://www.googleapis.com/youtube/v3/subscriptions"
var channels = []
var channelIds = []

class SignIn extends React.Component {

	

	fetchNextPage = (params, userId) => {
		fetch(`${YOUTUBE_SUBS_API}?` + params)
		.then(response => response.json())
		.then(data => {
            var storedFollows =  LocalStorageManager.getStoredFollows(userId)
            data.items.forEach(element => {
                var snip = element.snippet
				var channelId = snip.resourceId.channelId
				if (storedFollows.includes(channelId)) {
					snip.isFollowed = true
				} else {
					snip.isFollowed = false

				}
                channelIds.push()
                channels.push(snip)
            });
			var nextToken = data.nextPageToken

			if (nextToken !== undefined) {
				params.set('pageToken', nextToken)
				this.fetchNextPage(params)

			} else {
                this.props.onGetSubscriptionsDone(channels)
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

    onSignInSuccess = (googleUser) => {
        channels = []
        var params =  new URLSearchParams({            
            key : `${process.env.REACT_APP_YOUTUBE_API_KEY}`,
            part: 'snippet',
            mine: true,
            access_token: `${googleUser.accessToken}`,
            maxResults: 50
        })        
        
		this.fetchNextPage(params, googleUser.getId())
		this.props.setSignedIn(true, googleUser.getId())
    }

    onSignInFail(googleUser) {
        console.log("Sign in failure")
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