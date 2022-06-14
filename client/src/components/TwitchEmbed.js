import React, { Component } from "react";

export default class TwitchEmbed extends Component {
  render() {
    return (
      <div
        className="embed-element"
        style={{
          position: "relative",
          color: "white",
        }}
      >
        <img
          style={{ width: this.props.width, height: this.props.height }}
          src={this.props.info.streamInfo.thumbnail_url}
          alt={this.props.info.streamInfo.channelName}
        />
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "16px",
            textShadow: "black 0px 0px 10px",
          }}
        >
          <img
            style={{
              verticalAlign: "middle",
              width: "32px",
              height: "32px",
              paddingRight: "10px",
            }}
            src={this.props.info.thumbnailUrl}
            alt={this.props.info.channelName}
          />
          <span
            style={{
              whiteSpace: "pre-wrap",
              display: "inline-block",
              verticalAlign: "middle",
              width: this.props.width,
            }}
          >
            <a
              target="_blank"
              href={"https://www.twitch.tv/" + this.props.info.channelName}	
			  className="twitch-stream-title"
            >
              {this.props.info.streamInfo.user_name } | {""}
              {this.props.info.streamInfo.game_name}
            </a>
          </span>
        </div>
      </div>
    );
  }
}
