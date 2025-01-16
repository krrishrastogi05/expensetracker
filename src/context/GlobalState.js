import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';

// Initial state
const initialState = {
  transactions: []
}

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  function deleteTransaction(id) {
    dispatch({
      type: 'DELETE_TRANSACTION',
      payload: id
    });
  }
  

  // modified on 30/12/2024 to add date and time functionality
  // function addTransaction(transaction) {
  //   dispatch({
  //     type: 'ADD_TRANSACTION',
  //     payload: transaction
  //   });
  // }
  // In GlobalState.js
function addTransaction(transaction) {
  dispatch({
    type: 'ADD_TRANSACTION',
    payload: {
      ...transaction,
      date: new Date().toISOString() // Add current date/time
    }
  });
}
  return (<GlobalContext.Provider value={{
    transactions: state.transactions,
    deleteTransaction,
    addTransaction
  }}>
    {children}
  </GlobalContext.Provider>);
}

















