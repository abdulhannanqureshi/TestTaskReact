import React from 'react';
import Routing from "./routes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className='App'>
      <Routing />
      <ToastContainer/>
    </div>
  );
}

export default App;
