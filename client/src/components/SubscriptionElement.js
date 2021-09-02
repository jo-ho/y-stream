import React, { Component } from 'react'

export default class SubscriptionElement extends Component {


	render() {
		return (
			<div className="subscription-element">
				<img src={this.props.info.thumbnails.default.url} alt="thumbnail"></img>
				<p >{this.props.info.title}</p>
				<button
					type="button"
					className={this.props.info.isFollowed ? "followed-button" : "follow-button"}
					onClick={() => { this.props.toggleFollow(this.props.info) }}
				>
					{this.props.info.isFollowed ? "Followed" : "Follow"}
				</button>
			</div>
		)
	}
}
