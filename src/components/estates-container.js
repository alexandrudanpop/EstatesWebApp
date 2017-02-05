import React, { Component } from 'react';
import styles from './index.scss';
import { PageHeader } from 'react-bootstrap'

import axios from 'axios'
import Spinner from 'react-spinkit'
import { api } from '../api.js'

import EstateImageSlider from './estate-image-slider'
import EstateList from './estate-list'
import EstateFilters from './estate-filters'
import EstateImageModal from './estate-image-modal'
import CreateEstate from './create-estate'

const endpoint = api + '/api/estates'
export default class EstatesContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      estates: [],
      createNewEnabled: true,
      showImagesModal: false,
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
    this.setState({ showImagesModal: false })
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

  selectedEstateChanged(estateId) {
    const selectedEstate = this.state.estates.filter((e) => {
      return e.id == estateId
    })
    this.setState({ selectedEstate: selectedEstate[0] })
  }

  renderImageSlider() {
    return (
      this.state.estates[0] && this.state.estates[0].images.length !== 0
        ?
        <div className={styles['imageCarousel']}>
          {this.state.selectedEstate
            ? <EstateImageSlider images={this.state.selectedEstate.images} />
            : <EstateImageSlider images={this.state.estates[0].images} />
          }
        </div>
        : <div> </div>
    )
  }

  render() {
    if (parent.window.innerWidth < 800) {
      var isMobile = true
    }

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
        <PageHeader>
          <span className='glyphicon glyphicon-home'></span>{'\u00A0'}
          Estates app
        </PageHeader>
        {this.state.estates.length === 0 ? <span> <Spinner spinnerName='three-bounce' noFadeIn /> </span> : <br />}

        {isMobile ? this.renderImageSlider() : null}

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

        <div className={styles["error"]}>
          {this.state.errors}
        </div>

        <div className={styles['estateList']}>
          <EstateList
            estates={this.state.estates}
            deleteEstate={this.deleteEstate.bind(this)}
            editEstate={this.editEstate.bind(this)}
            cancel={this.cancel.bind(this)}
            showImages={this.showImages.bind(this)}
            selectedEstateChanged={this.selectedEstateChanged.bind(this)}
          />
        </div>
        {isMobile ? null : this.renderImageSlider()}
      </div>
    );
  }
}