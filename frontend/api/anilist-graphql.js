// @flow
import 'whatwg-fetch'

type ALtype = {
  urls: {
    root: string,
    browse: string,
    accessToken: string,
    anime: string,
    genreList: string,
    search: string
  },
  getAnimeSeason: Function,
  getAPIToken: Function,
  getAnimeDetails: Function,
  getAnimeDetailsSmall: Function,
  getAnimeYear: Function,
  getGenres: Function,
  searchAnime: Function
}

const encodeParams = (options) =>
  Object.keys(options)
    .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(options[k]))
    .join('&')

const AL: ALtype = {
  urls: {
    root: 'https://graphql.anilist.co/api/',
  },
  getAnimeSeason(params: {}, token: string): Promise<*>{
    let query = `
      query ($id: Int, $page: Int, $perPage: Int, $year: Int, $season: MediaSeason) {
        Page (page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          media (id: $id, season: $season, seasonYear: $year) {
            id
            title {
              romaji
            }
            meanScore
            coverImage {
              large
              medium
            }
            characters {
              nodes {
                name {
                  first
                  last
                  native
                  alternative
                }
                image {
                  medium
                  large
                }
              }
            }
          }
        }
      }
    `

    let variables = {
      page: 1,
      perPage: 50,
      ...params,
      season: params.season.toUpperCase()
    }

    var url = 'https://graphql.anilist.co/api/',
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    return fetch(url, options)
      .then(res => res.json())
      .then(data => {
        return data.data
      })
  },
  getAnimeYear(year, seasons, token: string) {

  },

  getAPIToken(): Promise<*> {

  },
  getAnimeDetails(animeId: string, token: string): Promise<*>{

  },
  getAnimeDetailsSmall(animeId: string, token: string): Promise<*>{

  },
  getGenres(token: string): Promise<*>{
  },
  searchAnime(query: string, token: string): Promise<*>{
  }
}

export default AL;
