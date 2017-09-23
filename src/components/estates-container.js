import React, { Component } from 'react';
import styles from './index.scss';
import { PageHeader } from 'react-bootstrap'

import axios from 'axios'
import Spinner from 'react-spinkit'
import { api } from '../api.js'

import EstateList from './estate-list'
import EstateFilters from './estate-filters'
import EstateImageModal from './estate-image-modal'
import EstateDetailsModal from './estate-details-modal'
import CreateEstate from './create-estate'

const endpoint = api + '/api/estates'
export default class EstatesContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      estates: [],
      createNewEnabled: true,
      showImagesModal: false,
      showDetailsModal: false,
      selectedEstateId: null,
      selectedEstate: null,
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

    const foundEstate = this.selectEstateById(estate.id)

    const editedEstate = {
      id: foundEstate.id,
      name: estate.name,
      price: estate.price
    }

    axios.put(endpoint, editedEstate)
      .then((response) => {
        console.log(response)
        foundEstate.name = estate.name
        foundEstate.price = estate.price

        this.setState({ estates: this.state.estates, showDetailsModal: false })
        this.hideDetails();
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

  onSaveNewClick(newEstate) {
    if (!newEstate) {
      return
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
        const newEstates = this.state.estates
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
    this.setState({ showImagesModal: true, selectedEstateId: id, errors: null })
  }

  hideImages() {
    this.setState({ showImagesModal: false, selectedEstateId: null })
  }

  showDetails(id) {
    const selectedEstate = this.selectEstateById(id);
    this.setState({ showDetailsModal: true, selectedEstateId: id, selectedEstate: selectedEstate, errors: null })
  }

  hideDetails() {
    this.setState({ showDetailsModal: false, selectedEstateId: null, selectedEstate: null })
  }

  saveImage(image, estateId) {
    if (image) {
      const endpoint = api + '/api/images'

      let file = new FormData();
      file.append(estateId, image)

      axios.post(endpoint, file)
        .then((response) => {
          if (!response.data) {
            return
          }
          const newEstates = this.state.estates.map((estate) => {
            if (estate.id === estateId) {
              estate.images.push(response.data)
              return estate
            }
            return estate
          })
          this.setState({ estates: newEstates });
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            this.setState({ errors: error.response.data })
          } else if (error.message) {
            this.setState({ errors: error.message })
          }
        })
    }

    this.hideImages()
  }

  selectEstateById(id) {
    const estate = this.state.estates.find(e => e.id == id)
    return estate;
  }

  deleteImage(id) {
    const deleteEndpoint = api + '/api/images/' + id

    axios.delete(deleteEndpoint, id)
      .then((response) => {
        const foundEstate = this.selectEstateById(this.state.selectedEstateId)
        foundEstate.images = foundEstate.images.filter(i => {
          if (i.id != id) {
            return i
          }
        })

        this.setState({estates: this.state.estates})
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          this.setState({ errors: error.response.data })
        } else if (error.message) {
          this.setState({ errors: error.message })
        }
      })
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

        {
          this.state.showDetailsModal ?
            <EstateDetailsModal
              hideDetails={this.hideDetails.bind(this)}
              estate={this.state.selectedEstate}
              editEstate={this.editEstate.bind(this)}
              showImages={this.showImages.bind(this)}
              deleteImage={this.deleteImage.bind(this)}
            /> : null
        }

        <PageHeader>
          <span className='glyphicon glyphicon-home'></span>{'\u00A0'}
          Estates app
        </PageHeader>
        {this.state.estates.length === 0 ? <span> <Spinner spinnerName='three-bounce' noFadeIn /> </span> : <br />}

        <CreateEstate
          createNewEnabled={this.state.createNewEnabled}
          onAddNewClick={this.onAddNewClick.bind(this)}
          onSaveNewClick={this.onSaveNewClick.bind(this)}
          onCancelClick={this.onCancelClick.bind(this)}
        />

        <EstateFilters
          search={this.search.bind(this)}
          removeFilters={this.removeFilters.bind(this)}
        />

        <div className={styles['error']}>
          {this.state.errors}
        </div>

        <div className={styles['estateList']}>
          <EstateList
            estates={this.state.estates}
            showImages={this.showImages.bind(this)}
            showDetails={this.showDetails.bind(this)}
          />
        </div>
      </div>
    );
  }
}