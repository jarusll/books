import { csvToObj } from 'csv-to-js-parser'

export default class CSV {
    private csvString: string
    constructor(csvString: string) {
        this.csvString = csvString
    }

    value() {
        return this.csvString
    }

    toJson() {
        return csvToObj(this.csvString, ';')
    }
}
