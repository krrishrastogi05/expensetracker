// import React, {useContext} from 'react';
// import { GlobalContext } from '../context/GlobalState';

// //Money formatter function
// function moneyFormatter(num) {
//   let p = num.toFixed(2).split('.');
//   return (
//     '$ ' +
//     p[0]
//       .split('')
//       .reverse()
//       .reduce(function (acc, num, i, orig) {
//         return num === '-' ? acc : num + (i && !(i % 3) ? ',' : '') + acc;
//       }, '') +
//     '.' +
//     p[1]
//   );
// }

// export const Transaction = ({ transaction }) => {
//   const { deleteTransaction } = useContext(GlobalContext);

//   const sign = transaction.amount < 0 ? '-' : '+';

//   return (
//     <li className={transaction.amount < 0 ? 'minus' : 'plus'}>
//       {transaction.text} <span>{sign}{moneyFormatter(transaction.amount)}</span><button onClick={() => deleteTransaction(transaction.id)} className="delete-btn">x</button>
//     </li>
//   )
// }




// change made on 30/12/24 to add transaction dates also

import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

export const Transaction = ({ transaction }) => {
  const { deleteTransaction } = useContext(GlobalContext);
  const sign = transaction.amount < 0 ? '-' : '+';
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <li className={transaction.amount < 0 ? 'minus' : 'plus'}>
      <div className="transaction-details">
        <span className="transaction-text">{transaction.text}</span>
        <div className="transaction-date">
          {transaction.date && formatDate(transaction.date)}
        </div>
      </div>
      <div>
        <span>{sign}₹{Math.abs(transaction.amount)}</span>
        <button 
          onClick={() => deleteTransaction(transaction.id)} 
          className="delete-btn"
        >
          x
        </button>
      </div>
    </li>
  );
};