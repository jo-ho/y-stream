import './App.css';
import SignIn from "./components/SignIn";
import Embeds from './components/Embeds';
import React from 'react'

class App  extends React.Component {
  constructor(props) {
    super(props);
    this.createEmbeds = this.createEmbeds.bind(this);

    this.state = {
      chIds: []
    };
  }


  
  createEmbeds = (channelIds) => {
    console.log("In app")
    console.log(channelIds)
    this.setState({
      chIds: this.state.chIds.concat(channelIds)
    });
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <SignIn onGetLiveStatusesDone={this.createEmbeds}/>
          <Embeds chIds={this.state.chIds}/>
        </header>
      </div>
    );
  }
}



export default App;
