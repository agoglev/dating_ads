import React, { Component } from 'react';
import BaseComponent from '../../BaseComponent';
import { Button, Table } from 'reactstrap';
import * as actions from '../../actions';
import * as api from '../../services/api';

export default class View extends BaseComponent {
  constructor() {
    super();

    this.state = {
      stats: false,
      isFailed: false
    };
  }

  componentDidMount() {
    api.method(api.methods.stats, {
      ad_id: this.data.id
    }).then((resp) => {
      actions.updateAd(resp.ad);
      this.setState({stats: resp.stats})
    }).catch(() => this.setState({isFailed: true}));
  }

  getAd() {
    const ads = this.props.state.ads;
    for (let i = 0; i < ads.length; i++) {
      if (ads[i].id === this.data.id) {
        return ads[i];
      }
    }
    return this.data.ad || {};
  }

  render() {
    return (
      <div>
        <h2>Объявление</h2>
        <div className="Edit">
          <div className="Edit__form">
            <Table>
              <tbody>
                {this._renderInfo()}
              </tbody>
            </Table>
            <Button onClick={() => actions.openAdEdit(this.data.ad)} style={{marginBottom: '16px'}}>Редактировать</Button>
            <h4>Статистика</h4>
            {this._renderStats()}
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

  _renderInfo() {
    const ad = this.getAd();

    let status = 'Модерируется';
    if (ad.status === 1) {
      status = 'Остановлено';
    } else if (ad.status === 2) {
      status = 'Запущено';
    }

    let items = [
      {
        title: 'Заголовок',
        value: ad.title
      },
      {
        title: 'Ссылка',
        value: ad.link,
        style: {overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px'}
      },
      {
        title: 'Статус',
        value: status
      },
      {
        title: 'Бюджет',
        value: `${ad.balance} р.`
      },
      {
        title: 'Цена клика',
        value: `${ad.cost} р.`
      }
    ];

    if (this.data.gender > 0) {
      const genders = {
        1: 'Женский',
        2: 'Мужской'
      };
      items.push({
        title: 'Пол',
        value: genders[ad.gender]
      });
    }

    if (this.data.device > 0) {
      const devices = {
        1: 'iPhone',
        2: 'Android'
      };
      items.push({
        title: 'Девайс',
        value: devices[ad.device]
      });
    }

    if (ad.status) {
      items.push({
        title: 'Действие',
        value: ad.status === 1 ? <Button color="success" size="sm" onClick={() => this._setStatus(true)}>Запустить</Button> : <Button color="danger" size="sm" onClick={() => this._setStatus(false)}>Остановить</Button>
      });
    }

    return items.map((item) =>
      <tr key={item.title}>
        <th scope="row">{item.title}</th>
        <td style={item.style || {}}>{item.value}</td>
      </tr>
    );
  }

  _renderStats() {
    if (this.state.isFailed) {
      return 'Ошибка';
    }

    if (!this.state.stats) {
      return 'Загрузка..';
    }

    if (!this.state.stats.length) {
      return 'Нет статистики';
    }

    return (
      <Table striped hover>
        <thead>
        <tr>
          <th>Дата</th>
          <th>Переходы</th>
          <th>Просмотры</th>
          <th>CTRL</th>
        </tr>
        </thead>
        <tbody>
          {this._renderStatsRows()}
        </tbody>
      </Table>
    )
  }

  _renderStatsRows() {
    return this.state.stats.map((item) => {
      const ctrl = parseInt(item.clicks / item.views * 100, 10);
      return (
        <tr key={item.id} onClick={() => actions.openAdView(item)}>
          <td>{item.add_date}</td>
          <td>{item.clicks}</td>
          <td>{item.views}</td>
          <td>{ctrl}%</td>
        </tr>
      )
    });
  }

  _setStatus(isRunning) {
    api.method(api.methods.setStatus, {
      running: isRunning ? 1 : 0,
      ad_id: this.data.id
    }).then((ad) => actions.updateAd(ad))
      .catch((err) => alert(err.message));
  }
}
