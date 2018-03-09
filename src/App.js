import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import debugFactory from 'debug'

import OmdbSearch from './omdb-search'
import { Actions } from './actions'
import {APP_NAME} from './constants'

const debug = debugFactory(`${APP_NAME}:app:debug`)

const initialState = {
	view: Actions.VIEW_LIST,
}

export function reduce(state=initialState, action) {
	const {type, data} = action
	switch(type) {
	case Actions.VIEW_LIST:
	case Actions.VIEW_DETAIL:
	case Actions.UPDATE_FILMS:
		return {
			...state,
			...data,
		}
	default:
		return state
	}
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
	reduce,
	composeEnhancers(applyMiddleware(thunk))
)

const App = () => (
	<Provider store={store}>
		<OmdbSearch />
	</Provider>
)

export default App
