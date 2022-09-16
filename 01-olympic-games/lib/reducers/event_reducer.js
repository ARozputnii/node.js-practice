import BaseReducer from './base_reducer.js'

export default class EventReducer extends BaseReducer {
  constructor () {
    super()
    this.ownFields = ['Event']
  }

  prepareObj (obj) {
    const filteredData = this._extractData(obj)

    Object.entries(filteredData).forEach(([key, value]) => {
      if (key === 'Event') {
        if (!value) return null
        filteredData[key] = value.replace(/["']/g, "")
      }
    })

    return filteredData
  }
}
