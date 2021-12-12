import React, { Component } from 'react'
import LocalStorageManager from '../utils/LocalStorageManager';
import MaxFollowModal from './MaxFollowModal';
import SubscriptionElement from './SubscriptionElement';

const maxFollows = 10


export default class SubscriptionsContainer extends Component {

	constructor(props) {
		super(props)
		this.state = {
			maxFollowModalOpen: false,
		};
	}

	toggleFollow = (info) => {
		var followIds = LocalStorageManager.getStoredFollows(this.props.userId)
		var channelId = info.resourceId.channelId

		if (followIds.includes(channelId)) {
			followIds = followIds.filter(id => channelId !== id)
		} else {
			if (followIds.length >= maxFollows) {
				this.setState({ maxFollowModalOpen: true })
				return
			}
			followIds.push(channelId)
		}
		info.isFollowed = !info.isFollowed
		console.log(followIds)
		this.setState({})

		LocalStorageManager.saveFollows(this.props.userId, followIds)
			

	}

	render() {
		return (
			<div className="subscriptions-container">
				<MaxFollowModal toggleShowModal={() => this.setState({ maxFollowModalOpen: false })} isOpen={this.state.maxFollowModalOpen} />

 				{Object.values(this.props.subscriptionsMap).map((info) =>
				(<SubscriptionElement
					key={info.resourceId.channelId} info={info}
					toggleFollow={this.toggleFollow}
				/>))}
			</div>
		)
	}
}
