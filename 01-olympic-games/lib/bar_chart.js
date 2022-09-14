import DbConnector from './db_connector.js'

export default class BarChart {
  constructor (chartName, params) {
    this.chartName = chartName
    this.teamName = params.nocName
    this.year = params.year
    this.season = params.season
    this.medal = params.medal
  }

  async show () {
    const sql = this._buildSQL()
    const records = await this._getData(sql)
    return records
  }

  async _getData (sql) {
    const records = await new DbConnector().getAllRecords(sql)
    return records
  }

  _buildSQL () {
    let sql = ''
    const medalQuery = this.medal ? `= ${this.medal}` : 'in (1,2,3)'
    const yearQuery = this.year ? `and games.year = ${this.year}` : ''

    switch (this.chartName) {
      case 'medals':
        sql = `select games.year, teams.noc_name, count(results.medal) as medal_count
        from games
          left outer join teams on teams.noc_name = "${this.teamName}"
          left outer join athletes on teams.id = athletes.team_id
          left join games as game_years on games.year = game_years.year 
                                   and game_years.season = ${this.season}
          left join results on game_years.id = results.game_id 
                                   and athletes.id = results.athlete_id 
                                   and results.medal ${medalQuery}
        group by games.year
        order by games.year`
        break
      case 'top-teams':
        sql = `select teams.noc_name, count(results.medal) as count_medal
        from teams
          left join athletes on teams.id = athletes.team_id
          left outer join results on athletes.id = results.athlete_id
          left join games on games.id = results.game_id
        where results.medal ${medalQuery}
          and games.season = 0
          ${yearQuery}
        group by teams.noc_name
        order by count_medal desc`
        break
    }

    return sql
  }
}
