import React from "react";
import LocalStorageManager from "../utils/LocalStorageManager";

class TwitchSignIn extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li>
                {!LocalStorageManager.getAccessToken() ? (
                    <a
                        href={`https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_CLIENT_URL}&scope=user%3Aread%3Afollows`}
                    >
                       <button className="twitch-login">Connect</button> 
                    </a>
                ) : (
                    <button onClick={() => {this.props.setSignedInTwitch(false)}} className="twitch-login" >Connected</button>
                )}
            </li>
        );
    }
}

export default TwitchSignIn;
