import styles from './modalStyles.scss'
import commonStyles from './index.scss'
import React from 'react'
import { Button } from 'react-bootstrap'

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
    const file = this.refs.fileInput.files[0]

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
          <span onClick={this.closeModal.bind(this)} className={styles['close']}>&times;</span>
          <h3> Add some images </h3>
          <hr/>
          <div className={commonStyles["error"]}>
            {this.state.error}
          </div>
          {this.state.image && !this.state.error 
            ? <Button bsStyle='success' className={commonStyles['bsButtonMarginBottom']} onClick={this.props.saveImage.bind(this, this.state.image, this.state.estateId)}> 
            <span className='glyphicon glyphicon-ok'></span>{'\u00A0'}
            Save 
            </Button> 
            : null}
          <input className={styles['inputfile']} type='file' ref='fileInput' onChange={this.onImageSelectionChange.bind(this, this.props.estateId)} />
          <img className={styles['uploadedImage']} ref='imageContainer' />
        </div>
      </div>
    )
  }
}