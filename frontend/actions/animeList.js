// @flow
import AL from '../api/anilist'
import { serverError } from './errors'
import { getAccessToken } from './accessToken'

const fetchAnimeListRequest = () => ({
  type: 'FETCH_ANIMELIST_REQUEST'
})

const fetchAnimeListComplete = () => ({
  type: 'FETCH_ANIMELIST_COMPLETE'
})

const fetchAnimeListFailure = () => ({
  type: 'FETCH_ANIMELIST_FAILURE'
})

const setSeason = (year: number, season: string, animes: Array<Object>) => ({
  type: 'SET_SEASON',
  payload: {
    year,
    season,
    animes
  }
})

const setYear = (year: number, animes: Array<Object>) => ({
  type: 'SET_YEAR',
  payload: {
    year,
    animes
  }
})

export function getAnimeList (year: number, season: ?string) {
  if(year && season) {
    return getSeason(year, season)
  } else {
    return getYear(year)
  }
}

export function getSeason(year: number, season: string) {
  return (dispatch: Function, getState: Function) => {
    const state = getState(),
          token = state.config.token,
          cache = state.seasons[year + "-" + season]

    if (cache)
      return false

    if (token)
      return getAnimeSeason(year, season, token.access_token)
    else
      return dispatch(getAccessToken())
        .then(newToken => getAnimeSeason(year, season, newToken.access_token))

    function getAnimeSeason(year: number, season: string, accessToken: string) {
      dispatch(fetchAnimeListRequest())
      return AL.getAnimeSeason({ year, season }, accessToken)
        .then(data => {
          dispatch(setSeason(year, season, data))
          dispatch(fetchAnimeListComplete())
        })
        .catch(err => {
          dispatch(serverError(err))
          dispatch(fetchAnimeListFailure())
        })
    }
  }
}

export function getYear(year: number) {
  return (dispatch: Function, getState: Function) => {
    const state = getState(),
          token = state.config.token;

    let seasons = ['winter', 'spring', 'summer', 'fall']
    let seasonsLeft =
      seasons.filter(season => !state.seasons[year + "-" + season])

    console.log(seasonsLeft)

    if (token)
      return getAnimeYear(year, seasonsLeft, token.access_token)
    else
      return dispatch(getAccessToken())
        .then(newToken => getAnimeYear(year, seasonsLeft, newToken.access_token))

    function getAnimeYear(year: number, seasonsLeft, accessToken: string) {
      let getSeasons = seasonsLeft.map(season => dispatch(getSeason(year, season)))
      return Promise.all(getSeasons)
    }
  }
}

export function getGenres() {
  return (dispatch: Function, getState: Function) => {

    const state = getState(),
          token = state.config.token,
          cache = state.genres

    if (cache.length > 0)
      return false

    if (token)
      return getGenres(token.access_token)
    else
      return dispatch(getAccessToken())
        .then(newToken => getGenres(newToken.access_token))

    function getGenres(accessToken){
      dispatch({ type: 'REQUEST_GENRES'})
      return AL.getGenres(accessToken)
        .then(genres => {
          dispatch({
            type: 'RECEIVE_GENRES',
            genres
          })
        })
    }
  }
}
