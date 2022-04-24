import './App.css';
import Embeds from './components/Embeds';
import Embed from './components/Embed';
import SubscriptionsContainer from './components/SubscriptionsContainer';
import SideBar from './components/SideBar';
import React from 'react'
import Header from './components/Header';
import ReactModal from 'react-modal'
import LocalStorageManager from './utils/LocalStorageManager';
import 'react-pro-sidebar/dist/css/styles.css';

import {

	Switch,
	Route,
	withRouter
} from "react-router-dom";
import ProxyService from './services/ProxyService';
import TwitchService from './services/TwitchService';

const refreshTimer = 60000

class LiveChannel {
	constructor(title, thumbnailUrl, channelId) {
	  this.title = title;
	  this.thumbnailUrl = thumbnailUrl;
	  this.channelId = channelId;
	}
  }
  

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			liveChannelInfos: null,
			twitchChannelInfos: null,
			subscriptionsMap: {},
			watchingStreamId: null,
			userId: null,
			accessToken: null
		};
		this.proxyService = new ProxyService()
		this.twitchService = new TwitchService()
	}


	 async componentDidMount() {
		console.log("mount")
		ReactModal.setAppElement('body')
		LocalStorageManager.initialize()



			const liveChannels = await this.twitchService.getLiveChannels()
			var arr = []
			liveChannels.forEach(liveChannel => {
				arr.push(new LiveChannel(liveChannel.user_name, "https://static-cdn.jtvnw.net/user-default-pictures-uv/41780b5a-def8-11e9-94d9-784f43822e80-profile_image-70x70.png", liveChannel.id))

			})

			this.setState({
				twitchChannelInfos: arr
	
			})
					
			console.log(arr)





	}
	


	updateLiveChannelInfos = (channelIds) => {

		var infos = []
		channelIds.forEach(id => {
			var info = this.state.subscriptionsMap[id]
			if (info !== undefined) {
				infos.push(info)

			}
		});

		var arr = []
		infos.forEach(liveChannel => {
			arr.push(new LiveChannel(liveChannel.title, liveChannel.thumbnails.default.url, liveChannel.resourceId.channelId))

		})

		console.log(arr)

		this.setState({
			liveChannelInfos: arr

		})
			



	}

	addSubscriptionsInfos = (infos) => {

		var map = {}
		infos.forEach(info => {
			map[info.resourceId.channelId] = info
		});


		this.setState({
			subscriptionsMap: map
		}, () => {
			LocalStorageManager.syncFollowsAndSubscriptions(this.state.userId, this.state.subscriptionsMap)
		});

	}





	retrieveLiveStatus = (channelIds) => {

		this.proxyService.getLiveChannels(channelIds, this.updateLiveChannelInfos)
		setTimeout(() => {
			if (this.state.userId !== null) {
				this.retrieveLiveStatus(LocalStorageManager.getStoredFollows(this.state.userId))
			}
		}, refreshTimer)

	}

	selectStream = (channelId) => {
		console.log("channelId", channelId)
		this.setState({
			watchingStreamId: channelId
		}, () => { this.props.history.push('/watch') })
	}

	setSignedIn = (userId) => {
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
		const twitchInfos = this.state.twitchChannelInfos
		const isSignedIn = userId != null
		const channelIds = (liveChannelInfos != null) ? liveChannelInfos.map(info => info.channelId) : []
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
				<SideBar infos={isSignedIn && liveChannelInfos ? liveChannelInfos : []} twitchInfos={twitchInfos ? twitchInfos : []} selectStream={this.selectStream} />
				<main className="main-content">
					<Header  setSignedIn={this.setSignedIn} isSignedIn={isSignedIn} onGetSubscriptionsDone={this.addSubscriptionsInfos} />
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
