import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';

const url = 'https://json-storage-api.p.rapidapi.com/datalake';
const headers = {
  'content-type': 'application/json',
  'X-RapidAPI-Key': '68c18bd9e8msh5b5329b16d84ea3p1de8e7jsne487536a97c1',
  'X-RapidAPI-Host': 'json-storage-api.p.rapidapi.com'
};

// Static account number
const accountId = 'USERID-4711';

const Dashboard = () => {
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const storeTransaction = async (transaction) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          '@context': [
            'http://schema4i.org/Thing.jsonld',
            'http://schema4i.org/Action.jsonld',
            'http://schema4i.org/CreateAction.jsonld'
          ],
          '@type': 'CreateAction',
          Result: {
            '@context': [
              'http://schema4i.org/DataLakeItem.jsonld',
              'http://schema4i.org/UserAccount.jsonld',
              'http://schema4i.org/OfferForPurchase.jsonld',
              'http://schema4i.org/Offer.jsonld',
              'http://schema4i.org/Organization.jsonld',
              'http://schema4i.org/PostalAddress.jsonld'
            ],
            '@type': 'DataLakeItem',
            Name: 'Transaction',
            Creator: {
              '@type': 'UserAccount',
              Identifier: accountId // Use static account number
            },
            About: {
              '@type': 'Organization'
            },
            Amount: transaction.amount,
            Balance: transaction.balance,
            Type: transaction.type,
            SerialNumber: transaction.serial, // Add serial number to the transaction
            Timestamp: new Date().toISOString() // Store the time of the transaction
          }
        })
      });

      const data = await response.json();
      console.log(data);
      // After each transaction, load the latest transactions to update the balance
      loadTransactions();
    } catch (error) {
      console.error('Error storing transaction:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          '@context': [
            'http://schema4i.org/Thing.jsonld',
            'http://schema4i.org/Action.jsonld',
            'http://schema4i.org/SearchAction.jsonld'
          ],
          '@type': 'SearchAction',
          Object: {
            '@context': [
              'http://schema4i.org/Thing.jsonld',
              'http://schema4i.org/Filter',
              'http://schema4i.org/DataLakeItem',
              'http://schema4i.org/UserAccount'
            ],
            '@type': 'Filter',
            FilterItem: {
              '@type': 'DataLakeItem',
              Creator: {
                '@type': 'UserAccount',
                Identifier: accountId // Use static account number
              }
            }
          }
        })
      });

      const data = await response.json();
      const result = data.Result.ItemListElement.map(item => item.Item);
      // Filter out transactions that are not deposits or withdrawals
      const filteredTransactions = result.filter(transaction => transaction.Type === 'Deposit' || transaction.Type === 'Withdraw');
      // Sort transactions by timestamp in descending order
      filteredTransactions.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
      setTransactions(filteredTransactions);
      if (filteredTransactions.length > 0) {
        // Update balance to the latest transaction's balance
        const latestBalance = filteredTransactions[0].Balance;
        setBalance(latestBalance);
        if (latestBalance < 0) {
          setErrorMessage('Insufficient balance for withdrawal');
        } else {
          setErrorMessage('');
        }
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const clearTransactions = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          '@context': [
            'http://schema4i.org/Thing.jsonld',
            'http://schema4i.org/Action.jsonld',
            'http://schema4i.org/DeleteAction.jsonld'
          ],
          '@type': 'DeleteAction',
          Object: {
            '@context': [
              'http://schema4i.org/Thing.jsonld',
              'http://schema4i.org/Filter',
              'http://schema4i.org/DataLakeItem',
              'http://schema4i.org/UserAccount'
            ],
            '@type': 'Filter',
            FilterItem: {
              '@type': 'DataLakeItem',
              Creator: {
                '@type': 'UserAccount',
                Identifier: accountId // Use static account number
              }
            }
          }
        })
      });

      const data = await response.json();
      console.log(data);
      setTransactions([]);
      setBalance(0);
      setErrorMessage('');
    } catch (error) {
      console.error('Error clearing transactions:', error);
    }
  };

  const handleDeposit = async () => {
    const newBalance = balance + parseFloat(amount);
    await storeTransaction({ amount: parseFloat(amount), balance: newBalance, type: 'Deposit', serial: transactions.length + 1 });
    setBalance(newBalance); // Update balance state
    setAmount(0); // Reset input field
    loadTransactions(); // Reload transactions to update balance
  };

  const handleWithdraw = async () => {
    if (amount > balance) {
      setErrorMessage('Insufficient balance for withdrawal');
      return;
    }
    const newBalance = balance - parseFloat(amount);
    await storeTransaction({ amount: parseFloat(amount), balance: newBalance, type: 'Withdraw', serial: transactions.length + 1 });
    setBalance(newBalance); // Update balance state
    setAmount(0); // Reset input field
    loadTransactions(); // Reload transactions to update balance
  };

  return (
    <div className="container">
      <h1>Transaction App</h1>
      <div>
        <input className='my-2'
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br/>
        <button onClick={handleDeposit} className='themebutton'>Deposit</button>
        <button onClick={handleWithdraw} className='themebutton mx-1'>Withdraw</button>
      </div>
      <div>
        <h2>Current Balance: ${balance}</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div> 
      <div>
        <button onClick={loadTransactions} className='themebutton'>Load Transactions</button>
        <button onClick={clearTransactions} className='themebutton mx-1'>Clear Transactions</button>
        <h2>Transactions:</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Transaction Type</th>
              <th>Amount</th>
              <th>Balance Change</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.Type}</td>
                <td>${transaction.Amount}</td>
                <td>${transaction.Balance - transaction.Amount}</td>
                <td>{new Date(transaction.Timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
