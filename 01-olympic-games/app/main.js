import prompt from 'prompt'
import { welcomeMsg, property } from '../lib/print_functions.js'
import InputValidator from '../lib/input_validator.js'
import BarChart from '../lib/bar_chart.js'

welcomeMsg()

prompt.get(property, function (err, result) {
  if (err) return console.error(err)

  const chartName = result.command.split(' ')[1]
  const params = result.command.split(' ').slice(2)
  const input = new InputValidator(chartName, params).validate()

  if (input.isValid) {
    new BarChart(chartName, input.params).show().then((results) => {
      console.clear()

      if (chartName === 'medals') {
        console.log('Year Team Amount')
        for (const result of results) {
          console.log(`${result.year} ${result.noc_name}  ${'\u2610'.repeat(result.medal_count)}`)
        }
      } else {
        const topValue = results[0].count_medal
        results[0].proportionalValue = 200

        console.log('Year Amount')
        for (const result of results) {
          if (!result.proportionalValue) result.proportionalValue = result.count_medal * 200 / topValue
          console.log(`${result.noc_name}  ${'\u2610'.repeat(result.proportionalValue)}`)
        }
      }
    })
  } else {
    input.errMsg.forEach((err) => console.error(`Error: ${err}`))
    process.exit()
  }
})
