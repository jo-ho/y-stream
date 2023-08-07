import './App.css';
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
import Livestream from './model/Livestream';
import Embeds from './components/Embeds';
import YoutubeService from './services/YoutubeService';

const refreshTimer = 60000

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			liveChannelInfos: null,
			twitchChannelInfos: null,
			subscriptionsMap: {},
			userId: null,
		};
		this.proxyService = new ProxyService()
		this.twitchService = new TwitchService()
		this.youtubeService = new YoutubeService()
	}

	 async componentDidMount() {
		ReactModal.setAppElement('body')
		LocalStorageManager.initialize()

		this.setState({
			twitchChannelInfos: await this.twitchService.getLiveChannels()

		})
	}



	updateLiveChannelInfos = (streams) => {

		var infos = []
		streams.forEach(stream => {
			var info = this.state.subscriptionsMap[stream.id]
			if (info !== undefined) {
        info.linkId = stream.linkId
				infos.push(info)


			}
		});


		var arr = []
		infos.forEach(info => {
			arr.push(new Livestream(
        info.title,
        info.thumbnails.default.url,
        info.resourceId.channelId,
        "",
        info.linkId))
		})
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


	retrieveLiveStatus = async (channelIds) => {

		this.proxyService.getLiveChannels(channelIds, this.updateLiveChannelInfos)

		this.setState({
			twitchChannelInfos: await this.twitchService.getLiveChannels()

		})
		setTimeout(() => {
			if (this.state.userId !== null) {
				this.retrieveLiveStatus(LocalStorageManager.getStoredFollows(this.state.userId))
			}


		}, refreshTimer)

	}


	revokeTwitchToken = async () => {

		if (await this.twitchService.revokeToken()) {
			LocalStorageManager.setAccessToken("")

			this.setState({
				twitchInfos: []
			})
		}

	}

	setSignedIn = async (googleUser) => {
			if (!googleUser) {
				this.setState({
					watchingStreamUrl: null,
          userId : null
				})
			} else {
        this.setState({
          userId: googleUser.getId()
        })
				this.youtubeService.getUserSubscriptions(googleUser, this.addSubscriptionsInfos)
				await this.retrieveLiveStatus(LocalStorageManager.getStoredFollows(googleUser.getId()))
			}

	}


	render() {

		const userId = this.state.userId
		const liveChannelInfos = this.state.liveChannelInfos
		const twitchInfos = this.state.twitchChannelInfos
		const isSignedIn = userId != null

		return (
			<div className="App">
				<SideBar infos={isSignedIn && liveChannelInfos ? liveChannelInfos : []} twitchInfos={LocalStorageManager.getAccessToken() && twitchInfos ? twitchInfos : []}/>
				<main className="main-content">
					<Header revokeTwitchToken={this.revokeTwitchToken}  setSignedIn={this.setSignedIn} isSignedIn={isSignedIn} onGetSubscriptionsDone={this.addSubscriptionsInfos} />
					<Switch>
						<Route exact path="/">
						<h3> Twitch </h3>
						<Embeds
							infos={twitchInfos}
							isYoutube={false}
							userId={LocalStorageManager.getAccessToken()}

						/>
						<h3>Youtube</h3>
						<Embeds
							infos={liveChannelInfos}
							isYoutube={true}
							userId={userId}
						/>

						</Route>
						<Route path="/subscriptions">
							{isSignedIn?
								<div style={{ marginRight: 'auto' }}>
									<h3> Subscriptions </h3>
									<SubscriptionsContainer subscriptionsMap={this.state.subscriptionsMap} userId={userId} />
								</div>
								:
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
