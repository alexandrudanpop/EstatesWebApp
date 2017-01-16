import React, { Component } from 'react'
import styles from './index.scss'
import Slider from 'react-slick'

export default class EstateImageSlider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sliderSetting: {
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false
      }
    }
  }

  render() {
    if (!this.props.images || this.props.images.length == 0) {
      return null
    }

    return (
      <td>
        <Slider {...this.state.sliderSetting}>
          {this.props.images.map(image => {
            return <img key={image.id} className={styles['estateImage']} src={'http://' + image.link} />
          })}
        </Slider>
      </td>
    )
  }
}