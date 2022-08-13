import React, { useEffect, useReducer, useState } from 'react';
import DataTable from 'react-data-table-component';
import { fetch } from './functions/fetch';
import './App.css';
import Author from './types/Author';
import Book from './types/Book';
import Magazine from './types/Magazine';
import BookAction from './types/BookAction';
import MagazineAction from './types/MagazineAction';
import AuthorAction from './types/AuthorAction';
import csvToJson from './functions/csvToJson';
import fuzzysearch from 'fuzzysearch-ts';
import { useForm } from 'react-hook-form';

function authorReducer(state: Author[], action: AuthorAction){
  switch(action.type){
    case "FETCH":
      return action.payload
    default:
      return state
  }
}

function bookReducer(state: Book[], action: BookAction){
  switch(action.type){
    case "FETCH":
      return action.payload
    case "ADD":
      return [...state, action.payload[0]]
    default:
      return state
  }
}

function magazineReducer(state: Magazine[], action: MagazineAction){
  switch(action.type){
    case "FETCH":
      return action.payload
    case "ADD":
      return [...state, action.payload[0]]
    default:
      return state
  }
}

function App() {
  const [author, authorDispatch] = useReducer(authorReducer, [])
  const [magazine, magazineDispatch] = useReducer(magazineReducer, [])
  const [book, bookDispatch] = useReducer(bookReducer, [])
  const [search, setSearch] = useState("")

  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      type: "book",
      title: "",
      isbn: "",
      authors: ""
    }
  });
  const onSubmit = (data: any) => {
    const { type, title, isbn, authors } = data
    if (type === "book") {
      bookDispatch({
        type: "ADD", payload:
          [{
            title, isbn, authors, description: ""
          }]
      })
    } else {
      magazineDispatch({
        type: "ADD", payload:
          [{
            title, isbn, authors, publishedAt: ""
          }]
      })
    }
  }

  const searchKeys = ["title", "isbn", "authors"]

  /**
   * Fuzzy finds from needle to every key in `searchKeys`
   * @param needle string
   * @param haystack Array<Book | Magazine>
   * @returns
   */
  function searchBooks(needle: string, haystack: Array<any>){
    return haystack.filter(item => {
      const anyPresent = searchKeys
      // search every key
      .map(key => fuzzysearch(needle.toLowerCase(), item[key].toLowerCase()))
      // boolean or all of them
      .reduce((a: boolean, b: boolean) => a || b)
      return anyPresent
    })
  }

  /**
   * fetch magazines on initial render
   */
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv")
      .then(x => {
        magazineDispatch({type: "FETCH", payload: csvToJson(x)})
      })
  }, [])

  /**
   * fetch books on initial render
   */
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/books.csv")
      .then(x => {
        bookDispatch({type: "FETCH", payload: csvToJson(x)})
      })
  }, [])

  /**
   * fetch author on initial render
   */
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/authors.csv")
      .then(x => {
        authorDispatch({type: "FETCH", payload: csvToJson(x)})
      })
  }, [])

  /**
   * column definitions for datatable
   */
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
        <input type="text" className='search' onChange={e => setSearch(e.target.value)}/>
      </div>
      <div className="inputForm">
        {/* {JSON.stringify(getValues())} */}
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className='formItem'>
            <div>
              <label>Book</label>
              <input {...register("type", { required: true })} type="radio" value="book"/>

              <label>Magazine</label>
              <input {...register("type", { required: true })} type="radio" value="magazine"/>
            </div>
          </div>
          <div className='formItem'>
            <div>
              <label>Title</label>
            </div>
            <input {...register("title", { required: true })} />
            {errors.title && <div className='error'>Title is required</div>}
          </div>

          <div className='formItem'>
            <div>
              <label>ISBN</label>
            </div>
            <input {...register("isbn", { required: true })} />
            {errors.isbn && <div className='error'>ISBN is required</div>}
          </div>

          <div className='formItem'>
            <div>
              <label>Authors</label>
            </div>
            <input {...register("authors", { required: true })} placeholder="Seperate by ,"/>
            {errors.authors && <div className='error'>Author/s is required</div>}
          </div>

          <input type="submit" />
        </form>
      </div>
      <div className='tableContainer'>
        {
          search ?
          <DataTable columns={columns} data={searchBooks(search, (book as Array<any>).concat(magazine as Array<any>))} dense highlightOnHover pointerOnHover />
          :
          <DataTable columns={columns} data={(book as Array<any>).concat(magazine as Array<any>)} dense highlightOnHover pointerOnHover />
        }
      </div>
    </div>
  );
}

export default App;
