import React from 'react'
import styles from './index.scss';

export default class EstateFilters extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isFiltering: false
    }
  }

  onFilterClick() {
    this.setState({ isFiltering: true })
  }

  onCancelClick() {
    this.setState({ isFiltering: false })

    this.props.removeFilters()
  }

  onSearchClick() {
    let searchItems = {}
    const name = this.refs.nameInput.value;
    if (name) {
      searchItems.name = name
    }

    this.props.search(searchItems);
  }

  render() {
    return (
      this.state.isFiltering
        ?
        <div>
          Name
          <input className={styles['autoSizedInput']} type="text" ref="nameInput" onChange={this.onSearchClick.bind(this)} />
          <button className={styles['defaultButton']} onClick={this.onCancelClick.bind(this)}> Cancel </button>
        </div>
        :
        <div>
          <button onClick={this.onFilterClick.bind(this)}> Filter </button>
        </div>
    )
  }
}