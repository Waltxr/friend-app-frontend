import React, { Component } from 'react';
import Login from '../container/Login';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux'
import './App.css';
import Navigation from '../routes/Navigation';

class App extends Component {
  render() {    
    const {isAuthenticated, user} = this.props
    
    const guestViews = (
      <div id="landing-page" className="wrapper">
        <Navigation isAuthenticated={isAuthenticated} />        
        <Route exact path="/login" component={Login} />                
      </div>
    )

    const userViews = (
      <div className="wrapper">
        <Navigation isAuthenticated={isAuthenticated} />                
      </div>
    )
    
    return (
      <Router>
       {isAuthenticated ? userViews : guestViews}
     </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.currentUser
  }
}

export default App = connect(mapStateToProps, {})(App);