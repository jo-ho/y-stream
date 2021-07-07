import React, { Component } from 'react'

export default class SubscriptionElement extends Component {
    render() {
        return (
            <div className="subscription-element">
                <img src={this.props.thumbnailURL} alt="thumbnail"></img>
                <p >{this.props.title}</p>
                <button type="button" className="follow-button" onClick={() => this.props.addFollow(this.props.id)}>Follow</button>
            </div>
        )
    }
}
