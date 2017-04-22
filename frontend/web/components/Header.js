// @flow
import React from 'react'
import { Link, withRouter } from 'react-router'
import { connect } from 'react-redux'

const seasons = [
  {
    param: 'winter',
    name: 'Winter'
  },
  {
    param: 'spring',
    name: 'Spring',
  },
  {
    param: 'summer',
    name: 'Summer'
  },
  {
    param: 'fall',
    name: 'Fall'
  }
]

class Header extends React.Component {
  isCurrent(param) {
    const { routing, config } = this.props

    //if route isn't home or has season/year params
    if(!routing.params.season && !routing.params.year && routing.location.pathname !== "/")
      return ''

    let currentSeason = routing.params.season || config.currentSeason.season,
        currentYear = routing.params.year || config.currentSeason.year

    switch(typeof param){
      case 'number':
        return param == currentYear ? 'current' : ''
      case 'string':
        return param == currentSeason ? 'current' : ''
      default:
        return ''
    }
  }

  getPathNameYear(param, routing: Object, config: Object){
    if(routing.params.year)
      return `/${param}/${routing.params.season}`
    return `/${param}/${config.currentSeason.season}`
  }

  getPathNameSeason(param, routing: Object, config: Object){
    if(routing.params.season)
      return `/${routing.params.year}/${param}`
    return `/${config.currentSeason.year}/${param}`
  }

  handleRouteChange(param){
    const { routing, router, config } = this.props
    let pathname,
        type = typeof param === 'number' ? 'year' : 'season'

    switch(type){
      case 'year':
        pathname = this.getPathNameYear(param, routing, config)
        break
      case 'season':
        pathname = this.getPathNameSeason(param, routing, config)
        break
      default:
    }

    if(pathname === routing.location.pathname) return

    router.push({
      pathname,
      query: routing.location.query
    })
  }
  render(){
    const config = this.props.config
    const routes = seasons;
    const numOfYears = 5;
    
    for(var i = 0; i < numOfYears; i++) {
      routes.push({
        name: config.currentSeason.year - i,
        param: config.currentSeason.year - i
      })
    }

    return (
      <header>
        <Link to="/"><h2 className="site-title">Anime Drop</h2></Link>
        <nav className="primary">
          {routes.map(({ name, param}) =>
            <a
              key={param}
              onClick={this.handleRouteChange.bind(this, param)}
              className={this.isCurrent(param)}>{name}</a>
          )}
        </nav>
      </header>
    )
  }
}

export default connect(({ routing, config }) => ({ routing, config }))(withRouter(Header))
