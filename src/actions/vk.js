import * as actionTypes from './actionTypes';
import store from '../store';
import * as api from '../services/api';
import * as pages from "../constants/pages";
import * as actions from "./index";

export function updateAuth(response) {
  if (response.session) {
    window.userId = parseInt(response.session.mid, 10);
  }
  actions.navigate(response.status === 'connected' ? pages.ADS : pages.AUTH);

  if (response.status === 'connected') {
    actions.init();
  }
}

function detectTypeByLink(link) {
  const matches = link.match(/(wall|photo|video)([0-9\-]+)_(\d+)/);
  if (matches) {
    let type = matches[1];
    if (type === 'wall') {
      type = 'post';
    }
    return {
      type,
      ownerId: matches[2],
      itemId: matches[3]
    };
  }

  return false;
}

export function checkCopy(link) {
  return checkLike(link, true);
}

export function checkLike(link, isCopy = false) {
  return new Promise((resolve, reject) => {
    const info = detectTypeByLink(link);
    if (!info || isCopy && info.type !== 'post') {
      return reject('bad_link');
    }

    api.vk('likes.isLiked', {
      owner_id: info.ownerId,
      item_id: info.itemId,
      type: info.type
    }, {
      onDone: (resp) => {
        if (isCopy) {
          resolve(!!resp.copied);
        } else {
          resolve(!!resp.liked);
        }
      },
      onFail: (err) => reject(err)
    });
  });
}

export function checkUserFollow(userId) {
  return new Promise((resolve, reject) => {
    api.vk('users.get', {
      user_id: userId,
      fields: 'friend_status'
    }, {
      onDone: ([user]) => resolve(user && parseInt(user.friend_status, 10) !== 0),
      onFail: () => reject()
    });
  });
}

export function checkGroupFollow(groupId) {
  return new Promise((resolve, reject) => {
    api.vk('groups.getById', {
      group_id: groupId,
      fields: 'is_member'
    }, {
      onDone: ([group]) => resolve(group && !!group.is_member),
      onFail: () => reject()
    });
  });
}