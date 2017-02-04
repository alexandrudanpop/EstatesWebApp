import React, { Component } from 'react';
import styles from './index.scss';
import { ButtonGroup, Button } from 'react-bootstrap'

export default class CreateEstate extends Component {
  onSaveNewClick() {
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
          this.props.createNewEnabled ? 
           <Button bsStyle="success" className={styles['autoSizedInput']} onClick={this.props.onAddNewClick}> Add new </Button>
            : <div>
              <label> Name </label> <input className={styles['autoSizedInput']} type="text" ref="newItemName" autoFocus />
              <label> Price </label> <input className={styles['autoSizedInput']} type="text" ref="newItemPrice" />
              <span> </span>
              <ButtonGroup>
                <Button bsStyle="success" className={styles['bsButton']} onClick={this.onSaveNewClick.bind(this)}> Save</Button>
                <Button className={styles['bsButton']} onClick={this.props.onCancelClick}> Cancel </Button>
              </ButtonGroup>
            </div>
        }
      </div>
    );
  }
}