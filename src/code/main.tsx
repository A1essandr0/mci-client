import "../css/main.css";
import React from 'react';
import ReactDOM from 'react-dom';
import GeneralLayout from '../components/GeneralLayout';


ReactDOM.render(
    <GeneralLayout path={window.location.pathname} />, 
    document.getElementById('root')
);
