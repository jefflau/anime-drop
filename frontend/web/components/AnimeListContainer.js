// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getAnimeList } from '../../actions/animeList';
import AnimeList from './AnimeList';
import Genres from './Genres';

const filterAnimeList = (animeList, filters) =>
  animeList.filter(anime =>
    filters.every(filter => anime.genres.find(genre => filter === genre))
  );

class AnimeListContainer extends Component {
  props: {
    getAnimeList: Function,
    getGenres: Function,
    animes: Object,
    genres: Array<Object>,
    year: number,
    season: string,
    routing: Object,
    params: Object,
    config: Object
  };

  seasonInCache(cache: ?Object, year: number, season: ?string) {
    if (!cache) return false;

    if (season) {
      return !cache[year + '-' + season];
    } else {
      return !cache[year];
    }
  }

  loadAnime(newProps: ?Object, oldProps: ?Object) {
    let props = newProps || this.props;
    const { getAnimeList, animes, year, season } = props;

    if (season && this.seasonInCache(animes, year, season)) {
      getAnimeList(year, season);
    } else if (year && !season && this.seasonInCache(animes, year)) {
      getAnimeList(year);
    }
  }

  componentWillMount() {
    this.loadAnime();
  }

  componentWillReceiveProps(nextProps: Object) {
    if (
      this.props.animes.loading !== nextProps.animes.loading ||
      this.props.config.token !== nextProps.config.token
    ) {
      return;
    }
    if (this.props.animes.loading.length === 0) {
      this.loadAnime(nextProps);
    }
  }

  formatScore(averageScore: number) {
    return averageScore === 0 ? '' : averageScore;
  }

  render() {
    const { animes, season, year, routing } = this.props;
    let animeList,
      genres = routing.location.query.genres,
      arrGenres;

    if (season && year) {
      animeList = animes[year + '-' + season];
    } else if (year) {
      let s = ['winter', 'summer', 'spring', 'fall'];

      let seasonsToShow = s
        .filter(season => animes[year + '-' + season])
        .map(season => animes[year + '-' + season]);

      animeList = [].concat(...seasonsToShow);
    }

    if (genres && animeList) {
      arrGenres = genres.split(',');
      animeList = filterAnimeList(animeList, arrGenres);
    }

    return (
      <div className="home">
        <Genres />
        <AnimeList animes={animeList} />
      </div>
    );
  }
}

export default connect(({ config, routing }) => ({ config, routing }), {
  getAnimeList
})(AnimeListContainer);
