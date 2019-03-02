import './Edit.css';

import React, { Component } from 'react';
import BaseComponent from '../../BaseComponent';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import * as actions from '../../actions';
import * as pages from '../../constants/pages';

export default class Edit extends BaseComponent {
  constructor() {
    super();

    this.state = {
      saving: false
    };
  }

  render() {
    return (
      <div>
        <h2>{this.data.id ? 'Редактирование объявления' : 'Новове объявление'}</h2>
        <div className="Edit">
          <div className="Edit__form">
            <FormGroup>
              <Label>Заголовок</Label>
              <Input
                id="edit_title"
                type="text"
                value={this.data.title || ''}
                onChange={(e) => this.setData('title', e.target.value.slice(0, 35))}
              />
              <FormText color="muted">Не более 35 символов</FormText>
            </FormGroup>
            <FormGroup>
              <Label>Ссылка</Label>
              <Input
                id="edit_link"
                type="text"
                placeholder="https://"
                value={this.data.link || ''}
                onChange={(e) => this.setData('link', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Изображение</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => this._fileDidSelect(e.target.files[0])}
              />
              <FormText color="muted">Размер изображения не более 720x1040 пикселей, формат JPG.</FormText>
            </FormGroup>
            <h4>Таргетинг</h4>
            <FormGroup>
              <Label>Пол</Label>
              <Input
                type="select"
                value={this.data.gender || 0}
                onChange={(e) => this.setData('gender', e.target.value)}
              >
                <option value={0}>Любой</option>
                <option value={1}>Женский</option>
                <option value={2}>Мужской</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Устройства</Label>
              <Input
                type="select"
                value={this.data.device || 0}
                onChange={(e) => this.setData('device', e.target.value)}
              >
                <option value={0}>Любые</option>
                <option value={1}>iPhone</option>
                <option value={2}>Android</option>
                <option value={3}>Web</option>
              </Input>
            </FormGroup>
            <Button color="primary" onClick={this._saveButtonDidPress}>{this.state.saving ? 'Сохранение..' : 'Сохранить'}</Button>
          </div>
          <div className="Edit__right">
            <div className="Edit__preview-wrap">
              <div className="Edit__preview" style={{backgroundImage: `url(${this.data.image})`}}>
                <div className="Edit__preview__adv_info">Реклама</div>
                <div className="Edit__preview__info">
                  <div className="Edit__preview__title">{this.data.title || 'Заголовок'}</div>
                  <div className="Edit__preview__button">Открыть</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _fileDidSelect(file) {
    if (!file) {
      return;
    }

    if (['image/jpeg', 'image/jpg'].indexOf(file.type) === -1) {
      return alert('Выбирите файл формата JPEG');
    }

    const reader = new FileReader();
    reader.onload = (() => {
      return (e) => {
        const src = e.target.result;
        let img = document.createElement('img');
        img.onload = () => {
          if (img.width > 720 || img.height > 1040) {
            return alert('Максимальный допустимый размер 720x1040 пикселей');
          }
          this.setData('image', src);
        };
        img.src = src;
      };
    })(file);
    reader.readAsDataURL(file);
  }

  _saveButtonDidPress = () => {
    const title = (this.data.title || '').trim();
    const image = this.data.image;
    const link = (this.data.link || '').trim();
    const gender = this.data.gender;
    const device = this.data.device;

    if (!title) {
      alert('Введите заголовок!');
      return document.getElementById('edit_title').focus();
    }

    if (!link) {
      alert('Введите ссылку!');
      return document.getElementById('edit_link').focus();
    }

    if (!image) {
      return alert('Загрузите изображение!');
    }

    if (this.data.status && this.data.id) {
      const ads = this.props.state.ads;
      for (let i = 0; i < ads.length; i++) {
        const ad = ads[i];
        if (ad.id === this.data.id) {
          if (ad.title === title && ad.link === link && ad.image === image) {
            break;
          }
          if (!window.confirm('Объявление будет остановленно и отправленно на повторную модерацию, вы действительно хотите сохранить?')) {
            return;
          }
          break;
        }
      }
    }

    this.setState({saving: true});
    actions.saveAd(this.data.id || 'new', {
      title,
      image,
      link,
      gender,
      device
    }).then((ad) => actions.openAdView(ad)).catch(() => {
        alert('Произошла ошибка');
        this.setState({saving: false});
    });
  };
}
