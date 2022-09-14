import BaseReducer from './base_reducer.js'

export default class EventReducer extends BaseReducer {
  constructor () {
    super()
    this.ownFields = ['Event']
  }
}
