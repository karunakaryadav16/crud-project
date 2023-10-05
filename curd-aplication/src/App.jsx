/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

//http://localhost:5173/

*/







// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    // Fetch all items (Read operation)
    fetch('http://localhost:3033/items')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error(error));
  }, []);

  const handleCreateItem = () => {
    // Create a new item (Create operation)
    fetch('http://localhost:3033/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: itemName }),
    })
      .then((response) => response.json())
      .then((data) => {
        setItems([...items, data]);
        setItemName('');
      })
      .catch((error) => console.error(error));
  };

  const handleEditItem = (id) => {
    // When "Edit" button is clicked, store the selected item's ID
    setSelectedItemId(id);

    // Find the selected item by ID and populate the input field with its name
    const selectedItem = items.find((item) => item.id === id);
    if (selectedItem) {
      setItemName(selectedItem.name);
    }
  };

  const handleUpdateItem = () => {
    // Update an existing item (Update operation)
    fetch(`http://localhost:3033/items/${selectedItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: itemName }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedItems = items.map((item) =>
          item.id === selectedItemId ? data : item
        );
        setItems(updatedItems);
        setSelectedItemId(null);
        setItemName('');
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteItem = (id) => {
    // Delete an item (Delete operation)
    fetch(`http://localhost:3033/items/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="App">
      <h1>CRUD Example</h1>
      <div>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        {selectedItemId ? (
          <div>
            <button  className="edit" onClick={handleUpdateItem}>Update</button>
            <button className="cancel" onClick={() => setSelectedItemId(null)}>Cancel</button>
          </div>
        ) : (
          <button className="create" onClick={handleCreateItem}>Create</button>
        )}
      </div>
      <ul>
  {items.map((item) => (
    <li key={item.id} className="list-item">
      <div className="item-text">{item.name}</div>
      <div className="item-buttons">
        <button className="edit" onClick={() => handleEditItem(item.id)}>Edit</button>
        <button className="delete" onClick={() => handleDeleteItem(item.id)}>Delete</button>
      </div>
    </li>
  ))}
</ul>
    </div>
  );
}

export default App;


































































































