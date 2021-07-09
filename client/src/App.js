import './App.css';
import SignIn from "./components/SignIn";
import Embeds from './components/Embeds';
import SubscriptionsContainer from './components/SubscriptionsContainer';
import React from 'react'

class App  extends React.Component {
  constructor(props) {
    super(props);
    this.createEmbeds = this.createEmbeds.bind(this);
    this.addSubscriptionsInfo = this.addSubscriptionsInfo.bind(this)
    this.toggleFollow = this.toggleFollow.bind(this);
    this.retrieveLiveStatus = this.retrieveLiveStatus.bind(this)
    this.toggleShowSubscriptionsInfo = this.toggleShowSubscriptionsInfo.bind(this)

    this.state = {
      liveChannelIds: [],
      subscriptionsInfo:[],
      follows: [],
      showSubscriptions: false
    };
  }


  
  createEmbeds = (channelIds) => {
    this.setState({
      liveChannelIds: channelIds
    });
  }

  addSubscriptionsInfo = (info) => {
    this.setState({
      subscriptionsInfo: this.state.subscriptionsInfo.concat(info)
    });
  }

  toggleFollow = (info) => {
	  var channelId = info.resourceId.channelId
	  info.isFollowed = !info.isFollowed
    if (this.state.follows.includes(channelId)) {
      this.setState({
        follows: this.state.follows.filter(id => channelId !== id)
      });

    } else {
      this.setState({
        follows: [...this.state.follows, channelId]
      });
    }

  }

  retrieveLiveStatus(channelIds) {
    var obj = {ids : channelIds}
    // console.log(obj)

    var url = 'http://localhost:4000/api/' + JSON.stringify(obj)
    fetch(url, {   
        headers: {
        'Content-Type': 'application/json',
     } })
    .then(response => response.json())
    .then(data => {
        // console.log(this.props.onGetLiveStatusesDone)
        
        this.createEmbeds(data.channels)
        // console.log(data)
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
		<SignIn onGetLiveStatusesDone={this.createEmbeds} onGetSubscriptionsDone={this.addSubscriptionsInfo}/>
 
               
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

      </div>

    );
  }
}



export default App;
