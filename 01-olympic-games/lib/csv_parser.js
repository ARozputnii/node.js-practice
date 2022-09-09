import * as fs from 'fs'

export default class CSVParser {
  constructor (filepath) {
    this.csv = fs.readFileSync(filepath, 'utf8')
  }

  parse () {
    const rawData = this._csvToArray(this.csv)
    const headers = this._makeHeaders(rawData)
    const jsonData = []

    rawData.splice(-1) // remove empty line
    rawData.forEach((line) => {
      const lineObject = {}

      headers.forEach((key, i) => {
        lineObject[key] = line[i]
      })

      const promiseObj = this._makePromise(lineObject)

      jsonData.push(promiseObj)
    })

    return jsonData
  }

  _makePromise (element) {
    return new Promise((resolve) => {
      resolve(element)
    })
  }

  _makeHeaders (data) {
    return data.shift()
  }

  _csvToArray (text) {
    let p = ''; let row = ['']; const ret = [row]; let i = 0; let r = 0; let s = !0; let l
    for (l of text) {
      if (l === '"') {
        if (s && l === p) row[i] += l
        s = !s
      } else if (l === ',' && s) l = row[++i] = ''
      else if (l === '\n' && s) {
        if (p === '\r') row[i] = row[i].slice(0, -1)
        row = ret[++r] = [l = '']; i = 0
      } else row[i] += l
      p = l
    }
    return ret
  };
}
