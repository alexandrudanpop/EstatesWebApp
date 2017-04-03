import React from 'react'
import styles from './modalStyles.scss'
import commonStyles from './index.scss'
import { Button, ButtonToolbar } from 'react-bootstrap'
import EstateImageSlider from './estate-image-slider'

export default class EstateDetailsModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      isEditing: true
    }
  }

  closeModal() {
    let modal = this.refs.detailsModal
    modal.style.display = 'none'

    this.props.hideDetails()
  }

  onCancelClick() {
    this.closeModal()
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

  renderName() {
    if (this.state.isEditing) {
      return (
        <div>
          Title:
          <input type='text' ref='nameInput' autoFocus defaultValue={this.props.estate.name} />
        </div>
      )
    }

    return (
      <div>
        <h3>
          {this.props.estate.name}
        </h3>
        <br />
      </div>
    )
  }

  renderPrice() {
    if (this.state.isEditing) {
      return (
        <div>
          Price:
          <input type='text' ref='priceInput' defaultValue={this.props.estate.price} />
        </div>
      )
    }

    return (
      <div>
        Price:
        {this.props.estate.price} $
      </div>
    )
  }

  onAddImagesClick() {
    const id = this.props.estate.id
    this.closeModal()
    this.props.showImages(id)
  }

  render() {
    let showModalStyle = {
      display: 'block'
    }
    return (
      <div style={showModalStyle} className={styles['modal']} ref='detailsModal'>
        <div className={styles['modal-content']}>
          <span onClick={this.closeModal.bind(this)} className={styles['close']}>&times;</span>
          <h3> Estate details </h3>
          <hr />
          {this.renderName()}
          {this.renderPrice()}
          <EstateImageSlider
            images={this.props.estate.images}
          />
          <br />
          <div>
            <ButtonToolbar>
              <Button bsStyle='success' onClick={this.onSaveClick.bind(this)}>
                <span className='glyphicon glyphicon-ok'></span>{'\u00A0'}
                Save
              </Button>
              <Button bsStyle='primary' onClick={this.onAddImagesClick.bind(this)}> Add images </Button>
              <Button onClick={this.onCancelClick.bind(this)}>
                <span className='glyphicon glyphicon-ban-circle'></span>{'\u00A0'}
                Cancel
              </Button>
            </ButtonToolbar>
          </div>
        </div>
      </div>
    )
  }
}