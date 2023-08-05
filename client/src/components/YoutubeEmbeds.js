import React, { Component } from "react";
import Embed from "./Embed";

export default class YoutubeEmbeds extends Component {
    render() {
        return (

                <div className="embeds-container" >
{ this.props.infos.map((info) => (
  <div>
    <a key={info.id} target="_blank" rel="noopener noreferrer" href={"https://www.youtube.com/channel/" + info.id + "/live"}>{info.title}</a>
                        <Embed
                            width={this.props.width}
                            height={this.props.height}
                            key={info.id}
                            src={
                              "https://www.youtube.com/embed/live_stream?channel=" + info.id
                            }
                        />

  </div>

))}

            </div>
        );
    }
}
