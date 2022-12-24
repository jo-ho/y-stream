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
import Embed from './components/Embed';
import YoutubeService from './services/YoutubeService';

const refreshTimer = 60000



class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			liveChannelInfos: null,
			twitchChannelInfos: null,
			subscriptionsMap: {},
			watchingStreamUrl: null,
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
			arr.push(new Livestream(liveChannel.title, liveChannel.thumbnails.default.url, liveChannel.resourceId.channelId))
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

	selectStream = (channelId, isYoutubeStream) => {
		if (isYoutubeStream) {
			this.setState({
				watchingStreamUrl: "https://www.youtube.com/embed/live_stream?channel=" + channelId + "&autoplay=1"
			}, () => { this.props.history.push('/watch') })
		} else {
			this.setState({
				watchingStreamUrl: "https://player.twitch.tv/?channel=" + channelId +  "&parent=localhost"
			}, () => { this.props.history.push('/watch') })
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
				<SideBar infos={isSignedIn && liveChannelInfos ? liveChannelInfos : []} twitchInfos={LocalStorageManager.getAccessToken() && twitchInfos ? twitchInfos : []} selectStream={this.selectStream} />
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
						<Route path="/watch">
							{isSignedIn || LocalStorageManager.getAccessToken() ?
								this.state.watchingStreamUrl !== null ?
									<Embed autoPlay={true} width={"90vw"} height={"90vh"} src={ this.state.watchingStreamUrl} /> :
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
