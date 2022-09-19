import db from '../config/database.js'

export default class DbConnector {
  constructor (record=null) {
    this.record = record
  }

  static getRecord (query) {
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

  async setRecord (createQuery, updateQuery = null, updateCondition = null) {
    if (this.record && updateQuery && updateCondition) {
      this.record = { id: await this._runToDb(updateQuery) }
    } else if (!this.record) {
      this.record = { id: await this._runToDb(createQuery) }
    }
    return this.record
  }

  getAllRecords (sql) {
    return new Promise(function (resolve) {
      db.all(sql, [], (err, rows) => {
        if (err) return console.error(err.message)

        resolve(rows)
      });
    })
  }

  _runToDb (query) {
    return new Promise(function (resolve) {
      db.serialize(function () {
        db.run(query, function (err) {
          if (err) return console.error(err.message)

          resolve(this.lastID)
        })
      })
    })
  }
}
