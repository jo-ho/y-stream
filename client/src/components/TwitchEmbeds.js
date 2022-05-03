import React, { Component } from "react";
import TwitchEmbed from "./TwitchEmbed";

export default class TwitchEmbeds extends Component {
  render() {
    return (
		<div className="embeds-container">
			{this.props.infos.map((info) => (
                        <TwitchEmbed
                            width={this.props.width}
                            height={this.props.height}
                            key={info.id}
                            info={info}
                        />
                    ))}
		</div>
    );
  }
}
