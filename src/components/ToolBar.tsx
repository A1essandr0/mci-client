import React from 'react';
import { Typography } from '@material-ui/core';
import { auth } from '../code/auth';
import { TealButton } from './ColoredButtons';


export const ToolBar = function(props) {
    let userIsAuthenticated = auth.isAuthenticated();

    return (
        <div className="toolBar">
            <div className="navButton">
                {!props.gameInProgress && <TealButton variant="contained" color="primary"
                        onClick={() => { props.setView('play') }}
                >Play</TealButton>}
                {props.gameInProgress && <TealButton variant="contained" color="primary"
                        onClick={() => { 
                            let result = confirm('Stop the game?');
                            if (result) props.setGlobalStateParameter('gameInProgress', false);                            
                        }}
                >Stop</TealButton>}
            </div>

            <div className="navButton">
                <TealButton variant="contained" color="primary"
                        onClick={() => { props.setView('presets') }}
                        disabled={props.gameInProgress}
                >Presets</TealButton>
            </div>

            {!userIsAuthenticated && <div className="navButton toolBarRight">
                <TealButton variant="contained" color="primary"
                        onClick={() => { props.toggleSignup(!props.signupActive)} }
                >Sign up</TealButton>
            </div>}
            {!userIsAuthenticated && <div className="navButton">
                <TealButton variant="contained" color="primary"
                        onClick={() => { props.toggleSignin(!props.signinActive)} }
                >Sign in</TealButton>
            </div>}

            {userIsAuthenticated && <div className="toolBarRight navWrittenElement">
                <Typography>{userIsAuthenticated.user.name}</Typography>
            </div>}
            {userIsAuthenticated && <div className="navButton">
                <TealButton variant="contained" color="primary"
                        onClick={() => {auth.signOut( () => {
                            props.setView('play')
                        })}}
                >Log out</TealButton>
            </div>}

            {userIsAuthenticated && !props.gameInProgress &&
            <div className="navButton">
                <TealButton variant="contained" disabled={false} color="primary"
                        onClick={() => { props.setView('users') }}
                >Users</TealButton>
            </div>}
        </div>
    )
}