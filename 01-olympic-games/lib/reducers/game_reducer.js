import BaseReducer from './base_reducer.js'

export default class GameReducer extends BaseReducer {
  constructor () {
    super()
    this.ownFields = ['Year', 'Season', 'City']
  }

  prepareObj (obj) {
    const filteredData = this._extractData(obj)

    Object.entries(filteredData).forEach(([key, value]) => {
      switch (key) {
        case 'Season':
          if (value === 'Summer') {
            filteredData[key] = 0
          } else if (value === 'Winter') {
            filteredData[key] = 1
          } else {
            filteredData[key] = null
          }
          break
        case 'City':
          if (!value) return
          break
      }
    })

    return filteredData
  }
}
