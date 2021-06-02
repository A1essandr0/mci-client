import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { teal } from '@material-ui/core/colors';
import { auth } from '../code/auth';


const TealButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(teal[500]),
      backgroundColor: teal[500],
      '&:hover': {
        backgroundColor: teal[700],
      },
    },
  }))(Button);


export const ToolBar = function(props) {
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


            {!auth.isAuthenticated() && <div className="navButton toolBarRight">
                <TealButton variant="contained" color="primary"
                        onClick={() => { props.toggleSignup(!props.signupActive)} }
                >Sign up</TealButton>
            </div>}
            {!auth.isAuthenticated() && <div className="navButton">
                <TealButton variant="contained" color="primary"
                        onClick={() => { props.toggleSignin(!props.signinActive)} }
                >Sign in</TealButton>
            </div>}

            {auth.isAuthenticated() && <div className="toolBarRight navWrittenElement">
                <Typography>{auth.isAuthenticated().user.name}</Typography>
            </div>}
            {auth.isAuthenticated() && <div className="navButton">
                <TealButton variant="contained" color="primary"
                        onClick={() => {auth.signOut( () => {
                            props.setView('play')
                        })}}
                >Log out</TealButton>
            </div>}


            {auth.isAuthenticated() && !props.gameInProgress &&
            <div className="navButton">
                <TealButton variant="contained" disabled={false} color="primary"
                        onClick={() => { props.setView('users') }}
                >Users</TealButton>
            </div>}

        </div>
    )
}