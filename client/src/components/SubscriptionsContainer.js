import React, { Component } from 'react'
import SubscriptionElement from './SubscriptionElement';

export default class SubscriptionsContainer extends Component {
    render() {
        return (
            <div className="subscriptions-container">
                {this.props.subscriptionsInfo.map((info) =>
                 (<SubscriptionElement info={info} toggleFollow={this.props.toggleFollow} isFollowed={info.isFollowed}/>))}
            </div>
        )
    }
}
