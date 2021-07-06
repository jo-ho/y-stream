import React, { Component } from 'react'


export default class Embeds extends Component {
    render() {
        return (
            <div>
                {this.props.chIds.map((id) =>
                 (<iframe width="560" height="315" src={"https://www.youtube.com/embed/live_stream?channel=" + id } frameBorder="0" allowFullScreen></iframe>))}
            </div>
        )
    }
}
