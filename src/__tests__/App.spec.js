import React from 'react'
import ReactDOM from 'react-dom'

import App, { reduce } from 'App'
import { Actions, } from 'actions'

const films = require('./films.json').Search

test('renders', () => {
	const div = document.createElement('div')
	ReactDOM.render(<App />, div)
	ReactDOM.unmountComponentAtNode(div)
})

test('Actions.VIEW_LIST', () => {
	const action = {
		type: Actions.VIEW_LIST,
		data: { view: Actions.VIEW_LIST }
	}
	expect(reduce({}, action)).toEqual(expect.objectContaining({
		view: Actions.VIEW_LIST,
	}))
})

test('Actions.VIEW_DETAIL', () => {
	const detail = films[0]
	const action = {
		type: Actions.VIEW_DETAIL,
		data: {
			view: Actions.VIEW_DETAIL,
			detail
		}
	}
	expect(reduce({}, action)).toEqual(expect.objectContaining({
		view: Actions.VIEW_DETAIL,
		detail
	}))
})

test('Actions.UPDATE_FILMS', () => {
	const action = {type: Actions.UPDATE_FILMS, data: { films }}
	expect(reduce({}, action)).toEqual(expect.objectContaining({
		films
	}))
})