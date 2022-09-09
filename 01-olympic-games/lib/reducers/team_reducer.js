import BaseReducer from './base_reducer.js'

export default class TeamReducer extends BaseReducer {
  constructor () {
    super()
    this.ownFields = ['Team', 'NOC']
  }

  prepareObj (obj) {
    const filteredData = this._extractData(obj)

    Object.entries(filteredData).forEach(([key, value]) => {
      if (key === 'Team') {
        if (!value) return null
        filteredData[key] = value.replace(/[^a-zA-Z ]/g, '')
      }
    })

    return filteredData
  }
}
