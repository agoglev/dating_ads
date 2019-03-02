import createRouter from 'router5'
import browserPlugin from 'router5/plugins/browser'
import listenersPlugin from 'router5/plugins/listeners'
import * as pages from './constants/pages'

export const routes = [
  {
    name: pages.LOADING,
    path: pages.LOADING
  },
  {
    name: pages.ADS,
    path: pages.ADS
  },
  {
    name: pages.AUTH,
    path: pages.AUTH
  },
  {
    name: pages.NEW,
    path: pages.NEW
  },
  {
    name: pages.VIEW,
    path: `${pages.VIEW}?id`
  },
  {
    name: pages.ALL,
    path: pages.ALL
  }
];

const params = {
  defaultRoute: pages.ADS,
  defaultParams: {}
};

let router = createRouter(routes, params)
  .usePlugin(browserPlugin({ base: '/dating_ads/', useHash: false }))
  .usePlugin(listenersPlugin());

export default router;
