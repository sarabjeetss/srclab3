import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Logo from './logo.jpg';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [amount, setAmount] = useState(0);
  const [userData, setUserData] = useState({
    email: '',
    name: '',
    balance: 0,
    transactions: []
  });
  const [errorMessage, setErrorMessage] = useState('');

  const url = 'https://json-storage-api.p.rapidapi.com/datalake';
  const headers = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': '68c18bd9e8msh5b5329b16d84ea3p1de8e7jsne487536a97c1',
    'X-RapidAPI-Host': 'json-storage-api.p.rapidapi.com'
  };

  const storeTransaction = async (transaction) => {
    try {
      const response = await fetch(`${url}/${userData.email}`, {
        method: 'PATCH', // Use PATCH to update specific fields
        headers,
        body: JSON.stringify({
          Transactions: [...userData.transactions, transaction],
          Balance: transaction.balance
        })
      });
      if (!response.ok) {
        throw new Error('Failed to store transaction');
      }
    } catch (error) {
      console.error('Error storing transaction:', error);
      setErrorMessage('An error occurred while storing the transaction. Please try again.');
    }
  };

  const handleDeposit = async () => {
    const newBalance = userData.balance + parseFloat(amount);
    const newTransaction = {
      amount: parseFloat(amount),
      balance: newBalance,
      type: 'Deposit',
      serial: userData.transactions.length + 1
    };
    await storeTransaction(newTransaction);
    setUserData({
      ...userData,
      balance: newBalance,
      transactions: [...userData.transactions, newTransaction]
    });
    setAmount(0);
  };

  const handleWithdraw = async () => {
    if (amount > userData.balance) {
      setErrorMessage('Insufficient balance for withdrawal');
      return;
    }
    const newBalance = userData.balance - parseFloat(amount);
    const newTransaction = {
      amount: parseFloat(amount),
      balance: newBalance,
      type: 'Withdraw',
      serial: userData.transactions.length + 1
    };
    await storeTransaction(newTransaction);
    setUserData({
      ...userData,
      balance: newBalance,
      transactions: [...userData.transactions, newTransaction]
    });
    setAmount(0);
  };

  return (
    <BrowserRouter>
      <div id="root">
        <nav className="myNav navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <h3 className="logoname">
                <img src={Logo} className="logo-ctl" alt="SBI Logo" /> State Bank Of India
              </h3>
            </Link>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">
                  Signup
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contactus">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  setErrorMessage={setErrorMessage}
                  setUserData={setUserData}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <Signup
                  setIsAuthenticated={setIsAuthenticated}
                  setErrorMessage={setErrorMessage}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Dashboard
                    userData={userData}
                    handleDeposit={handleDeposit}
                    handleWithdraw={handleWithdraw}
                    amount={amount}
                    setAmount={setAmount}
                    errorMessage={errorMessage}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/contactus" element={<ContactUs />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
