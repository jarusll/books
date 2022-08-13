import { csvToObj } from 'csv-to-js-parser';

export default function csvToJson(csvString: string){
    return csvToObj(csvString, ';')
}
