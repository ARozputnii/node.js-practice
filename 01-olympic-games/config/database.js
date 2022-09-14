import sqlite3 from 'sqlite3'

const database = sqlite3.verbose()
const filepath = './db/olympic_history.db'

const db = new database.Database(filepath, (err) => {
  if (err) {
    console.error(err.message)
  }
})

export default db
