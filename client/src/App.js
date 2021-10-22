import './App.css';
import Embeds from './components/Embeds';
import Embed from './components/Embed';
import SubscriptionsContainer from './components/SubscriptionsContainer';
import SideBar from './components/SideBar';
import React from 'react'
import Header from './components/Header';
import MaxFollowModal from './components/MaxFollowModal';
import ReactModal from 'react-modal'
import LocalStorageManager from './utils/LocalStorageManager';
import 'react-pro-sidebar/dist/css/styles.css';

import {

	Switch,
	Route,
	withRouter
} from "react-router-dom";

const refreshTimer = 60000
const maxFollows = 10

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			liveChannelIds: [],
			liveChannelInfos: [],
			subscriptionsInfo: [],
			subscriptionsMap: {},
			followIds: [],
			watchingStreamId: null,
			isSignedIn: false,
			userId: null,
			showModal: false
		};
	}

	componentDidMount() {
		ReactModal.setAppElement('body')
		LocalStorageManager.initialize()
	}

	updateLiveChannelInfos = (channelIds) => {
		this.setState({
			liveChannelIds: channelIds
		}, () => {
			var infos = []
			this.state.liveChannelIds.forEach(id => {
				var info = this.state.subscriptionsMap[id]
				if (info !== undefined) {
					infos.push(info)

				}
			});
			this.setState({
				liveChannelInfos: infos
			})
		});
	}

	addSubscriptionsInfos = (infos, userId) => {
		this.setState({
			subscriptionsInfo: infos
		}, () => {
			var map = {}
			this.state.subscriptionsInfo.forEach(info => {
				map[info.resourceId.channelId] = info
			});
			this.setState({
				subscriptionsMap: map
			}, () => {
				LocalStorageManager.syncFollowsAndSubscriptions(userId, this.state.subscriptionsMap)
				this.setSignedIn(true, userId)
			});
		});
	}

	toggleFollow = (info) => {
		var followIds = LocalStorageManager.getStoredFollows(this.state.userId)
		var channelId = info.resourceId.channelId

		if (followIds.includes(channelId)) {
			followIds = followIds.filter(id => channelId !== id)
		} else {
			if (followIds.length >= maxFollows) {
				this.toggleShowModal(true)
				return
			}
			followIds.push(channelId)
		}
		info.isFollowed = !info.isFollowed

		this.setState({
			followIds: followIds
		}, () => {
			LocalStorageManager.saveFollows(this.state.userId, this.state.followIds)
		})
	}



	retrieveLiveStatus = (channelIds) => {
		var obj = { ids: channelIds }
		var url = 'https://radiant-mesa-24770.herokuapp.com/api/' + JSON.stringify(obj)
		fetch(url, {
			headers: {
				'Content-Type': 'application/json',
			}
		})
			.then(response => response.json())
			.then(data => {
				this.updateLiveChannelInfos(data.channels)
				setTimeout(() => {
					if (this.state.userId !== null) {
						this.retrieveLiveStatus(LocalStorageManager.getStoredFollows(this.state.userId))
					}
				}, refreshTimer)
			})
	}

	selectStream = (channelId) => {
		this.setState({
			watchingStreamId: channelId
		}, () => { this.props.history.push('/watch') })
	}

	setSignedIn = (value, userId) => {
		this.setState({
			isSignedIn: value,
			userId: userId
		}, () => {
			if (!value) {
				this.setState({
					watchingStreamId: null
				})
			} else {
				var storedFollows = LocalStorageManager.getStoredFollows(userId)
				this.retrieveLiveStatus(storedFollows)
				this.setState({
					followIds: storedFollows
				})
			}


		})
	}

	toggleShowModal = (value) => {
		this.setState({
			showModal: value
		})
	}


	render() {
		return (
			<div className="App">
				<SideBar infos={this.state.isSignedIn ? this.state.liveChannelInfos : []} selectStream={this.selectStream} />
				<main className="main-content">
					<Header setSignedIn={this.setSignedIn} isSignedIn={this.state.isSignedIn} onGetSubscriptionsDone={this.addSubscriptionsInfos} />
					<Switch>
						<Route exact path="/">
							{this.state.isSignedIn ?
								<div style={{ marginRight: 'auto' }}>
									<h3 > Live And Upcoming </h3>
									<Embeds width={"25vw"} height={"30vh"} chIds={this.state.liveChannelIds} />
								</div>
								:
								<p>Please login</p>
							}
						</Route>
						<Route path="/subscriptions">
							{this.state.isSignedIn ?
								<div style={{ marginRight: 'auto' }}>
									<h3> Subscriptions </h3>
									<SubscriptionsContainer subscriptionsInfo={this.state.subscriptionsInfo} toggleFollow={this.toggleFollow} />
									<MaxFollowModal toggleShowModal={this.toggleShowModal} showModal={this.state.showModal} />
								</div>
								:
								<p>Please login</p>
							}
						</Route>
						<Route path="/watch">
							{this.state.isSignedIn ?
								this.state.watchingStreamId !== null ?
									<Embed autoPlay={true} width={"90vw"} height={"90vh"} id={this.state.watchingStreamId} /> :
									<p>Select a stream</p> :
								<p>Please login</p>
							}
						</Route>
					</Switch>
				</main>
			</div>
		);
	}
}

export default withRouter(App);
