export default class InputValidator {
  constructor (chart, params) {
    this.chart = chart
    this.params = params
    this.result = {
      isValid: true,
      errMsg: [],
      params: {
        nocName: null,
        year: null,
        season: null,
        medal: null
      }
    }
  }

  get availableOptions () {
    return {
      charts: ['medals', 'top-teams'],
      params: {
        seasons: ['winter', 'summer'],
        medals: ['gold', 'silver', 'bronze']
      }
    }
  }

  validate () {
    this.result = this._validateСhartInput()
    return this.result
  }

  _validateСhartInput () {
    if (!this.availableOptions.charts.includes(this.chart)) {
      this.result.isValid = false

      const defaultErr = `Available charts name are: ${this.availableOptions.charts.join(', ')}`
      const errMsg = this.chart?.length > 0
        ? `Chart name = '${this.chart}' is not available. ${defaultErr}`
        : `Chart name can't be empty. ${defaultErr}`
      this.result.errMsg.push(errMsg)
    }

    this.params.forEach((param) => {
      if (this.availableOptions.params.seasons.includes(param)) {
        this.result.params.season = this._setSeasonValue(param)
      } else if (this.availableOptions.params.medals.includes(param)) {
        this.result.params.medal = this._setMedalValue(param)
      } else if (param.length === 3) {
        this.result.params.nocName = param.toUpperCase()
      } else if (param.length === 4) {
        this.result.params.year = param
      } else {
        this.result.isValid = false
        this.result.errMsg.push(`Param = '${param}' is not available.`)
      }
    })

    return this.result
  }

  _setSeasonValue (season) {
    return season === 'winter' ? 1 : 0
  }

  _setMedalValue (medal) {
    let medalValue = null

    switch (medal.toLowerCase()) {
      case 'gold':
        medalValue = 1
        break
      case 'silver':
        medalValue = 2
        break
      case 'bronze':
        medalValue = 3
        break
    }

    return medalValue
  }
}
