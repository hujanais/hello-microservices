import React from 'react';
import './App.css';
import Login from './components/Login/Login';
import Result from './components/Result/Result';

function App() {

  const handleLoginResult = (isSuccess) => {
    console.log('yay', isSuccess)
  }

  return (
    <div className="App">
      <header className="App-header">
        <Login onLoginResult={handleLoginResult}></Login>
        <Result></Result>
      </header>
    </div>
  );
}

export default App;
