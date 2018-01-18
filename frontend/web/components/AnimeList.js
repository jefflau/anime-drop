// @flow
import React, { Component } from 'react'
import { Link } from 'react-router'
import Loader from './Loader'
import MotionFlip from 'react-motion-flip'

class AnimeList extends Component {
  props: {
    animes: Array<Object>
  }

  formatScore (averageScore: number) {
    return averageScore === 0 ? "" : parseInt(averageScore, 10)/10
  }

  renderAnime() {
    const { animes } = this.props

    if (animes) {
      return animes
          .sort((a, b) => a.average_score > b.average_score ? -1 : 1)
          .map((anime, i) => (
            <div key={anime.id}>
              <Link to={`/anime/${anime.id}`}>
                <img src={anime.coverImage.large} />
                <div className="overlay">
                  <h3><span>{anime.title.romaji}</span></h3>
                  {anime.meanScore ? <div className="score">{this.formatScore(anime.meanScore)}</div> : null}
                </div>
              </Link>
            </div>
          ))
    }
  }

  render() {
    const { animes } = this.props
    let content = <Loader />

    if(animes){
      content = (
        <MotionFlip
          component="ul"
          childComponent="li"
          className="anime-container"
          childClassName="anime-item"
        >
          {this.renderAnime()}
        </MotionFlip>
      )
    }

    return (
      <div>
        {content}
      </div>
    )
  }
}

export default AnimeList
