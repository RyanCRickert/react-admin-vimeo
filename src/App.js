import React from "react";
import ReactDOM from "react-dom";
import AppRouter, { history } from "./routers/AppRouter";
import "normalize.css/normalize.css";
import "./styles/styles.scss";

ReactDOM.render(<AppRouter history={history} />, document.getElementById("app"));

//Push