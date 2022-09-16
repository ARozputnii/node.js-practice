import db from '../config/database.js'

export default class DbConnector {
  constructor (record) {
    this.record = record
  }

  static async getRecord (query) {
    return new Promise(function (resolve) {
      db.get(query, function (err, row) {
        if (err) {
          return console.error(err.message)
        } else {
          resolve(new DbConnector(row || null))
        }
      })
    })
  }

  setRecord (createQuery, updateQuery = null, updateCondition = null) {
    return new Promise(async (resolve) => {
      if (this.record && updateQuery && updateCondition) {
        this.record = { id: await this._runToDb(updateQuery) }
      } else if (!this.record) {
        this.record = { id: await this._runToDb(createQuery) }
      }
      resolve(this.record)
    })
  }

  _runToDb (query) {
    return new Promise(function (resolve) {
      db.serialize(function () {
        db.run(query, function (err) {
          if (err) {
            return console.error(err.message)
          }
          resolve(this.lastID)
        })
      })
    })
  }
}
