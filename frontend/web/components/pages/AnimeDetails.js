// @flow
import React from 'react'
import { getAnimeDetails } from '../../../actions/animeDetails'
import { connect } from 'react-redux'
import Loader from '../Loader'
import {formatScore, capitalise} from '../../../utils'

const Character = ({charDetail: {name_first, name_last, image_url_med, actor}}) => (
  <li className="character-card">
    <img src={image_url_med} className="character-image" />
    <div className="name-card">
      <div className="character-name">
        {name_first + " "}
        {name_last}
      </div>
      <div className="actor-name">
        {actor[0].name_first + " "}
        {actor[0].name_last}
      </div>
    </div>
  </li>
)

class AnimeDetails extends React.Component {
  props: {
    animeCache: Array<Object>,
    routeParams: Object,
    getAnimeDetails: Function,
    params: Object
  }

  componentWillMount() {
    console.log('component will mount', this.props);
    let animeId = this.props.params.id;
    if(!this.props.animeCache[animeId]) {
      this.props.getAnimeDetails(this.props.params.id);
    } else {
      console.log('Cache already has this anime')
    }
  }

  componentWillReceiveProps () {

  }
  render () {
    const { animeCache } = this.props
    let content = null,
        details = animeCache[this.props.params.id]
    console.log(details)
    if (details) {
      let averageScore = formatScore(details.average_score),
          description = details.description.replace(/<[^>]*>/ig, ""),
          genres = details.genres.map((genresList, i) => <li className="genres-list-item" key={i}>{genresList}</li>),
          characters

      let externalLinks = details.external_links.map(link =>
        <div>
          <a href={link.url}>{link.site}</a>
        </div>
      )
      console.log(externalLinks)
      if (details.characters.length > 0) {
        characters = details.characters.slice(0, 7)
          .map((charDetail, i) => <Character charDetail={charDetail} key={i}/>)
      }
      content = (
        <div>
          <img src={details.image_url_lge} />
          <div className="side-details-container">
            <p className="title">{details.title_romaji}</p>
            <p className="title-japanese">{details.title_japanese}</p>
            <ul className="genres">{genres}</ul>
            <p className="average-score">Rating: {averageScore}/10</p>
            <p>Episodes: {details.total_episodes}</p>
            <p>Status: {capitalise(details.airing_status)}</p>
          </div>
          <div className="bottom-details-container">
            <h3>SYNOPSIS</h3>
            <p className="description">{description}</p>
            <ul className="cast">
              <h3>Main Characters</h3>
              {characters}
            </ul>
            <div className="external-links">
              <h3>External Links</h3>
              {externalLinks}
            </div>
          </div>
        </div>
      )
    } else {
      content = <Loader />
    }
    return (
      <div className="main-container">
        <div className="anime-details">
          {content}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ animeCache }) => ({ animeCache });


export default connect(mapStateToProps, { getAnimeDetails })(AnimeDetails)
