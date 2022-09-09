import * as fs from "fs"

export default class CSVParser {
    constructor(filepath) {
        this.csv =  fs.readFileSync(filepath, "utf8")
    }

    parse(){
        let rawData = this._csvToArray(this.csv),
            headers = this._makeHeaders(rawData),
            jsonData = []

        rawData.forEach((line) => {
            let lineObject = {}

            headers.forEach((key, i) => {
                lineObject[key] = line[i]
            });
            jsonData.push(lineObject)
        })

        return jsonData
    }

    _csvToArray(text) {
        let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
        for (l of text) {
            if ('"' === l) {
                if (s && l === p) row[i] += l;
                s = !s;
            } else if (',' === l && s) l = row[++i] = '';
            else if ('\n' === l && s) {
                if ('\r' === p) row[i] = row[i].slice(0, -1);
                row = ret[++r] = [l = '']; i = 0;
            } else row[i] += l;
            p = l;
        }
        return ret;
    };

    _makeHeaders(data) {
        return data.shift()
    }
}
