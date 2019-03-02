import * as actionTypes from './actionTypes';
import store from '../store';
import router from '../router';
import * as api from "../services/api";
import * as pages from '../constants/pages';

export function navigate(page, params = {}) {
  router.navigate(page, params);
}

export function setData(field, value, page) {
  store.dispatch({
    type: actionTypes.SET_DATA,
    field,
    value,
    page
  });
}

export function init() {
  api.method(api.methods.init)
    .then((resp) => {
      store.dispatch({
        type: actionTypes.INIT,
        ads: resp.ads
      });

      if (window.openAddId > 0) {
        for (let i = 0; i < resp.ads.length; i++) {
          const ad = resp.ads[i];
          if (ad.id === window.openAddId) {
            openAdView(ad);
            break;
          }
        }
      }
    });
}

export function openAdEdit(ad) {
  navigate(pages.NEW, {...ad})
}

export function openAdView(ad) {
  navigate(pages.VIEW, {...ad, ad: ad})
}

export function saveAd(id, params) {
  return new Promise((resolve, reject) => {
    api.method(api.methods.saveAd, {
      ad_id: id,
      ...params
    }).then((ad) => {
      let ads = store.getState().ads;
      if (id === 'new') {
        ads.unshift(ad);
      } else {
        for (let i = 0; i < ads.length; i++) {
          if (ads[i].id === id) {
            ads[i] = ad;
            break;
          }
        }
      }
      store.dispatch({type: actionTypes.SET_ADS, ads});
      resolve(ad);
    }).catch(reject);
  });
}

export function updateAd(ad) {
  let ads = store.getState().ads;
  for (let i = 0; i < ads.length; i++) {
    if (ads[i].id === ad.id) {
      ads[i] = ad;
      break;
    }
  }
  store.dispatch({type: actionTypes.SET_ADS, ads});
}