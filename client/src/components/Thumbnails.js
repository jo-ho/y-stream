import React, { Component } from 'react'

import Thumbnail from './Thumbnail';


export default class Thumbnails extends Component {
	render() {
		return this.props.infos.map((info) => (
			<Thumbnail info={info} selectStream={this.props.selectStream}/>

		))
	}
}
