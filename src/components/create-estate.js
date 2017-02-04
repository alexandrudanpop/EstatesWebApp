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
            <Button bsStyle='success' className={styles['bsButtonMarginTop']} onClick={this.props.onAddNewClick}>
              <span className='glyphicon glyphicon-plus'></span>{'\u00A0'}
              Add new
            </Button>
            : 
              <form className="form-inline">
                <div className="form-group">
                  <label> Name </label>{'\u00A0'}
                  <input className={styles['autoSizedInput']} type='text' ref='newItemName' autoFocus /> {'\u00A0'}
                </div>
                <div className="form-group">
                  <label> Price </label>{'\u00A0'}
                  <input className={styles['autoSizedInput']} type='text' ref='newItemPrice' />
                </div>
                <ButtonGroup>
                  <Button bsStyle='success' className={styles['bsButton']} onClick={this.onSaveNewClick.bind(this)}>
                    <span className='glyphicon glyphicon-ok'></span>{'\u00A0'}
                    Save
                </Button>
                  <Button className={styles['bsButton']} onClick={this.props.onCancelClick}>
                    <span className='glyphicon glyphicon-ban-circle'></span>{'\u00A0'}
                    Cancel
                 </Button>
                </ButtonGroup>
              </form>
        }
      </div>
    );
  }
}