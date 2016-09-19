// @flow
type config = {
  token: ?string,
  currentSeason: Object
}

const initialState = () => {
  let now = new Date(),
      year = now.getFullYear(),
      month = now.getMonth(),
      season;


  switch(true){
    case month < 3:
      season = 'winter'
      break;
    case month < 6:
      season = 'spring'
      break;
    case month < 9:
      season = 'summer'
      break;
    case month < 12:
      season = 'fall'
      break;
    default:
      break;
  }

  return {
    token: null,
    currentSeason: {
      year,
      season
    }
  }
}

function reducer(state: config = initialState(), action: Object = {}){
  switch(action.type) {
    case 'SET_ACCESS_TOKEN':
      return {
        ...state,
        token: action.token
      }
    default:
      return state;
  }
}

export default reducer;
