import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connectWallet, disconnectWallet } from '../utils/connectWallet';

const Navbar = () => {
  const navigate = useNavigate();
  const [userAddress, setUserAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  // Handle wallet connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const savedAddress = localStorage.getItem('walletAddress');
      if (savedAddress) {
        setUserAddress(savedAddress);
        setIsConnected(true);
      } else if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          setIsConnected(true);
        }
      }
    };
    checkConnection();
  }, []);

  // Connect wallet
  const handleConnect = async () => {
    try {
      const address = await connectWallet();
      setUserAddress(address);
      setIsConnected(true);
      localStorage.setItem('walletAddress', address); // Save wallet address
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  // Disconnect wallet
  const handleDisconnect = () => {
    disconnectWallet();
    setUserAddress(null);
    setIsConnected(false);
    localStorage.removeItem('walletAddress'); // Remove wallet address from localStorage
  };

  // Handle logout for token-based session
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <h1>File Management System</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/upload">Upload</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
            <li>
              {isConnected ? (
                <div>
                  <span>Wallet: {userAddress}</span>
                  <button onClick={handleDisconnect}>Disconnect</button>
                </div>
              ) : (
                <button onClick={handleConnect}>Connect Wallet</button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
