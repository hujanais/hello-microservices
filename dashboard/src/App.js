import React, { useState } from "react";
import "./App.css";
import Login from "./components/Login/Login";
import Result from "./components/Result/Result";

function createData(family, model, soc, memory, hasEthernet, hasWifi, gpio, released, discontinued) {
  return { family, model, soc, memory, hasEthernet, hasWifi, gpio, released, discontinued };
}

function App() {
  const [products, setProductList] = useState([]);

  const handleLoginResult = async (resp) => {
    setProductList([]);

    if (resp.isSuccess) {
      const productResp = await fetch("/api/product", { method: "GET", headers: { jwt: resp.jwtToken } });
      if (productResp.status !== 200) {
        // TODO handle error.
        console.log(productResp.status);
      } else {
        const jsonArr = await productResp.json();
        const arr = [];
        for (const obj of jsonArr) {
          arr.push(createData(obj.family, obj.model, obj.soc, obj.memory, obj.hasEthernet, obj.hasWifi, obj.gpio, obj.released, obj.discontinued));
        }

        console.log(arr);
        setProductList(products.concat([...arr]));
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="div-component">
          <Login onLoginResult={handleLoginResult}></Login>
        </div>
        <div className="div-component">
          <Result data={products}></Result>
        </div>
      </header>
    </div>
  );
}

export default App;
