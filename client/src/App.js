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
	}


	 componentDidMount() {
		console.log("mount")
		ReactModal.setAppElement('body')
		LocalStorageManager.initialize()

		console.log(document.location.hash)
		const query = document.location.hash.split('/')[1]
		console.log(query)
		

		if (query.includes("access_token")) {
			const params = new URLSearchParams(query);
			const foo = params.get('access_token'); // bar
			console.log(foo)

			if (!this.props.accessToken) {
				this.setState({
					accessToken: foo
		
				}, async () => {
					// Get Users api to get user id

					const users = await fetch("https://api.twitch.tv/helix/users", {    
						headers: {
						'Authorization': 'Bearer ' + foo,
						'Client-Id': `${process.env.REACT_APP_TWITCH_CLIENT_ID}`
					},}).then(response => response.json())

					const activeUser = users.data[0]

					console.log(activeUser)

					const liveChannels = await fetch("https://api.twitch.tv/helix/streams/followed?user_id=" + activeUser.id, {    
						headers: {
						'Authorization': 'Bearer ' + foo,
						'Client-Id': `${process.env.REACT_APP_TWITCH_CLIENT_ID}`
					},})
					.then(response => response.json())


					console.log(liveChannels.data)
					var arr = []
					liveChannels.data.forEach(liveChannel => {
						arr.push(new LiveChannel(liveChannel.user_name, activeUser.profile_image_url, liveChannel.id))

					})

					this.setState({
						twitchChannelInfos: arr
			
					})
							
					console.log(arr)


				})			
			}



		}
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
