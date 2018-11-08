import './App.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button} from 'reactstrap';

import * as pages from './constants/pages';
import * as actions from './actions';

import Auth from './containers/Auth/Auth';
import Main from './containers/Main/Main';
import Edit from './containers/Edit/Edit';
import View from './containers/View/View';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar
          color="light"
          light
          expand="md"
        >
          <NavbarBrand href={`#${pages.ADS}`} onClick={(e) => this._goToPage(e, pages.ADS)}>Рекламный кабинет</NavbarBrand>
          {this._renderNav()}
        </Navbar>
        {JSON.stringify(this.props.state.hashParams)}
        <div className="page_cont">
          {this._renderPage()}
        </div>
      </div>
    )
  }

  _renderPage() {
    const { page } = this.props.state;

    const props = {
      state: this.props.state,
      id: page
    };

    switch (page) {
      case pages.LOADING:
        return <div>Loading..</div>;
      case pages.AUTH:
        return <Auth {...props}/>;
      case pages.ADS:
        return <Main {...props}/>;
      case pages.NEW:
        return <Edit {...props}/>;
      case pages.VIEW:
        return <View {...props}/>;
      default:
        return <h1>Not Found</h1>;
    }
  }

  _renderNav() {
    const page = this.props.state.page;
    if (page === pages.AUTH) {
      return null;
    }

    //  <Button color="success" size="sm" style={{height: '32px', marginTop: '4px', marginLeft: '16px'}}>Бюджет: <b>10</b> р.</Button>

    return <Nav className="mr-auto" navbar>
      <NavItem>
        <NavLink
          href={`#${pages.ADS}`}
          active={page === pages.ADS}
          onClick={(e) => this._goToPage(e, pages.ADS)}
        >Мои объявления</NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          href={`#${pages.NEW}`}
          active={page === pages.NEW}
          onClick={(e) => this._goToPage(e, pages.NEW)}
        >Создать</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#" onClick={() => window.VK.Auth.logout()}>Выйти</NavLink>
      </NavItem>
    </Nav>
  }

  _goToPage(event, page) {
    actions.navigate(page);
    event.preventDefault();
  }
}

const AppContainer = connect((state) => {
  return { state };
})(App);

export default AppContainer;
