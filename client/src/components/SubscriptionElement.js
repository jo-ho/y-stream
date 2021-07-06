import React, { Component } from 'react'

export default class SubscriptionElement extends Component {
    render() {
        return (
            <div style={{textAlign:"center"}}>
                <img src={this.props.thumbnailURL} alt="thumbnail"></img>
                <p >{this.props.title}</p>
            </div>
        )
    }
}
