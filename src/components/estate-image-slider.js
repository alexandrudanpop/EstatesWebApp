import React, { Component } from 'react'
import styles from './index.scss'
import Slider from 'react-slick'

export default class EstateImageSlider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sliderSetting: {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 200,
        fade: true,
        cssEase: 'linear',
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  }

  render() {
    if (!this.props.images || this.props.images.length == 0) {
      return (null)
    }

    return (
      <Slider {...this.state.sliderSetting}>
        {this.props.images.map(image => {
          return <img key={image.id} className={styles['estateImage']} src={'http://' + image.link} />
        })}
      </Slider>
    )
  }
}