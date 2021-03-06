// Remote Actions

import toastr from 'toastr'
import debounce from 'lodash/debounce'

import store from 'store'
import { FETCH_TIMEOUT,
  OMDB_API_URL_AUTHORITY,
  OMDB_API_KEY
} from 'omdb_constants'
import ActionType from './const'
import {
  replaceFilms,
  appendFilms,
  updateFilmDetails,
  setFetching,
} from '.'

const OBDB_API = `${OMDB_API_URL_AUTHORITY}?apikey=${OMDB_API_KEY}&type=movie`
const queryFetchUri = (query) => `${OBDB_API}&s=${query}`
const pageFetchUri = (query, page) => queryFetchUri(query) + `&page=${page}`
const filmFetchUri = (id) => `${OBDB_API}&i=${id}&plot=full`

function toJson(res) {
  try {
    return res.json()
  } catch (e) {
    return Promise.reject(e)
  }
}

const onCatch = (e) => {
  console.error(e)
  toastr.error(e, 'An error occured', {
    preventDuplicates: true,
  })
}

// Returns Promise that resolves to fetched result if successful
const promiseFetchOrTimeout = (dispatch, uri, millisec=FETCH_TIMEOUT) => {
  let timeout
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(() => {
      reject(
        new Error(
          'Unable to fetch data. Try a different title or try again later.',
        ),
      )
    }, millisec)
  })
  dispatch(setFetching(true))
  return Promise.race([fetch(uri), timeoutPromise])
    .then(toJson)
    .catch(onCatch)
    .finally(() => {
      clearTimeout(timeout)
      dispatch(setFetching(false))
    })
}

export const promiseQueryResults = (query) => (dispatch) => promiseFetchOrTimeout(
  dispatch, queryFetchUri(query)
).then((res={ Search: [], totalResults: 0 }) => dispatch(replaceFilms(
  query, res.Search, res.totalResults
)))

export const promiseQueryPageFetch = () => (dispatch) => {
  const { query='', pageNum=1 } = store.getState()
  const nextPageNum = pageNum + 1
  return promiseFetchOrTimeout(dispatch, pageFetchUri(query, nextPageNum))
    .then((res={ Search: [], totalResults: 0 }) => {
      dispatch(appendFilms(nextPageNum, res.Search))
    })
}

export const promiseFilmDetails = (id) => (dispatch) => {
  dispatch(updateFilmDetails(null))
  return promiseFetchOrTimeout(
    dispatch,
    filmFetchUri(id),
  ).then((res) => dispatch(updateFilmDetails(res)))
}

const _setQuery = (query='') => ({
  type: ActionType.SET_QUERY,
  data: { query },
})

export const setQuery = (query='') => (dispatch) => {
  const debouncedDispatchPromiseQueryResults = debounce(
    () => dispatch(promiseQueryResults(query)),
    300
  )
  dispatch(_setQuery(query))

  if (!query) {
    return dispatch(replaceFilms([]))
  }
  return debouncedDispatchPromiseQueryResults(query)
}
