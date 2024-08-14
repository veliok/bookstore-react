import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddTodo from './AddTodo';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [todos, setTodos] = useState([]);
  
  const columnDefs = [
    { field: 'author', sortable: true, filter: true},
    { field: 'isbn', sortable: true, filter: true},
    { field: 'price', sortable: true, filter: true},
    { field: 'title', sortable: true, filter: true},
    { field: 'year', sortable: true, filter: true},
    { 
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => 
      <IconButton onClick={() => deleteTodo(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton> 
    }
  ]

  useEffect(() => {
    fetchItems();
  }, [])

  const addTodo = (newTodo) => {
    fetch('https://bookstore-c6903-default-rtdb.europe-west1.firebasedatabase.app/data/.json',
    {
      method: 'POST',
      body: JSON.stringify(newTodo)
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  const fetchItems = () => {
    fetch('https://bookstore-c6903-default-rtdb.europe-west1.firebasedatabase.app/data/.json')
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(err => console.error(err))
  }

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
    Object.defineProperty(item, 'id', {value: keys[index]}));
    setTodos(valueKeys);
    console.log(keys)
  }

  const deleteTodo = (id) => {
    fetch(`https://bookstore-c6903-default-rtdb.europe-west1.firebasedatabase.app/data/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }
  
  return (
    <>
    <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
    </AppBar>
    <AddTodo addTodo={addTodo} /> 
      <div className="ag-theme-material" style={{height: 400, width: 1100}}>
         <AgGridReact
            rowData={todos}
            columnDefs={columnDefs}
         />
      </div>
    </>
  );
}

export default App;