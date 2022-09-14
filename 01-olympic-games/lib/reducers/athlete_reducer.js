import BaseReducer from './base_reducer.js'

export default class AthleteReducer extends BaseReducer {
  constructor () {
    super()
    this.ownFields = ['ID', 'Name', 'Sex', 'Age', 'Height', 'Weight', 'Team']
  }

  prepareObj (obj) {
    const filteredData = this._extractData(obj)

    Object.entries(filteredData).forEach(([key, value]) => {
      switch (key) {
        case 'Name':
          if (!value) return
          filteredData[key] = value.replace(/ *\([^)]*\) */g, '')
          break
        case 'Sex':
          if (!value) filteredData[key] = null
          break
        case 'Age':
          filteredData[key] = this._setYear(value)
          break
        case 'Height':
          filteredData.Params = this._makeParams(value, obj.Weight)
          break
      }
    })

    return filteredData
  }

  _makeParams (height, weight) {
    const obj = { height, weight }

    if (height === '' || height === 'NA') delete obj.height
    if (weight === '' || weight === 'NA') delete obj.weight

    return obj
  }

  _setYear (age) {
    if (age === 'NA') return 0
    const yearToday = new Date().getFullYear()
    return yearToday - Number(age)
  }
}
