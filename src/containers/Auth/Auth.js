import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';

export default class Auth extends Component {
  render() {
    return (
      <div>
        <Button
          color="primary"
          onClick={() => window.VK.Auth.login(function() {}, 262144)}
        >Войти через ВКонтакте</Button>
      </div>
    )
  }
}