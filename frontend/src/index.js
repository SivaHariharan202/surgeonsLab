import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./appRedux/store";
import { BrowserRouter } from "react-router-dom";
import { Spin } from "antd";
import "antd/dist/reset.css";
import reportWebVitals from "./reportWebVitals";

// import { APICONFIG } from "./config/ApiConfig";





const RootLoader = () => {
 

  return (
    <div>
        <Provider store={store}>
            <App />
        </Provider>
      
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RootLoader />);

reportWebVitals();
