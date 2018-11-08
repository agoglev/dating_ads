import React, { Component } from 'react';
import * as vk from "../../actions/vk";
import * as actions from '../../actions';
import { Table } from 'reactstrap';

export default class AllAds extends Component {
  render() {
    return (
      <div>
        <h2>Все объявления</h2>
        {this._renderTable()}
      </div>
    )
  }

  _renderTable() {
    const ads = this.props.state.ads;
    if (ads.length === 0) {
      return <div style={{padding: '30px 0'}}>Нет объявлений</div>
    }

    return (
      <Table striped hover style={{maxWidth: '900px'}}>
        <thead>
        <tr>
          <th>Название</th>
          <th>Статус</th>
        </tr>
        </thead>
        <tbody>
        {this._renderAds()}
        </tbody>
      </Table>
    )
  }

  _renderAds() {
    const ads = this.props.state.ads;
    return ads.map((item) => {
      let status = 'Модерируется';
      if (item.status === 1) {
        status = 'Остановлено';
      } else if (item.status === 2) {
        status = 'Запущено';
      }

      return (
        <tr key={item.id} onClick={() => actions.openAdView(item)}>
          <td>{item.title}</td>
          <td>{status}</td>
        </tr>
      )
    });
  }
}
