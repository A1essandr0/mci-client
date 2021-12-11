import React from 'react';
import Typography from '@material-ui/core/Typography';
import { auth } from '../code/auth';
import { BlueButton } from './ColoredButtons';


export const ToolBar = function(props: any) {
    let userIsAuthenticated = auth.isAuthenticated();

    return (
        <div className="toolBar">
            <div className="navButton">
                {!props.gameInProgress && <BlueButton size="large" variant="contained" color="primary"
                        onClick={() => { props.setGlobalStateParameter('currentView', 'play') }}
                >Game</BlueButton>}
                {props.gameInProgress && <BlueButton size="large" variant="contained" color="primary"
                        onClick={() => { 
                            let result = confirm('Stop the game?');
                            if (result) {
                                props.setGlobalStateParameter('gameInProgress', false);
                                // unaccessible from this component for now
                                // TODO lift userIsPlaying to global state
                                // if (userIsAuthenticated)                                    
                                    // props.setGameStateParameter('userIsPlaying', undefined);                                
                            }
                        }}
                >Stop</BlueButton>}
            </div>

            <div className="navButton">
                <BlueButton size="large" variant="contained" color="primary"
                        onClick={() => { props.setGlobalStateParameter('currentView', 'presets') }}
                        disabled={props.gameInProgress}
                >Presets</BlueButton>
            </div>

            {!userIsAuthenticated && <div className="navButton toolBarRight">
                <BlueButton size="large" variant="contained" color="primary"
                        onClick={() => { props.setGlobalStateParameter('signupActive', !props.signupActive)} }
                >Sign up</BlueButton>
            </div>}
            {!userIsAuthenticated && <div className="navButton">
                <BlueButton size="large" variant="contained" color="primary"
                        onClick={() => { props.setGlobalStateParameter('signinActive', !props.signinActive)} }
                >Sign in</BlueButton>
            </div>}

            {userIsAuthenticated && <div className="toolBarRight navWrittenElement">
                <Typography>{userIsAuthenticated.user.name}</Typography>
            </div>}
            {userIsAuthenticated && <div className="navButton">
                <BlueButton size="large" variant="contained" color="primary"
                        onClick={() => {auth.signOut( () => {
                            props.setGlobalStateParameter('currentView', 'play');
                        })}}
                >Log out</BlueButton>
            </div>}

            {userIsAuthenticated && !props.gameInProgress &&
            <div className="navButton">
                <BlueButton size="large" variant="contained" disabled={false} color="primary"
                        onClick={() => { props.setGlobalStateParameter('currentView', 'users') }}
                >Users</BlueButton>
            </div>}
        </div>
    )
}