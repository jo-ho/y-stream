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

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			liveChannelInfos: null,
			subscriptionsMap: {},
			watchingStreamId: null,
			userId: null,
		};
	}

	componentDidMount() {
		ReactModal.setAppElement('body')
		LocalStorageManager.initialize()
	}

	updateLiveChannelInfos = (channelIds) => {

		var infos = []
		channelIds.forEach(id => {
			var info = this.state.subscriptionsMap[id]
			if (info !== undefined) {
				infos.push(info)

			}
		});
		console.log(infos)
		this.setState({
			liveChannelInfos: infos

		})

	}

	addSubscriptionsInfos = (infos, userId) => {

		console.log("sub infos", infos)
		var map = {}
		infos.forEach(info => {
			map[info.resourceId.channelId] = info
		});

		console.log("sub map", map)

		this.setState({
			subscriptionsMap: map
		}, () => {
			LocalStorageManager.syncFollowsAndSubscriptions(userId, this.state.subscriptionsMap)
			this.setSignedIn(true, userId)
		});

	}





	retrieveLiveStatus = (channelIds) => {
		var obj = { ids: channelIds }
		var url = `${process.env.REACT_APP_SERVER_URL}` + 'api/' + JSON.stringify(obj)
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
			userId: userId
		}, () => {
			if (!userId) {
				this.setState({
					watchingStreamId: null
				})
			} else {
				this.retrieveLiveStatus(LocalStorageManager.getStoredFollows(userId))
			}


		})
	}

	render() {

		const userId = this.state.userId
		const liveChannelInfos = this.state.liveChannelInfos
		const isSignedIn = userId != null
		const channelIds = (liveChannelInfos != null) ? liveChannelInfos.map(info => info.resourceId.channelId) : []
		let mainContent;
		if (userId != null) {
			if (liveChannelInfos == null) {
				mainContent = <p>Loading ...</p>
			} else if (liveChannelInfos.length == 0 ) {
				mainContent = <p>No streams are live</p>
			} else {
				mainContent = <Embeds width={"25vw"} height={"30vh"} chIds={channelIds} />
			}
		} else {
			mainContent = <p>Please login</p>
		}
		return (
			<div className="App">
				<SideBar infos={isSignedIn && liveChannelInfos ? liveChannelInfos : []} selectStream={this.selectStream} />
				<main className="main-content">
					<Header setSignedIn={this.setSignedIn} isSignedIn={isSignedIn} onGetSubscriptionsDone={this.addSubscriptionsInfos} />
					<Switch>
						<Route exact path="/">
							<h3 > Live </h3>
							{mainContent}

						</Route>
						<Route path="/subscriptions">
							{isSignedIn ?
								<div style={{ marginRight: 'auto' }}>
									<h3> Subscriptions </h3>
									<SubscriptionsContainer subscriptionsMap={this.state.subscriptionsMap} userId={userId} />
								</div>
								:
								<p>Please login</p>
							}
						</Route>
						<Route path="/watch">
							{isSignedIn ?
								this.state.watchingStreamId !== null ?
									<Embed autoPlay={true} width={"90vw"} height={"90vh"} id={this.state.watchingStreamId} /> :
									<p>Select a stream from the sidebar</p> :
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
