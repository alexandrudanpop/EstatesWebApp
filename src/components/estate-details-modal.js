import React from 'react'
import { Button, ButtonToolbar, Carousel } from 'react-bootstrap'

import styles from './modalStyles.scss'
import commonStyles from './index.scss'

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

  renderImageCarousel(images) {
    if (images && images.length === 1) {
      return (
        <Carousel>
          {images.map(i => {
            return (
              <Carousel.Item key={i.id}>
                <img width={900} height={500} alt="900x500" src={'http://' + i.link} />
              </Carousel.Item>)
          })}
        </Carousel>
      )
    }
    else if (images && images.length > 1) {
      return (
        <div>
          <Carousel>
            {images.map(i => {
              return (
                <Carousel.Item key={i.id}>
                  <img width={900} height={500} alt="900x500" src={'http://' + i.link} />
                </Carousel.Item>)
            })}
          </Carousel>
          <Button onClick={this.deleteImage.bind(this)}>Clear image &times;</Button>
        </div>
      )
    }
    else {
      return null
    }
  }

  onAddImagesClick() {
    const id = this.props.estate.id
    this.closeModal()
    this.props.showImages(id)
  }

  deleteImage() {
    const images = this.props.estate.images;
    const imgUrl = document.getElementsByClassName('item active')[0].firstChild.src;
    const imageId = images.filter(x => 'http://' + x.link === imgUrl)[0].id
    this.props.deleteImage(imageId)
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
          {this.renderImageCarousel(this.props.estate.images)}

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