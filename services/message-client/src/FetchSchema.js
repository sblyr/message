import React from 'react'
import api from './api'
import store from './store'

class FetchSchema extends React.Component {
    state = {
        data: null,
        loading: true
    };

    componentDidMount() {
        this.fetch();
    }

    fetch = async () => {
        this.setState({
            loading: true
        });

        const response = await api.request({
            method: 'get',
            url: '/schema'
        })
        
        store.dispatch({
            type: "SET_STATE",
            payload: response.data.data
        });

        this.setState({
            loading: false
        });
    };

    render() {
        if (this.state.loading) {
            return null
        }

        return this.props.children;
    }
}

export default FetchSchema