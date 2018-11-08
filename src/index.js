import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import router from './router';
import App from './App';
import { Provider } from 'react-redux';
import * as actionTypes from './actions/actionTypes';
import * as api from './services/api';
import * as vk from './actions/vk';

const hash = window.location.hash;
if (hash && hash !== '#/') {
  window.location.hash = '';
}

router.addListener((to, from) => store.dispatch({ type: actionTypes.NAVIGATE, to, from })).start();

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <App store={store} router={router} />
    </Provider>,
    document.getElementById('root')
  );
}

render();

const  { VK } = window;
VK.init({
  apiId: api.CLIENT_ID,
  status: true
});

VK.Auth.getLoginStatus(vk.updateAuth);
VK.Observer.subscribe('auth.sessionChange', vk.updateAuth);