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

    this.state = {
      liveChannelIds: [],
      subscriptionsInfo:[]
    };
  }


  
  createEmbeds = (channelIds) => {
    console.log("In app")
    console.log(channelIds)
    this.setState({
      chIds: this.state.chIds.concat(channelIds)
    });
  }

  addSubscriptionsInfo = (info) => {
    this.setState({
      subscriptionsInfo: this.state.subscriptionsInfo.concat(info)
    });
  }
  
  render() {
    return (


      <div className="App">
        <SignIn onGetLiveStatusesDone={this.createEmbeds} onGetSubscriptionsDone={this.addSubscriptionsInfo}/>

        <div style={{marginRight:'auto'}}>
            <h3 > Live And Upcoming </h3>
            <Embeds chIds={this.state.liveChannelIds}/>

        </div>
          <div style={{marginRight:'auto'}}>
            <h3> Subscriptions </h3>
            <SubscriptionsContainer subscriptionsInfo={this.state.subscriptionsInfo}/>
          </div>
      </div>

    );
  }
}



export default App;
