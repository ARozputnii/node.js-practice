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
          resolve(new DbConnector({id: row || null}))
        }
      })
    })
  }

  async setRecord (createQuery, updateQuery = null, updateCondition = null) {
    return new Promise(async (resolve) => {
      if (this.record.id && updateQuery && updateCondition) {
        this.record = await this._runToDb(updateQuery)
      } else if (!this.record.id) {
        this.record.id = await this._runToDb(createQuery)
      } else {
        return
      }

      resolve(this.record.id)
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
