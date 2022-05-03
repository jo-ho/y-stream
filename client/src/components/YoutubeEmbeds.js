import React, { Component } from "react";
import Embed from "./Embed";

export default class YoutubeEmbeds extends Component {
    render() {
        return (

                <div className="embeds-container">
{ this.props.ids.map((id) => (
                        <Embed
                            width={this.props.width}
                            height={this.props.height}
                            key={id}
                            src={
                                "https://www.youtube.com/embed/live_stream?channel=" +
                                id
                            }
                        />
))}

            </div>
        );
    }
}
