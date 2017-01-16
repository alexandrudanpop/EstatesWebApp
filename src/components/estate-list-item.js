import React, { Component } from 'react'
import styles from './index.scss'
import EstateImageSlider from './estate-image-slider'

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
        <td> <input type="text" ref="nameInput" defaultValue={this.props.estate.name} /> </td>
      )
    }

    return (
      <td> {this.props.estate.name} </td>
    )
  }

  renderPrice() {
    if (this.state.isEditing) {
      return (
        <td> <input type="text" ref="priceInput" defaultValue={this.props.estate.price} /> </td>
      )
    }

    return (
      <td> {this.props.estate.price}</td>
    )
  }

  renderActionSection() {
    if (this.state.isEditing) {
      return (
        <td>
          <button onClick={this.onSaveClick.bind(this)}> Save </button>
          <button className={styles['defaultButton']} onClick={this.onCancelClick.bind(this)}> Cancel </button>
        </td>
      )
    }

    return (
      <td>
        <button className={styles['editButton']} onClick={this.onEditClick.bind(this)}> Edit </button>
        <button className={styles['deleteButton']} onClick={this.onDeleteClick.bind(this)}> Delete </button>
        <button className={styles['defaultButton']} onClick={this.onAddImagesClick.bind(this)}> Add images </button>
      </td>
    )
  }

  render() {
    return (
      <tr>
        <td> {this.props.estate.id} </td>
        {this.renderName()}
        {this.renderPrice()}
        {this.renderActionSection()}
        {this.props.estate.images ? <EstateImageSlider images={this.props.estate.images} /> : null} 
      </tr>
    )
  }
}

export default EstateListItem