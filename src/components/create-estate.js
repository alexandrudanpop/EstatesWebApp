import React, { Component } from 'react';
import styles from './index.scss';

export default class CreateEstate extends Component {
  onSaveNewClick(){
    const newEstate = {
      name: this.refs.newItemName.value,
      price: this.refs.newItemPrice.value,
      images: []
    }

    this.props.onSaveNewClick(newEstate)
  }

  render() {
    return (
      <div>
      {
        this.props.createNewEnabled ? <button onClick={this.props.onAddNewClick}> Add new </button>
        : <div>
          <label> Name </label> <input className={styles['autoSizedInput']} type="text" ref="newItemName" autoFocus />
          <label> Price </label> <input className={styles['autoSizedInput']} type="text" ref="newItemPrice" />
          <span> </span>
          <button onClick={this.onSaveNewClick.bind(this)}> Save </button>
          <button className={styles['defaultButton']} onClick={this.props.onCancelClick}> Cancel </button>
        </div>
      }
      </div>
    );
  }
}