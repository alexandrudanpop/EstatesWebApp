import React, { Component } from 'react';
import EstateImageSlider from './estate-image-slider'
import EstateList from './estate-list'
import styles from './index.scss';

export default class EstatesContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMobile: null
    }
  }

  renderImageSlider() {
    return (
      this.props.estates[0] && this.props.estates[0].images.length !== 0
        ?
        <div className={styles['imageCarousel']}>
          {this.props.selectedEstate
            ? <EstateImageSlider images={this.props.selectedEstate.images} />
            : <EstateImageSlider images={this.props.estates[0].images} />
          }
        </div>
        : null
    )
  }

  render() {
    if (!this.props.estates) {
      return null;
    }
    if (parent.window.innerWidth < 800) {
      var isMobile = true
    }

    return (
      <div>
        {isMobile ? this.renderImageSlider() : null}
        <div className={styles['estateList']}>
          <EstateList
            estates={this.props.estates}
            deleteEstate={this.props.deleteEstate}
            editEstate={this.props.editEstate}
            cancel={this.props.cancel}
            showImages={this.props.showImages}
            selectedEstateChanged={this.props.selectedEstateChanged}
            />
        </div>
        {isMobile ? null : this.renderImageSlider()}
      </div>
    );
  }
}