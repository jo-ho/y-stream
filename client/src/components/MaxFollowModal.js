import React, { Component } from 'react'
import ReactModal from 'react-modal'


const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		backgroundColor: '#282c34',
		color: 'white',
	},
};

export default class MaxFollowModal extends Component {
	render() {
		return (
			<ReactModal
				isOpen={this.props.showModal}
				contentLabel="Inline Styles Modal Example"
				style={customStyles}
			>
				<p>Max follows reached!</p>
				<button className="follow-button" onClick={() => this.props.toggleShowModal(false)}>Close</button>
			</ReactModal>
		)
	}
}
