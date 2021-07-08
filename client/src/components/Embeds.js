import React, { Component } from 'react'
import Embed from './Embed'


export default class Embeds extends Component {

    render() {
        return this.props.chIds.map((id) => (
            <Embed key={id} id={id} />
        ))
      }


}
