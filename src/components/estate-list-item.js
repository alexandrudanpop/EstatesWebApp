import React, { Component } from 'react'
import styles from './index.scss'
import { Button, ButtonToolbar } from 'react-bootstrap'

class EstateListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
    }
  }

  onEditClick() {
    this.setState({ isEditing: true })
  }

  onCancelClick() {
    this.setState({ isEditing: false })
    this.props.cancel()
  }

  onDeleteClick() {
    const id = this.props.estate.id
    this.props.deleteEstate(id)
  }

  onSaveClick() {
    const editWithoutErrors = this.props.editEstate({
      id: this.props.estate.id,
      name: this.refs.nameInput.value,
      price: this.refs.priceInput.value
    })

    if (editWithoutErrors) {
      this.setState({ isEditing: false })
    }
  }

  onAddImagesClick() {
    const id = this.props.estate.id
    this.props.showImages(id)
  }

  renderName() {
    if (this.state.isEditing) {
      return (
        <h1> <input type='text' ref='nameInput' autoFocus defaultValue={this.props.estate.name} /> </h1>
      )
    }

    return (
      <h1> {this.props.estate.name} </h1>
    )
  }

  renderPrice() {
    if (this.state.isEditing) {
      return (
        <div> <input type='text' ref='priceInput' defaultValue={this.props.estate.price} /> </div>
      )
    }

    return (
      <div> {this.props.estate.price}</div>
    )
  }

  // todo Edit / Delete Actions - move to estate-details modal
  renderActionSection() {
    /*if (this.state.isEditing) {
      return (
        <div>
          <ButtonToolbar>
            <Button bsStyle='success' onClick={this.onSaveClick.bind(this)}>
              <span className='glyphicon glyphicon-ok'></span>{'\u00A0'}
              Save
            </Button>
            <Button onClick={this.onCancelClick.bind(this)}>
              <span className='glyphicon glyphicon-ban-circle'></span>{'\u00A0'}
              Cancel
            </Button>
          </ButtonToolbar>
        </div>
      )
    }*/

    return (
      <div>
        <ButtonToolbar>
          {/*<Button bsStyle='warning' onClick={this.onEditClick.bind(this)}>
            <span className='glyphicon glyphicon-pencil'></span>{'\u00A0'}
            Edit
          </Button>
          <Button bsStyle='danger' onClick={this.onDeleteClick.bind(this)}>
            <span className='glyphicon glyphicon-remove'></span>{'\u00A0'}
            Delete
          </Button>*/}
          <Button bsStyle='primary' onClick={this.onAddImagesClick.bind(this)}> Add images </Button>
        </ButtonToolbar>
      </div>
    )
  }

  renderImage() {
    return (
      this.props.estate && this.props.estate.images.length !== 0
        ?
        <div>
          <img src={'http://' + this.props.estate.images[0].link} className='img-responsive' />
        </div>
        : <div>  </div>
    )
  }

  render() {
    return (
        <div className='col-md-3'>
          <div className={styles['block']}>
            <div className={styles['thumbnail']}>
              {this.renderImage()}
              <div className={styles['caption']}>
                {this.renderName()}
                {this.renderPrice()}
                <Button bsStyle='primary' onClick={() => { }}> Details </Button>
                <br />
                {this.renderActionSection()}
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default EstateListItem