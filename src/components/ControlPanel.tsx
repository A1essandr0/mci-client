import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import { auth } from '../code/auth';
import { sleep, arrayRange } from '../code/lib';
import { MakePreset } from './MakePreset';
import { EditPreset } from './EditPreset'; 
import { DeletePreset } from './DeletePreset';
import { BlueButton, RedButton, GreenButton } from './ColoredButtons';


export const ControlPanel = function(props) {
    const userIsAuthenticated = auth.isAuthenticated();

    const userOwnsPreset = userIsAuthenticated && props.currentPlayedPreset.owner === userIsAuthenticated.user.id;

    const modifyGameSettingsRestricted = (props.currentPlayedPreset.viewableByAll === 0 && 
            (!userIsAuthenticated || props.currentPlayedPreset.viewableByUsers === 0 && !userOwnsPreset)) ||
        (props.currentPlayedPreset.viewableByUsers === 0 && !userIsAuthenticated);

    if (props.currentView === "play")
        return (
            <div className="controlPanel">
                <FormControl disabled={props.gameInProgress || props.showIsOn} fullWidth>
                    <InputLabel id="select-preset-label">Preset for game</InputLabel>
                    <Select
                        labelId="select-preset-label"
                        id="select-preset"
                        value={props.currentPlayedPreset.presetName || ""}
                        onChange={(event) => { 
                            props.setPlayedPreset(event.target.value)
                        }}
                    >
                        {Object.keys(props.playablePresets).map(
                            (item, reactKey) => <MenuItem key={reactKey} value={item}>{item}</MenuItem>
                        )}
                    </Select>
                </FormControl>                    

                <ListItem>
                    <FormControl disabled={props.gameInProgress || props.showIsOn || modifyGameSettingsRestricted} fullWidth>
                        <InputLabel id="select-start-delay-label">Starting delay</InputLabel>
                        <Select
                            labelId="select-start-delay-label"
                            id="select-start-delay"
                            value={props.gameStartingDelay}
                            onChange={(event) => {
                                props.setGlobalStateParameter('gameStartingDelay', event.target.value)
                            }}
                        >
                            {arrayRange(14, 2).map(
                                (t, reactKey) => <MenuItem key={reactKey} value={t}>{t} sec</MenuItem>
                            )}
                        </Select>
                    </FormControl>                     
                </ListItem>

                <ListItem>
                    <FormControl disabled={props.gameInProgress  || props.showIsOn || modifyGameSettingsRestricted} fullWidth>
                        <InputLabel id="select-onshow-delay-label">Delay on show</InputLabel>
                        <Select
                            labelId="select-onshow-delay-label"
                            id="select-onshow-delay"
                            value={props.gameDelayOnShow}
                            onChange={(event) => {
                                props.setGlobalStateParameter('gameDelayOnShow', event.target.value)
                            }}
                        >
                            {[200,400,600,800,1000,1500,2000].map(
                                (t, reactKey) => <MenuItem key={reactKey} value={t}>{t} ms</MenuItem>
                            )}
                        </Select>
                    </FormControl>                     
                </ListItem>

                <ListItem>
                    <FormControl disabled={props.gameInProgress  || props.showIsOn || modifyGameSettingsRestricted} fullWidth>
                        <InputLabel id="select-starting-score-label">Starting score</InputLabel>
                        <Select
                            labelId="select-starting-score-label"
                            id="select-starting-score"
                            value={props.gameStartingScore}
                            onChange={(event) => {
                                props.setGlobalStateParameter('gameStartingScore', event.target.value)
                            }}
                        >
                            {arrayRange(9, 3).map(
                                (t, reactKey) => <MenuItem key={reactKey} value={t}>{t}</MenuItem>
                            )}
                        </Select>
                    </FormControl>                     
                </ListItem>                    

                {<div className="startButton">
                    <BlueButton variant="contained" size="large" disabled={props.gameInProgress}
                        onClick={() => {
                            props.setGlobalStateParameter('showIsOn', !props.showIsOn);
                        }}
                    >{props.showIsOn ? "Hide" : "Show"}</BlueButton>
                </div>}
                                
                {!props.gameInProgress && <div className="startButton">
                    <GreenButton variant="contained" size="large" disabled={props.showIsOn}
                                onClick={() => {
                                    let result = confirm('Start the game?');
                                    if (result) {
                                        props.setGlobalStateParameter('gameInProgress', true);
                                        if (userIsAuthenticated) 
                                            props.setGameStateParameter('userIsPlaying', userIsAuthenticated.user);

                                        // opening all the cards to show them on start, then closing them
                                        props.setGameStateParameter('gameJustStarted', true);
                                        sleep(props.gameStartingDelay*1000).then(
                                            () => props.setGameStateParameter('gameJustStarted', false)                                
                                        )
                                    }
                                }} 
                    >Start</GreenButton>
                </div>}

                {props.gameInProgress && <div className="startButton">
                    <RedButton size="large" onClick={ () => {
                            let result = confirm('Stop the game?');
                            if (result) {
                                props.setGlobalStateParameter('gameInProgress', false)
                                if (userIsAuthenticated) 
                                    props.setGameStateParameter('userIsPlaying', undefined);
                            }
                        }} 
                        variant="contained" color="secondary"
                    >Stop</RedButton>
                </div>}

            </div>
        )


    else if (props.currentView === "presets") {
        let propsToMakePreset = {
            makePresetActive: props.makePresetActive,
            setGlobalStateParameter: props.setGlobalStateParameter,
        };
        let propsToEditPreset = {
            presetId: props.currentViewedPreset.presetId,
            presetName: props.currentViewedPreset.presetName,
            playableByAll: Boolean(props.currentViewedPreset.playableByAll),
            viewableByAll: Boolean(props.currentViewedPreset.viewableByAll),
            viewableByUsers: Boolean(props.currentViewedPreset.viewableByUsers),

            editPresetActive: props.editPresetActive,
            setGlobalStateParameter: props.setGlobalStateParameter,
        };
        let propsToDeletePreset = {
            presetId: props.currentViewedPreset.presetId,

            deletePresetActive: props.deletePresetActive,
            setGlobalStateParameter: props.setGlobalStateParameter,
        };

        return (
            <div className="controlPanel">
                <FormControl disabled={props.gameInProgress} fullWidth>
                    <InputLabel id="select-viewing-preset-label">Preset to view</InputLabel>
                    <Select
                        labelId="select-viewing-preset-label"
                        id="select-viewing-preset"
                        value={props.currentViewedPreset.presetName || ""}
                        onChange={(event) => { 
                            props.setViewedPreset(event.target.value)
                        }}
                    >
                        {Object.keys(props.viewablePresets).map(
                            (item, reactKey) => <MenuItem key={reactKey} value={item}>{item}</MenuItem>
                        )}
                    </Select>
                </FormControl>

                {userIsAuthenticated && <div className="startButton">
                    <GreenButton variant="contained" disabled={props.gameInProgress}
                            onClick={ () => { props.setGlobalStateParameter('makePresetActive', true) }}
                    >New preset</GreenButton>
                    </div>}

                {userIsAuthenticated && <div className="startButton">
                    <BlueButton variant="contained" disabled={props.gameInProgress}
                            onClick={()=>{ props.setGlobalStateParameter('editPresetActive', true) }}
                    >Modify</BlueButton>
                </div>}
                {userIsAuthenticated && <div className="startButton">
                    <RedButton variant="contained" disabled={props.gameInProgress}
                            onClick={()=>{ props.setGlobalStateParameter('deletePresetActive', true) }}
                    >Delete</RedButton>
                </div>}

                {!userIsAuthenticated && <div className="startButton">
                    <Typography>Sign in to create new presets</Typography>
                </div>}

                <MakePreset {...propsToMakePreset} />
                <EditPreset {...propsToEditPreset} />
                <DeletePreset {...propsToDeletePreset} />
            </div>
        )
    }

    else if (props.currentView === "users")
        return <div className="controlPanel">Manage user accounts</div>
}