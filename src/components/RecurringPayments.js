import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';

const CategoryTransactions = ({ category, transactions, onClose }) => {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="category-modal">
      <div className="category-modal-content">
        <div className="category-modal-header">
          <h3>{category} Transactions</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="category-transactions">
          {transactions.length === 0 ? (
            <div className="no-transactions">No transactions in this category</div>
          ) : (
            transactions.map(transaction => (
              <div key={transaction.id} className="category-transaction-item">
                <span>{transaction.text}</span>
                <span className="amount">₹{Math.abs(transaction.amount)}</span>
              </div>
            ))
          )}
          <div className="category-total">
            <strong>Total:</strong> <span>₹{Math.abs(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RecurringPayments = () => {
  const { transactions, addTransaction } = useContext(GlobalContext);
  const [quickExpenses, setQuickExpenses] = useState([]);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const savedExpenses = localStorage.getItem('quickExpenses');
    if (savedExpenses) {
      setQuickExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quickExpenses', JSON.stringify(quickExpenses));
  }, [quickExpenses]);

  const handleQuickAdd = (text, amount) => {
    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text,
      amount: -Math.abs(amount)
    };
    addTransaction(newTransaction);
  };

  const handleAddNewExpense = (e) => {
    e.preventDefault();
    if (newExpenseName && newExpenseAmount) {
      const newQuickExpense = {
        text: newExpenseName,
        amount: parseFloat(newExpenseAmount)
      };
      setQuickExpenses([...quickExpenses, newQuickExpense]);
      setNewExpenseName('');
      setNewExpenseAmount('');
      setIsAdding(false);
    }
  };

  const handleDeleteQuickExpense = (expenseText) => {
    setQuickExpenses(quickExpenses.filter(expense => expense.text !== expenseText));
  };

  const showCategoryTransactions = (category) => {
    setSelectedCategory(category);
  };

  const getCategoryTransactions = (category) => {
    return transactions.filter(t => t.text === category);
  };

  return (
    <div className="recurring-payments">
      <div className="recurring-header">
        <h3>Quick Add Expenses</h3>
        <button 
          className="btn"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? 'Cancel' : '+ New Quick Expense'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddNewExpense} className="add-quick-expense-form">
          <div className="form-control">
            <input
              type="text"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              placeholder="Expense name"
              required
            />
          </div>
          <div className="form-control">
            <input
              type="number"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              placeholder="Amount"
              required
              min="0"
              step="0.01"
            />
          </div>
          <button type="submit" className="btn">Add Quick Expense</button>
        </form>
      )}

      <div className="quick-expense-buttons">
        {quickExpenses.map(({ text, amount }) => {
          const categoryTransactions = getCategoryTransactions(text);
          const totalSpent = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          return (
            <div key={text} className="quick-expense-item">
              <div className="quick-expense-content">
                <button
                  className="btn"
                  onClick={() => handleQuickAdd(text, amount)}
                >
                  {text} (-₹{amount})
                </button>
                <button 
                  className="btn"
                  onClick={() => showCategoryTransactions(text)}
                >
                  History (₹{totalSpent})
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteQuickExpense(text)}
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCategory && (
        <CategoryTransactions 
          category={selectedCategory}
          transactions={getCategoryTransactions(selectedCategory)}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
};