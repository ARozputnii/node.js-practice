import Parser from '../lib/csv_parser.js'
import AthleteReducer from '../lib/reducers/athlete_reducer.js'
import TeamReducer from '../lib/reducers/team_reducer.js'
import GameReducer from '../lib/reducers/game_reducer.js'
import SportReducer from '../lib/reducers/sport_reducer.js'
import EventReducer from '../lib/reducers/event_reducer.js'
import ResultReducer from '../lib/reducers/result_reducer.js'
import DbConnector from '../lib/db_connector.js'

const filePath = 'public/athlete_events.csv'
const csvData = new Parser(filePath).parse()

async function importCSV () {
  for (const promise of csvData) {
    const line = await promise
    const result = await saveToDB(line)

    console.log(result)
  }
}

importCSV()

async function saveToDB (line) {
  const teamData = new TeamReducer().prepareObj(line)
  const athleteData = new AthleteReducer().prepareObj(line)
  const gameData = new GameReducer().prepareObj(line)
  const sportData = new SportReducer().prepareObj(line)
  const eventData = new EventReducer().prepareObj(line)
  const resultData = new ResultReducer().prepareObj(line)

  let team = await DbConnector.getRecord(`SELECT teams.id AS id FROM teams WHERE noc_name = "${teamData.NOC}"`)
  team = await team.setRecord(
    `INSERT INTO teams (name, noc_name) VALUES ("${teamData.Team}", "${teamData.NOC}")`
  )

  let athleteID = await DbConnector.getRecord(
    'SELECT athletes.id FROM athletes ' +
    `WHERE full_name = "${athleteData.Name}" AND year_of_birth="${athleteData.Age}" AND sex="${athleteData.Sex}"`
  )
  athleteID = await athleteID.setRecord(
    'INSERT INTO athletes (full_name, year_of_birth, sex, params, team_id) ' +
    `VALUES ('${athleteData.Name}', '${athleteData.Age}', '${athleteData.Sex}', ` +
    `'${JSON.stringify(athleteData.Params)}', '${team.id}')`
  )

  let game = await DbConnector.getRecord(
    'SELECT * FROM games ' +
    `WHERE year="${gameData.Year}" AND season="${gameData.Season}"`
  )
  const gameCity = game.record?.city || null
  if (line.Games !== '1906 Summer') { // task exception
    game = await game.setRecord(
      `INSERT INTO games (year, city, season) VALUES ("${gameData.Year}", "${gameData.City}", "${gameData.Season}")`,
      `UPDATE games SET city="${gameCity + ', ' + gameData.City}" WHERE games.id="${game.record?.id}"`,
      gameCity !== gameData.City
    )
  }

  let sportID = await DbConnector.getRecord(`SELECT sports.id AS id FROM sports WHERE name='${sportData.Sport}'`)
  sportID = await sportID.setRecord(`INSERT INTO sports (name) VALUES ("${sportData.Sport}")`)

  let eventID = await DbConnector.getRecord(`SELECT events.id AS id FROM events WHERE name='${eventData.Event}'`)
  eventID = await eventID.setRecord(`INSERT INTO events (name) VALUES ("${eventData.Event}")`)

  const resultID = await DbConnector.getRecord(
    'SELECT results.id AS id FROM results ' +
    `WHERE athlete_id='${athleteID}' AND game_id='${game.id}' AND sport_id='${sportID}' ` +
    `AND event_id='${eventID}' AND medal='${resultData.Medal}'`
  )
  resultID.setRecord('INSERT INTO results (athlete_id, game_id, sport_id, event_id, medal ) ' +
    `VALUES ("${athleteID}", "${game.id}", "${sportID}", "${eventID}", "${resultData.Medal}")`
  )

  return line.ID
}
