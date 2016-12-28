import styles from './index.scss';
import React from 'react';
import axios from 'axios'
import Spinner from 'react-spinkit'
import { api } from '../api.js'

import EstateList from './estate-list'
import EstateFilters from './estate-filters'

const endpoint = api + '/api/estates'

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            estates: [],
            createNewEnabled: true,
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

        foundEstate[0].name = estate.name
        foundEstate[0].price = estate.price

        this.setState({ estates: this.state.estates })

        axios.put(endpoint, foundEstate[0])
            .then((response) => console.log(response))
            .catch((error) => {
                this.setState({ errors: error })
            })

        return true;
    }

    deleteEstate(id) {
        const newEstates = this.state.estates.filter(function (estate) {
            return estate.id != id
        })

        this.setState({ estates: newEstates })

        const deleteEndpoint = endpoint + '/' + id.toString()
        axios.delete(deleteEndpoint, id)
            .then((response) => console.log(response))
            .catch((error) => {
                this.setState({ errors: error.response.statusText })
            })
    }

    cancel() {
        this.setState({ errors: null })
    }

    onAddNewClick() {
        this.setState({ createNewEnabled: false })
    }

    onSaveNewClick() {
        var newEstate = {
            name: this.refs.newItemName.value,
            price: this.refs.newItemPrice.value
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
                var newEstates = this.state.estates
                this.setState({
                    estates: newEstates,
                    createNewEnabled: true,
                    errors: null
                })
            })
            .catch((error) => {
                this.setState({ errors: error.response.statusText })
            })
    }

    onCancelClick() {
        this.setState({
            createNewEnabled: true,
            errors: null
        })
    }

    search(searchItems) {
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
                this.setState({
                    errors: error.response.status === 404
                        ? "There are no estates in the DB yet. Add some ;-)"
                        : error.response.statusText
                })
            })
    }

    render() {
        return (
            <div>
                <h2> Estates </h2>
                {this.state.estates.length === 0 ? <span> <Spinner spinnerName='three-bounce' noFadeIn /> </span> : <br />}
                {// todo extract new comp - CreateNewEstate
                    this.state.createNewEnabled ? <button onClick={this.onAddNewClick.bind(this)}> Add new </button>
                        : <div>
                            <label> Name </label> <input className={styles['autoSizedInput']} type="text" ref="newItemName" autoFocus />
                            <label> Price </label> <input className={styles['autoSizedInput']} type="text" ref="newItemPrice" />
                            <span> </span>
                            <button onClick={this.onSaveNewClick.bind(this)}> Save </button>
                            <button className={styles['cancelButton']} onClick={this.onCancelClick.bind(this)}> Cancel </button>
                        </div>
                }
                <EstateFilters
                    search={this.search.bind(this)}
                    removeFilters={this.removeFilters.bind(this)}
                    />
                <div className={styles["error"]}>
                    {this.state.errors}
                </div>
                <EstateList
                    estates={this.state.estates}
                    deleteEstate={this.deleteEstate.bind(this)}
                    editEstate={this.editEstate.bind(this)}
                    cancel={this.cancel.bind(this)}
                    />
            </div>
        )
    }
}