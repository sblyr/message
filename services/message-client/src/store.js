import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import dispatch from './dispatch'
import initialState from './initialState'

const logger = createLogger({
    stateTransformer: state => state.toJS()
})

const store = createStore(
    dispatch,
    initialState,
    applyMiddleware(logger),
)

export default store