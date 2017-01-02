import styles from './modalStyles.scss'
import React from 'react'

export default class EstateImageModal extends React.Component {
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
          <p> Images! </p>
        </div>
      </div>
    )
  }
}