import React from 'react';
import GoogleLogin from 'react-google-login';

class SignIn extends React.Component {


    onSignInSuccess(googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    }

    onSignInFail(googleUser) {
        console.log("Sign in failure")
    }

    render() {
        return (
            <GoogleLogin
            clientId="64635892556-vn29tp5i3g7e6dct5td6a68bmcb563ji.apps.googleusercontent.com"
            buttonText="Sign In"
            onSuccess={this.onSignInSuccess}
            onFailure={this.onSignInFail}
            cookiePolicy={'single_host_origin'}
          />
        )
    }
}

export default SignIn;