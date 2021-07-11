import './App.css';
import SignIn from "./components/SignIn";
import Embeds from './components/Embeds';
import SubscriptionsContainer from './components/SubscriptionsContainer';
import SideBar from './components/SideBar';
import React from 'react'
import 'react-pro-sidebar/dist/css/styles.css';


class App  extends React.Component {
  constructor(props) {
    super(props);
    this.createEmbeds = this.createEmbeds.bind(this);
    this.addSubscriptionsInfos = this.addSubscriptionsInfos.bind(this)
    this.toggleFollow = this.toggleFollow.bind(this);
    this.retrieveLiveStatus = this.retrieveLiveStatus.bind(this)
    this.toggleShowSubscriptionsInfo = this.toggleShowSubscriptionsInfo.bind(this)

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
      showSubscriptions: false
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
	channelIds.forEach(id => infos.push(this.state.subscriptionsMap[id]));
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

  toggleShowSubscriptionsInfo() {
    this.setState({
      showSubscriptions: !this.state.showSubscriptions
    }, () => {
		if (!this.state.showSubscriptions) {
			this.retrieveLiveStatus(this.state.follows)
		}
	})
	


  }
  
  render() {
    return (

	<div className="App">
		<SideBar infos={this.state.followInfos} />
		<main className="main-content">
		<SignIn onGetLiveStatusesDone={this.createEmbeds} onGetSubscriptionsDone={this.addSubscriptionsInfos}/>
               
        { this.state.showSubscriptions ?           
			<div style={{marginRight:'auto'}}>
				<h3> Subscriptions </h3>
				<button className="follow-button" onClick={this.toggleShowSubscriptionsInfo}>Show live</button> 
				<SubscriptionsContainer subscriptionsInfo={this.state.subscriptionsInfo} toggleFollow={this.toggleFollow}/> 
			</div> :

			<div style={{marginRight:'auto'}}>
				<h3 > Live And Upcoming </h3>
				<button className="follow-button" onClick={this.toggleShowSubscriptionsInfo}>Show subscriptions</button>    
				<Embeds chIds={this.state.liveChannelIds}/>
			</div>
        }
	  </main>
      </div>

    );
  }
}



export default App;
