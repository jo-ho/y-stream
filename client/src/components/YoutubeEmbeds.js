import React, { Component } from "react";
import Embed from "./Embed";

export default class YoutubeEmbeds extends Component {
    render() {
        return (
            <div className="embeds-container">
                {this.props.infos.map((info) => (
                    <div key={info.id}>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={"https://www.youtube.com/channel/" + info.id + "/live"}
                        >
                            {info.title}
                        </a>
                        <Embed
                            width={this.props.width}
                            height={this.props.height}
                            linkId={info.streamInfo}
                        />
                    </div>
                ))}
            </div>
        );
    }
}
