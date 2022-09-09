import BaseReducer from './base_reducer.js'

export default class ResultReducer extends BaseReducer {
  constructor () {
    super()
    this.ownFields = ['Medal']
  }

  prepareObj (obj) {
    const filteredData = this._extractData(obj)

    Object.entries(filteredData).forEach(([key, value]) => {
      if (key === 'Medal') {
        switch (value){
          case 'N/A':
            filteredData[key] = 0
            break
          case 'Gold':
            filteredData[key] = 1
            break
          case 'Silver':
            filteredData[key] = 2
            break
          case 'Bronze':
            filteredData[key] = 3
            break
        }
      }
    });

    return filteredData
  }
}
