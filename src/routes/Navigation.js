import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import { logout } from '../actions/appActions';
import { Menu, Container } from 'semantic-ui-react'

class Navigation extends Component {
  handleLogout = (e) => {
    e.preventDefault();
    this.props.logout();
    this.props.history.push('/')
  }

  render() {

    const mainNav = (
      <Container>
        <Menu.Item header>
          <Link to="/login">Log In</Link>
        </Menu.Item>
        <Menu.Item header>
          <Link to="/signup">Sign Up</Link>
        </Menu.Item>
      </Container>
    )

        const userNav = (
      <Container>
        <Menu.Item header>
          <Link to='/user/'>Profile</Link>
        </Menu.Item>
        <Menu.Item header onClick={(e) => this.handleLogout(e)}>
          Log Out
        </Menu.Item>
      </Container>
    )

    return (
        <Menu fixed='top' inverted>
            {this.props.isAuthenticated ? userNav : mainNav}
        </Menu>
    )
  }

}

export default Navigation = withRouter(connect(null, {logout})(Navigation));
