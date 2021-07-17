import './App.css';
import SignIn from "./components/SignIn";
import Embeds from './components/Embeds';
import Embed from './components/Embed';
import SubscriptionsContainer from './components/SubscriptionsContainer';
import SideBar from './components/SideBar';
import React from 'react'
import Header from './components/Header';


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
    this.createEmbeds = this.createEmbeds.bind(this);
    this.addSubscriptionsInfos = this.addSubscriptionsInfos.bind(this)
    this.toggleFollow = this.toggleFollow.bind(this);
    this.retrieveLiveStatus = this.retrieveLiveStatus.bind(this)
	this.selectStream = this.selectStream.bind(this)
	this.setSignedIn = this.setSignedIn.bind(this)


    this.state = {
      liveChannelIds: [],
      subscriptionsInfo:[],
	  subscriptionsMap: {},
      follows: [],
	  liveChannelInfos: [],
	  watchingStreamId: null,
	  isSignedIn : false
    };

  }


//   componentWillUnmount() {
// 	clearInterval(this.interval);
//   }

  componentDidMount() {
	var storedFollows =  JSON.parse(localStorage.getItem('follows'))
	console.log(storedFollows)
	if (storedFollows === null) {
		storedFollows = []
	} 
	this.retrieveLiveStatus( storedFollows)

	this.setState({
		follows:storedFollows
	})


  }


  
  createEmbeds = (channelIds) => {
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
		console.log(infos)
	
		this.setState({
			liveChannelInfos: infos
		})
	});

	

  }

  addSubscriptionsInfos = (infos) => {
    this.setState({
      subscriptionsInfo: infos
    });
	var map = {}
	infos.forEach(info => {
		map[info.resourceId.channelId] = info
	});

	this.setState({
		subscriptionsMap: map
	}, () => {
		console.log(this.state.subscriptionsMap)
	});
	
  }

  toggleFollow = (info) => {
	var follows = JSON.parse(localStorage.getItem('follows'))



	  var channelId = info.resourceId.channelId
	  

	  if (follows === null) {
		  follows = []
	  }

    if (follows.includes(channelId)) {
		follows = follows.filter(id => channelId !== id)
    } else {

		if (follows.length >= maxFollows) {
			console.log("too many follows")
			return 
		}
		follows.push(channelId)
    }
	console.log(follows)
	info.isFollowed = !info.isFollowed


	this.saveFollows(follows)

  }

  saveFollows = (follows) => {
	  
	  this.setState ({
		  follows: follows
	  }, () => {
		localStorage.setItem('follows', JSON.stringify(follows))

	  })
  }

  retrieveLiveStatus(channelIds) {
    var obj = {ids : channelIds}

    var url = 'http://localhost:4000/api/' + JSON.stringify(obj)
    fetch(url, {   
        headers: {
        'Content-Type': 'application/json',
     } })
    .then(response => response.json())
    .then(data => {
        this.createEmbeds(data.channels)
		// setTimeout(() => {
		// 	var storedFollows =  JSON.parse(localStorage.getItem('follows'))
		// 	if (storedFollows === null) {
		// 		storedFollows = []
		// 	} 
		// 	this.retrieveLiveStatus( storedFollows)
		// }, refreshTimer)
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

	setSignedIn(value) {
		this.setState({
			isSignedIn: value
		}, () => {
			console.log("set signed in")
		})
	}
	
  
  render() {
    return (

	<div className="App">
		<SideBar infos={this.state.liveChannelInfos} selectStream={this.selectStream}/>
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
