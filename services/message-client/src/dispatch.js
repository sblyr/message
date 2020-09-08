import { fromJS } from 'immutable'

export default (state, action) => {

    switch (action.type) {

        case 'SET_STATE': {
            return state.merge(fromJS(action.payload))
        }

        default: {
            return state
        }
    }
}