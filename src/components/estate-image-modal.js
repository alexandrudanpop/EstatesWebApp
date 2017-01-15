import styles from './modalStyles.scss'
import React from 'react'

export default class EstateImageModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      image: null,
      estateId: null
    }
  }

  onImageSelectionChange(estateId) {
    var file = this.refs.fileInput.files[0]

    let reader = new FileReader()
    reader.onloadend = () => {
      this.refs.imageContainer.src = reader.result
      this.setState({ image: file, estateId: estateId })
    }
    if (file) {
      reader.readAsDataURL(file)
    }
  }

  closeModal() {
    let modal = this.refs.imageModal
    modal.style.display = 'none'

    this.props.hideImages()
  }

  render() {
    let showModalStyle = {
      display: 'block'
    }
    return (
      <div style={showModalStyle} className={styles['modal']} ref='imageModal'>
        <div className={styles['modal-content']}>
          <span ref='closeButton' onClick={this.closeModal.bind(this)} className={styles['close']}>&times;</span>
          <h3> Add some images </h3>
          <button onClick={this.props.saveImage.bind(this, this.state.image, this.state.estateId)}> Save </button>
          <input className={styles['inputfile']} type='file' ref='fileInput' onChange={this.onImageSelectionChange.bind(this, this.props.estateId)} />
          <img className={styles['uploadedImage']} ref='imageContainer' />
        </div>
      </div>
    )
  }
}