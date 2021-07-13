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


class App  extends React.Component {
  constructor(props) {
    super(props);
    this.createEmbeds = this.createEmbeds.bind(this);
    this.addSubscriptionsInfos = this.addSubscriptionsInfos.bind(this)
    this.toggleFollow = this.toggleFollow.bind(this);
    this.retrieveLiveStatus = this.retrieveLiveStatus.bind(this)
	this.selectStream = this.selectStream.bind(this)

	var storedFollows =  JSON.parse(localStorage.getItem('follows'))
	if (storedFollows === null) {
		storedFollows = []
	} 
    this.state = {
      liveChannelIds: [],
      subscriptionsInfo:[],
	  subscriptionsMap: {},
      follows: storedFollows,
	  followInfos: [],
	  watchingStreamId: null
    };

  }

  componentDidMount() {
	this.retrieveLiveStatus( this.state.follows)

  }


  
  createEmbeds = (channelIds) => {
    this.setState({
      liveChannelIds: channelIds
    });
	var infos = []
	channelIds.forEach(id => {
		var info = this.state.subscriptionsMap[id]
		if (info !== undefined) {
			infos.push(info)

		} else { // Followed channel unsubscribed
			this.setState({
				follows: this.state.follows.filter(followId => followId !== id)
			  } , () => this.saveFollows());
		}
	});
	console.log(infos)

	this.setState({
		followInfos: infos
	})
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
	  var channelId = info.resourceId.channelId
	  info.isFollowed = !info.isFollowed
	  

    if (this.state.follows.includes(channelId)) {
      this.setState({
        follows: this.state.follows.filter(id => channelId !== id)
      } , () => this.saveFollows());

    } else {
      this.setState({
        follows: [...this.state.follows, channelId]
      }, () => this.saveFollows());
    }

  }

  saveFollows = () => {
	  
	  localStorage.setItem('follows', JSON.stringify(this.state.follows))
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
	
  
  render() {
    return (

	<div className="App">
		<SideBar infos={this.state.followInfos} selectStream={this.selectStream}/>
			<main className="main-content">
				<Header onGetLiveStatusesDone={this.createEmbeds} onGetSubscriptionsDone={this.addSubscriptionsInfos}/>


				
				<Switch>
					<Route exact path="/">
						<div style={{marginRight:'auto'}}>
							<h3 > Live And Upcoming </h3>
							{/* <Embeds chIds={this.state.liveChannelIds}/> */}
						</div>
					</Route>
					<Route path="/subscriptions">
						<div style={{marginRight:'auto'}}>
							<h3> Subscriptions </h3>
							<SubscriptionsContainer subscriptionsInfo={this.state.subscriptionsInfo} toggleFollow={this.toggleFollow}/> 
						</div> 
					</Route>
					<Route path="/watch">
						{this.state.watchingStreamId !== null ? 
						<Embed id={this.state.watchingStreamId}/> :
						<p>Select a stream</p>} 
					</Route>
				</Switch>
			</main>
		</div>
    );
  }
}



export default withRouter(App) ;
