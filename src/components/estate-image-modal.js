import styles from './modalStyles.scss'
import React from 'react'

export default class EstateImageModal extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      image: null
    }
  }
  
  onImageSelectionChange() {
    var file = this.refs.fileInput.files[0]

    let reader = new FileReader()
    reader.onloadend = () => {
      this.refs.imageContainer.src = reader.result
      this.setState({image : file})
    }
    if (file) {
      reader.readAsDataURL(file)
    }
  }

  closeModal() {
    let modal = this.refs.myModal
    modal.style.display = 'none'

    this.props.hideImages()
  }

  render() {
    let showModalStyle = {
      display: 'block'
    }
    return (
      /*  ref or id should be the estateModal + id of the estate */
      <div style={showModalStyle} className={styles['modal']} ref='myModal'>
        <div className={styles['modal-content']}>
          <span ref='closeButton' onClick={this.closeModal.bind(this)} className={styles['close']}>&times;</span>
          <h3> Add some images </h3>
          <button onClick={this.props.saveImage.bind(this, this.state.image)}> Save </button>
          <input className={styles['inputfile']} type='file' ref='fileInput' onChange={this.onImageSelectionChange.bind(this)} />
          <img className={styles['uploadedImage']} ref='imageContainer' />
        </div>
      </div>
    )
  }
}