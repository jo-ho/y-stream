import React, { Component } from "react";
import Embed from "./Embed";
import TwitchEmbed from "./TwitchEmbed";

export default class Embeds extends Component {
    render() {
        return (
            <div>
                <h3> Twitch </h3>

                <div className="embeds-container">
                    {this.props.twitchInfos.map((info) => (
                        <TwitchEmbed
                            width={this.props.width}
                            height={this.props.height}
                            key={info.id}
                            info={info}
                        />
                    ))}
                </div>

                <h3> Youtube </h3>

                <div className="embeds-container">
                    {this.props.chIds.map((id) => (
                        <Embed
                            width={this.props.width}
                            height={this.props.height}
                            key={id}
                            id={id}
                            src={
                                "https://www.youtube.com/embed/live_stream?channel=" +
                                id
                            }
                        />
                    ))}
                </div>
            </div>
        );
    }
}
