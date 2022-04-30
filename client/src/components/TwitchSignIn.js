import React from "react";
import LocalStorageManager from "../utils/LocalStorageManager";

class TwitchSignIn extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {!LocalStorageManager.getAccessToken() ? (
                    <a
                        href={`https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_CLIENT_URL}&scope=user%3Aread%3Afollows`}
                    >
                        Connect with Twitch
                    </a>
                ) : (
                    <span>Connected</span>
                )}
            </div>
        );
    }
}

export default TwitchSignIn;
