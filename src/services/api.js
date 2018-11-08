import store from '../store';

export const CLIENT_ID = 6364123;
const API_V = '5.80';

export function method(name, params = {}) {
  params.vk_params = JSON.stringify(window.VK.Auth.getSession());
  params.method = name;
  return new Promise((resolve, reject) => {
    const form = new FormData();
    for (let k in params) {
      form.append(k, params[k]);
    }

    let apiEntry = 'https://dev.kphp.net';
    fetch(`${apiEntry}/ads.php`, {
      method: 'POST',
      cache: 'no-cache',
      body: form
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          reject(json.error);
        } else {
          resolve(json.response);
        }
      }).catch(() => reject({http: true}));
  });
}

export const methods = {
  init: 'init',
  saveAd: 'save_ad',
  stats: 'stats',
  setStatus: 'set_status'
};

export function vk(method, params, opts) {
  const { VK } = window;

  params.v = API_V;
  params = params || {};

  VK.api(method, params, function (res) {
    if (res.response) {
      opts.onDone && opts.onDone(res.response);
    } else if (res.error) {
      opts.onFail && opts.onFail(res.error);
      if (res.error) {
        const code = parseInt(res.error.error_code, 10);
        if ([4].indexOf(code) > -1) {
          alert('Проблемы с авторизацией, попробуйте закрыть приложение и открыть снова');
        }
      }
    }
  });
}
