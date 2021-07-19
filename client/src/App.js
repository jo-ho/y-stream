import './App.css';
import Embeds from './components/Embeds';
import Embed from './components/Embed';
import SubscriptionsContainer from './components/SubscriptionsContainer';
import SideBar from './components/SideBar';
import React from 'react'
import Header from './components/Header';
import MaxFollowModal from './components/MaxFollowModal';
import ReactModal from 'react-modal'


import 'react-pro-sidebar/dist/css/styles.css';

import {

	Switch,
	Route,
	withRouter
  } from "react-router-dom";


const refreshTimer = 300000
const maxFollows = 10

class App  extends React.Component {
  constructor(props) {
    super(props);
    this.updateLiveChannelInfos = this.updateLiveChannelInfos.bind(this);
    this.addSubscriptionsInfos = this.addSubscriptionsInfos.bind(this)
    this.toggleFollow = this.toggleFollow.bind(this);
    this.retrieveLiveStatus = this.retrieveLiveStatus.bind(this)
	this.selectStream = this.selectStream.bind(this)
	this.setSignedIn = this.setSignedIn.bind(this)
	this.toggleShowModal = this.toggleShowModal.bind(this)


    this.state = {
      liveChannelIds: [],
      subscriptionsInfo:[],
	  subscriptionsMap: {},
      follows: [],
	  liveChannelInfos: [],
	  watchingStreamId: null,
	  isSignedIn : false,
	  userId: null,
	  showModal : false
    };

  }

  componentDidMount() {
	ReactModal.setAppElement('body')
	
	if (JSON.parse(localStorage.getItem('follows')) === null) {
		localStorage.setItem('follows', JSON.stringify({}))
	}


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

  addSubscriptionsInfos = (infos) => {
    this.setState({
      subscriptionsInfo: infos
    }, () => {
		var map = {}
		this.state.subscriptionsInfo.forEach(info => {
			map[info.resourceId.channelId] = info
		});
		this.setState({
			subscriptionsMap: map
		});
	});

	
  }

  toggleFollow = (info) => {
	var followsMap = JSON.parse(localStorage.getItem('follows'))
	var follows = followsMap[this.state.userId]



	  var channelId = info.resourceId.channelId
	  

	  if (follows === null || follows == undefined) {
		  follows = []
	  }

    if (follows.includes(channelId)) {
		follows = follows.filter(id => channelId !== id)
    } else {

		if (follows.length >= maxFollows) {
			console.log("too many follows")
			this.toggleShowModal(true)
			return 
		}
		follows.push(channelId)
    }
	console.log(follows)
	info.isFollowed = !info.isFollowed


	this.saveFollows(followsMap, follows)

  }

  saveFollows = (followsMap, follows) => {
	  
	  this.setState ({
		  follows: follows
	  }, () => {

		followsMap[this.state.userId] = this.state.follows
		localStorage.setItem('follows', JSON.stringify(followsMap))

	  })
  }

  retrieveLiveStatus(channelIds) {
	if (channelIds === null || channelIds == undefined) {
		channelIds = []
	} 

	
    var obj = {ids : channelIds}

    var url = 'http://localhost:4000/api/' + JSON.stringify(obj)
    fetch(url, {   
        headers: {
        'Content-Type': 'application/json',
     } })
    .then(response => response.json())
    .then(data => {
        this.updateLiveChannelInfos(data.channels)
		setTimeout(() => {
			var storedFollows =  JSON.parse(localStorage.getItem('follows'))[this.state.userId]

			this.retrieveLiveStatus( storedFollows)
			console.log("refresh")
		}, refreshTimer)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
	}



	selectStream(channelId) {
		this.setState({
			watchingStreamId: channelId
		}, () => {this.props.history.push('/watch')})
	}

	setSignedIn(value, userId) {
		this.setState({
			isSignedIn: value
		}, () => {
			console.log("set signed in")
			this.setState({
				userId: userId
			}, () => {
				if (this.state.userId != null) {
					var storedFollows =  JSON.parse(localStorage.getItem('follows'))[this.state.userId]

					this.retrieveLiveStatus( storedFollows)
				
					this.setState({
						follows:storedFollows
					})
				
				}
			})
		})
	}

	toggleShowModal(value) {
		this.setState({
			showModal: value
		})
	}
	
  
  render() {
    return (

	<div className="App">
		<SideBar infos={this.state.isSignedIn ? this.state.liveChannelInfos : []} selectStream={this.selectStream}/>
			<main className="main-content">
				<Header isSignedIn={this.state.isSignedIn} setSignedIn={this.setSignedIn} onGetSubscriptionsDone={this.addSubscriptionsInfos}/>


				
				<Switch>
					<Route exact path="/">
						{this.state.isSignedIn ? 
							<div style={{marginRight:'auto'}}>
								<h3 > Live And Upcoming </h3>
								<Embeds width={"25vw"} height={"30vh"} chIds={this.state.liveChannelIds}/>
							</div>
							:
							<p>Please login</p>
						}

					</Route>
					<Route path="/subscriptions">
						{this.state.isSignedIn ? 
							<div style={{marginRight:'auto'}}>
							
								<h3> Subscriptions </h3>
								<SubscriptionsContainer subscriptionsInfo={this.state.subscriptionsInfo} toggleFollow={this.toggleFollow}/> 
								<MaxFollowModal toggleShowModal={this.toggleShowModal} showModal={this.state.showModal} />

							</div> 

							:
							<p>Please login</p>
						}
						

					</Route>
					<Route path="/watch">

						{this.state.isSignedIn ? 
							this.state.watchingStreamId !== null ?
								<Embed autoPlay={true} width={"90vw"} height={"90vh"} id={this.state.watchingStreamId}/> :
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



export default withRouter(App) ;
