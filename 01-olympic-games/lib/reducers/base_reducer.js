export default class BaseReducer {
  prepareObj (obj) {
    return this._extractData(obj)
  }

  _extractData (data) {
    const newObj = {}

    Object.keys(data).forEach(key => {
      if (this.ownFields.includes(key)) newObj[key] = data[key]
    })

    return newObj
  }
}
