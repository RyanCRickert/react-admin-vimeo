import React from "react";
import ReactDOM from "react-dom";
import AppRouter, { history } from "./routers/AppRouter";
import "normalize.css/normalize.css";
import "./styles/styles.scss";

let hasRendered = false;
const renderApp = () => {
	if (!hasRendered) {
		ReactDOM.render(<AppRouter history={history} />, document.getElementById("app"));
		hasRendered = true;
	}
};

renderApp();