import React from "react";

class TwitchSignIn extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a

        href={`https://id.twitch.tv/oauth2/authorize?
		response_type=token&
		client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&
		redirect_uri=${process.env.REACT_APP_CLIENT_URL}&
		scope=user%3Aread%3Afollows`}
      >
        Connect with Twitch
      </a>
    );
  }
};

export default TwitchSignIn;
