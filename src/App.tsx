import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { fetch } from './functions/fetch';
import './App.css';
import CSV from './classes/CSV';

function App() {
  const [readable, setReadable] = useState([] as any)

  function concatReadable(anotherReadable: Array<any>){
    const newReadable = [...readable, ...anotherReadable]
    setReadable(() => newReadable)
  }

  const columns = [
    {
      name: 'Title',
      selector: (row: any) => row.title,
      sortable: true
    },
    {
      name: 'ISBN',
      selector: (row: any) => row.isbn,
    },
    {
      name: 'Author',
      selector: (row: any) => row.authors,
    }
  ];

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv")
      .then(x => {
        const csv = new CSV(x)
        concatReadable(csv.toJson())
      })
  }, [])

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/books.csv")
      .then(x => {
        const csv = new CSV(x)
        concatReadable(csv.toJson())
      })
  }, [])

  return (
    <>
      <pre>{JSON.stringify(readable, null, 4)}</pre>
      {readable && <DataTable columns={columns} data={readable} dense highlightOnHover pointerOnHover/>}
    </>
  );
}

export default App;
