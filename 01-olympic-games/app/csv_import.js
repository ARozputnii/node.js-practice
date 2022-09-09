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
const athleteReducer = new AthleteReducer()
const teamReducer = new TeamReducer()
const gameReducer = new GameReducer()
const sportReducer = new SportReducer()
const eventReducer = new EventReducer()
const resultReducer = new ResultReducer()

csvData.forEach(async (line) => {
  if (line.Games === '1906 Summer') return // task exception

  const teamData = teamReducer.prepareObj(line)
  const athleteData = athleteReducer.prepareObj(line)
  const gameData = gameReducer.prepareObj(line)
  const sportData = sportReducer.prepareObj(line)
  const eventData = eventReducer.prepareObj(line)
  const resultData = resultReducer.prepareObj(line)

  let teamID = await DbConnector.getRecord(`SELECT teams.id AS id FROM teams WHERE noc_name="${teamData.NOC}"`)
  teamID = await teamID.setRecord(
      `INSERT INTO teams (name, noc_name) VALUES ("${teamData.Team}", "${teamData.NOC}")`
  )

  let athleteID = await DbConnector.getRecord(
    'SELECT athletes.id FROM athletes ' +
    `WHERE full_name = "${athleteData.Name}" AND year_of_birth="${athleteData.Age}" AND sex="${athleteData.Sex}"`
  )
  athleteID = await athleteID.setRecord(
    'INSERT INTO athletes (full_name, year_of_birth, sex, params, team_id) ' +
    `VALUES ('${athleteData.Name}', '${athleteData.Age}', '${athleteData.Sex}', `+
    `'${JSON.stringify(athleteData.Params)}', '${teamID}')`
  )

  let gameID = await DbConnector.getRecord(
    'SELECT * FROM games ' +
    `WHERE year="${gameData.Year}" AND season="${gameData.Season}" AND city="${gameData.City}"`
  )
  const gameCity = gameID.record.city || null
  gameID = await gameID.setRecord(
    `INSERT INTO games (year, city, season) VALUES ("${gameData.Year}", "${gameData.City}", "${gameData.Season}")`,
    `UPDATE games SET city="${gameCity + ', ' + gameData.City}}" WHERE games.id="${gameID}"`,
    gameCity !== gameData.City
  )

  let sportID = await DbConnector.getRecord(`SELECT sports.id AS id FROM sports WHERE name='${sportData.Sport}'`)
  sportID = await sportID.setRecord(`INSERT INTO sports (name) VALUES ("${sportData.Sport}")`)

  let eventID = await DbConnector.getRecord(`SELECT events.id AS id FROM events WHERE name='${eventData.Event}'`)
  eventID = await eventID.setRecord(`INSERT INTO events (name) VALUES ("${eventData.Event}")`)

  const resultID = await DbConnector.getRecord(
    'SELECT results.id AS id FROM results ' +
    `WHERE athlete_id='${athleteID}' AND game_id='${gameID}' AND sport_id='${sportID}' ` +
    `AND event_id='${eventID}' AND medal='${resultData.Medal}'`
  )
  await resultID.setRecord('INSERT INTO results (athlete_id, game_id, sport_id, event_id, medal ) ' +
    `VALUES ("${athleteID}", "${gameID}", "${sportID}", "${eventID}", "${resultData.Medal}")`
  )
})
