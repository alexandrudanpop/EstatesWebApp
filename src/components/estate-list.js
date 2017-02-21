import React, { Component } from 'react';

import EstateListItem from './estate-list-item'
import styles from './index.scss'

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
      <div className='container'>
        <div className={styles['featured-block']}>
          <div className='row'>
            {this.renderItems()}
          </div>
        </div>
      </div>
    );
  }
}

export default EstateList;