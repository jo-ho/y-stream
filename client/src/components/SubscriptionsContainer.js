import React, { Component } from 'react'
import SubscriptionElement from './SubscriptionElement';

export default class SubscriptionsContainer extends Component {
    render() {
        return (
            <div className="subscriptions-container">
                {this.props.subscriptionsInfo.map((info) =>
                 (<SubscriptionElement thumbnailURL={info.thumbnails.default.url} title={info.title}/>))}
            </div>
        )
    }
}
