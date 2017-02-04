import React, { Component } from 'react';

import EstateHeader from './estates-header'
import EstateListItem from './estate-list-item'

import styles from './index.scss'
import { Table } from 'react-bootstrap'

class EstateList extends Component {
  renderItems() {
    if (!this.props.estates) {
      return
    }

    return this.props.estates.map(estate => {
      return (
        <EstateListItem
          key={estate.id}
          estate={estate}
          deleteEstate={this.props.deleteEstate}
          editEstate={this.props.editEstate}
          cancel={this.props.cancel}
          showImages={this.props.showImages}
          selectedEstateChanged={this.props.selectedEstateChanged}
          />
      )
    })
  }

  render() {
    return (
      <Table responsive hover>
        <EstateHeader />
        <tbody>
          {this.renderItems()}
        </tbody>
      </Table>
    );
  }
}

export default EstateList;