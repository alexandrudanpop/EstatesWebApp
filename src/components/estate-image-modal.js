import styles from './modalStyles.scss'
import commonStyles from './index.scss'
import React from 'react'

export default class EstateImageModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      image: null,
      estateId: null,
      error: null
    }
  }

  isValidImage(fileName) {
    const regex = /(?:\.([^.]+))?$/
    const extension = regex.exec(fileName)[0].toLowerCase()

    if (extension === '.jpg' || extension === '.png' || extension === '.bmp' || extension === '.gif' || extension === '.tif') {
      return true
    }
    return false
  }

  onImageSelectionChange(estateId) {
    var file = this.refs.fileInput.files[0]

    if (!file || !this.isValidImage(file.name)) {
      this.setState({ error: "Provided file is not an image" })
      return
    } else {
      this.setState({ error: null })
    }

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
          <div className={commonStyles["error"]}>
            {this.state.error}
          </div>
          <button onClick={this.props.saveImage.bind(this, this.state.image, this.state.estateId)}> Save </button>
          <input className={styles['inputfile']} type='file' ref='fileInput' onChange={this.onImageSelectionChange.bind(this, this.props.estateId)} />
          <img className={styles['uploadedImage']} ref='imageContainer' />
        </div>
      </div>
    )
  }
}