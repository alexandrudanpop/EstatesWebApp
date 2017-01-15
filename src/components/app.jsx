import styles from './index.scss';
import React from 'react';
import axios from 'axios'
import Spinner from 'react-spinkit'
import { api } from '../api.js'

import EstateList from './estate-list'
import EstateFilters from './estate-filters'
import EstateImageModal from './estate-image-modal'

const endpoint = api + '/api/estates'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      estates: [],
      createNewEnabled: true,
      showImagesModal: false,
      selectedEstateId: null,
      errors: null
    }
  }

  validateEstate(estate) {
    if (!estate || !estate.name) {
      return "Name is required"
    }

    if (!estate || !estate.price) {
      return "Price is required"
    }

    if (!estate || isNaN(estate.price)) {
      return "Price must be a number"
    }
  }

  // todo refactor data access code to separate file
  editEstate(estate) {
    const validationErrors = this.validateEstate(estate);

    if (validationErrors) {
      this.setState({ errors: validationErrors })
      return;
    }

    this.setState({ errors: null })

    const foundEstate = this.state.estates.filter(function (e) {
      return e.id == estate.id
    })

    const editedEstate = {
      id: foundEstate[0].id,
      name: estate.name,
      price: estate.price
    }

    axios.put(endpoint, editedEstate)
      .then((response) => {
        console.log(response)
        foundEstate[0].name = estate.name
        foundEstate[0].price = estate.price

        this.setState({ estates: this.state.estates })
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const serverErrors = error.response.data.join(' and ')
          this.setState({ errors: serverErrors })
        } else if (error.message) {
          this.setState({ errors: error.message })
        }
      })

    return true;
  }

  deleteEstate(id) {
    const newEstates = this.state.estates.filter(function (estate) {
      return estate.id != id
    })

    const deleteEndpoint = endpoint + '/' + id.toString()
    axios.delete(deleteEndpoint, id)
      .then((response) => {
        console.log(response)
        this.setState({ estates: newEstates })
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const serverErrors = error.response.data.join(' and ')
          this.setState({ errors: serverErrors })
        } else if (error.message) {
          this.setState({ errors: error.message })
        }
      })
  }

  cancel() {
    this.setState({ errors: null })
  }

  onAddNewClick() {
    this.setState({ createNewEnabled: false })
  }

  onSaveNewClick() {
    var newEstate = {
      name: this.refs.newItemName.value,
      price: this.refs.newItemPrice.value
    }

    const validationErrors = this.validateEstate(newEstate);
    if (validationErrors) {
      this.setState({ errors: validationErrors })
      return;
    }

    axios.post(endpoint, newEstate)
      .then((response) => {
        console.log(response)
        newEstate.id = response.data;

        this.state.estates.push(newEstate)
        var newEstates = this.state.estates
        this.setState({
          estates: newEstates,
          createNewEnabled: true,
          errors: null
        })
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const serverErrors = error.response.data.join(' and ')
          this.setState({ errors: serverErrors })
        } else if (error.message) {
          this.setState({ errors: error.message })
        }
      })
  }

  onCancelClick() {
    this.setState({
      createNewEnabled: true,
      errors: null
    })
  }

  search(searchItems) {
    this.setState({ errors: null })
    if (searchItems.name) {
      const searchEndpoint = endpoint + '/' + searchItems.name;
      axios.get(searchEndpoint)
        .then((response) => {
          this.setState({ estates: response.data })
        })
        .catch((error) => {
          this.setState({
            errors: error.response.status === 404
              ? 'Can not find ' + searchItems.name
              : error.response.statusText
          })
        })
    }
  }

  removeFilters() {
    this.getEstates()
    this.setState({ errors: null })
  }

  componentDidMount() {
    this.getEstates()
  }

  getEstates() {
    axios.get(endpoint)
      .then((response) => {
        this.setState({ estates: response.data })
      })
      .catch((error) => {
        if (error.message) {
          this.setState({ errors: error.message })
        }
        else {
          this.setState({
            errors: error.response.status === 404
              ? "There are no estates in the DB yet. Add some ;-)"
              : error.response.statusText

          })
        }
      })
  }

  showImages(id) {
    this.setState({ showImagesModal: true, selectedEstateId: id })
  }

  hideImages() {
    this.setState({ showImagesModal: false })
  }

  saveImage(image, estateId) {
    if (image) {
      const endpoint = api + '/api/images'

      let file = new FormData();
      file.append(estateId, image)

      axios.post(endpoint, file)
        .catch((error) => {
          if (error.response && error.response.data){
            this.setState({ errors: error.response.data })
          } else if (error.message) {
            this.setState({ errors: error.message })
          }
        })
    }

    this.hideImages()
  }

  render() {
    return (
      <div>
        {
          this.state.showImagesModal ?
            <EstateImageModal
              hideImages={this.hideImages.bind(this)}
              saveImage={this.saveImage.bind(this)}
              estateId={this.state.selectedEstateId}
              /> : null
        }

        <h2> Estates </h2>
        {this.state.estates.length === 0 ? <span> <Spinner spinnerName='three-bounce' noFadeIn /> </span> : <br />}
        {// todo extract new comp - CreateNewEstate
          this.state.createNewEnabled ? <button onClick={this.onAddNewClick.bind(this)}> Add new </button>
            : <div>
              <label> Name </label> <input className={styles['autoSizedInput']} type="text" ref="newItemName" autoFocus />
              <label> Price </label> <input className={styles['autoSizedInput']} type="text" ref="newItemPrice" />
              <span> </span>
              <button onClick={this.onSaveNewClick.bind(this)}> Save </button>
              <button className={styles['defaultButton']} onClick={this.onCancelClick.bind(this)}> Cancel </button>
            </div>
        }
        <EstateFilters
          search={this.search.bind(this)}
          removeFilters={this.removeFilters.bind(this)}
          />

        <div className={styles["error"]}>
          {this.state.errors}
        </div>
        <EstateList
          estates={this.state.estates}
          deleteEstate={this.deleteEstate.bind(this)}
          editEstate={this.editEstate.bind(this)}
          cancel={this.cancel.bind(this)}
          showImages={this.showImages.bind(this)}
          />
      </div>
    )
  }
}