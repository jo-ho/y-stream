import React from 'react';
import GoogleLogin from 'react-google-login';

const YOUTUBE_SUBS_API = "https://www.googleapis.com/youtube/v3/subscriptions"
var channels = []
var channelIds = []

class SignIn extends React.Component {

	constructor(props) {
		super(props);
		this.fetchNextPage = this.fetchNextPage.bind(this);
		this.onSignInSuccess = this.onSignInSuccess.bind(this)
	  }

	fetchNextPage(params) {
		fetch(`${YOUTUBE_SUBS_API}?` + params)
		.then(response => response.json())
		.then(data => {
            var storedFollows =  JSON.parse(localStorage.getItem('follows')) 
			if (storedFollows === null) {
				storedFollows = []
			} 
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


                // this.props.onGetLiveStatusesDone(channelIds)
                console.log(channels)
                this.props.onGetSubscriptionsDone(channels)
                // this.retrieveLiveStatus(channelIds.slice(0, 21))
                // this.retrieveLiveStatus([channelIds[0]])
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

    onSignInSuccess(googleUser) {
        channels = []
        var params =  new URLSearchParams({            
            key : `${process.env.REACT_APP_YOUTUBE_API_KEY}`,
            part: 'snippet',
            mine: true,
            access_token: `${googleUser.accessToken}`,
            maxResults: 50
        })        
        
		this.fetchNextPage(params)
		this.props.setSignedIn()


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