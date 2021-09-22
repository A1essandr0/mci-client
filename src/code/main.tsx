import "../css/main.css";
import React from 'react';
import ReactDOM from 'react-dom';
import GeneralLayout from '../components/GeneralLayout';


let generalLayoutProps = {
    path: window.location.pathname
}

const baseComponent = ReactDOM.render(
    <GeneralLayout {...generalLayoutProps} />, document.getElementById('root')
);
