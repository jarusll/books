import React, { useEffect, useReducer, useState } from 'react';
import DataTable from 'react-data-table-component';
import { fetch } from './functions/fetch';
import './App.css';
import CSV from './classes/CSV';
import Author from './types/Author';
import Book from './types/Book';
import Magazine from './types/Magazine';
import BookAction from './types/BookAction';
import MagazineAction from './types/MagazineAction';
import AuthorAction from './types/AuthorAction';

function authorReducer(state: Author[], action: AuthorAction){
  switch(action.type){
    default:
      return state
  }
}

function bookReducer(state: Book[], action: BookAction){
  switch(action.type){
    case "FETCH":
      return action.payload
    default:
      return state
  }
}

function magazineReducer(state: Magazine[], action: MagazineAction){
  switch(action.type){
    case "FETCH":
      return action.payload
    default:
      return state
  }
}

function App() {
  const [author, authorDispatch] = useReducer(authorReducer, [])
  const [magazine, magazineDispatch] = useReducer(magazineReducer, [])
  const [book, bookDispatch] = useReducer(bookReducer, [])

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv")
      .then(x => {
        const csv = new CSV(x)
        magazineDispatch({type: "FETCH", payload: csv.toJson()})
      })
  }, [])

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/books.csv")
      .then(x => {
        const csv = new CSV(x)
        bookDispatch({type: "FETCH", payload: csv.toJson()})
      })
  }, [])

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

  return (
    <div className='container'>
      <div className='searchContainer'>
        <input type="text" className='search' />
      </div>
      {(book || magazine) && <DataTable columns={columns} data={(book as Array<any>).concat(magazine as Array<any>)} dense highlightOnHover pointerOnHover />}
    </div>
  );
}

export default App;
