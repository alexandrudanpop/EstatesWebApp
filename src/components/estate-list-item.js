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
        <td> <input type="text" ref="nameInput" autoFocus defaultValue={this.props.estate.name} /> </td>
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
          <ButtonToolbar>
            <Button bsStyle='success' onClick={this.onSaveClick.bind(this)}> Save </Button>
            <Button onClick={this.onCancelClick.bind(this)}> Cancel </Button>
          </ButtonToolbar>
        </td>
      )
    }

    return (
      <td>
        <ButtonToolbar>
          <Button bsStyle='warning' onClick={this.onEditClick.bind(this)}> Edit </Button>
          <Button bsStyle='danger' onClick={this.onDeleteClick.bind(this)}> Delete </Button>
          <Button bsStyle='primary' onClick={this.onAddImagesClick.bind(this)}> Add images </Button>
        </ButtonToolbar>
      </td>
    )
  }

  render() {
    return (
      <tr onClick={this.props.selectedEstateChanged.bind(this, this.props.estate.id)}>
        <td> {this.props.estate.id} </td>
        {this.renderName()}
        {this.renderPrice()}
        {this.renderActionSection()}
      </tr>
    )
  }
}

export default EstateListItem