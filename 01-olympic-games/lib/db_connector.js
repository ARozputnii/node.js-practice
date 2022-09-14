import db from '../config/database.js'

export default class DbConnector {
  constructor (record) {
    this.record = record
  }

  static async getRecord (query) {
    return new Promise(function (resolve, _reject) {
      db.get(query, function (err, row) {
        if (err) {
          return console.error(err.message)
        } else {
          resolve(new DbConnector(row || null))
        }
      })
    })
  }

  async setRecord (createQuery, updateQuery = null, updateCondition = null) {
    if (this.record && updateQuery && updateCondition) {
      this.record = await this._runToDb(updateQuery)
    } else if (!this.record) {
      this.record = await this._runToDb(createQuery)
    } else {
      return
    }

    return this.record
  }

  _runToDb (query) {
    return new Promise(function (resolve, _reject) {
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
