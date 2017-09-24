import React, { Component } from 'react'
import styles from './index.scss'
import { Button, ButtonToolbar } from 'react-bootstrap'
import { api } from '../api.js'

class EstateListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      style: {}
    }
  }

  onEditClick() {
    this.setState({ isEditing: true })
  }

  onDeleteClick() {
    const id = this.props.estate.id
    this.props.deleteEstate(id)
  }

  onAddImagesClick() {
    const id = this.props.estate.id
    this.props.showImages(id)
  }

  onDetailsClick() {
    const id = this.props.estate.id
    this.props.showDetails(id)
  }

  onItemMouseOver() {
    this.setState({ style: { backgroundColor: "#eaf7fc" } })
  }

  onItemMouseLeave() {
    this.setState({ style: { backgroundColor: "#fff" } })
  }

  renderName() {
    return (
      <h1> {this.props.estate.name} </h1>
    )
  }

  renderPrice() {
    return (
      <div> {this.props.estate.price.toLocaleString(
        undefined, // use a string like 'en-US' to override browser locale
        { minimumFractionDigits: 2 }
      )} $ </div>
    )
  }

  renderImage() {
    return (
      this.props.estate && this.props.estate.images.length !== 0
        ?
        <div>
          <img data-src={'http://' + this.props.estate.images[0].link} src={'http://' + this.props.estate.images[0].link} className='img-responsive b-lazy' />
        </div>
        : <div>  </div>
    )
  }

  render() {
    return (
      <div className='col-md-3'
        onMouseOver={this.onItemMouseOver.bind(this)}
        onMouseLeave={this.onItemMouseLeave.bind(this)}
        onClick={this.onDetailsClick.bind(this)}>
        <div className={styles['block']}>
          <div className={styles['thumbnail']} style={this.state.style}>
            {this.renderImage()}
            <div className={styles['caption']}>
              {this.renderName()}
              {this.renderPrice()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EstateListItem