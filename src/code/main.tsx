import "../css/main.css";
import React from 'react';
import ReactDOM from 'react-dom';
import GeneralLayout from '../components/GeneralLayout';
import { StaticRouter } from 'react-router';


let generalProps = {
    path: window.location.pathname
}

const baseComponent = ReactDOM.render(
    <GeneralLayout {...generalProps} />, document.getElementById('root')
);
