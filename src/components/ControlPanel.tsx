import React from 'react';
import { 
    ListItem, FormControl, InputLabel, Select, MenuItem, Typography
} from '@material-ui/core';
import { auth } from '../code/auth';
import { sleep, arrayRange } from '../code/lib';
import { CreateNewPreset } from './CreateNewPreset';
import { UploadPreset } from './UploadPreset';
import { EditPreset } from './EditPreset'; 
import { DeletePreset } from './DeletePreset';
import { BlueButton, RedButton } from './ColoredButtons';


export const ControlPanel = function(props) {
    // console.log('control panel props', props);
    const userIsAuthenticated = auth.isAuthenticated();

    const userOwnsPreset = userIsAuthenticated && props.currentPlayedPreset.owner === userIsAuthenticated.user.id;

    const modifyGameSettingsRestricted = (props.currentPlayedPreset.viewableByAll === 0 && 
            (!userIsAuthenticated || props.currentPlayedPreset.viewableByUsers === 0 && !userOwnsPreset)) ||
        (props.currentPlayedPreset.viewableByUsers === 0 && !userIsAuthenticated);

    if (props.currentView === "play")
        return (
            <div className="controlPanel">
                <FormControl disabled={props.gameInProgress} fullWidth>
                    <InputLabel id="select-preset-label">Preset for game</InputLabel>
                    <Select
                        labelId="select-preset-label"
                        id="select-preset"
                        value={props.currentPlayedPreset.presetName || ""}
                        onChange={(event) => { 
                            props.setPlayedPreset(event.target.value)
                        }}
                    >
                        {props.playablePresets.map(
                            (item, reactKey) => <MenuItem key={reactKey} value={item.presetName}>{item.presetName}</MenuItem>
                        )}
                    </Select>
                </FormControl>                    

                <ListItem>
                    <FormControl disabled={props.gameInProgress || modifyGameSettingsRestricted} fullWidth>
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
                    <FormControl disabled={props.gameInProgress || modifyGameSettingsRestricted} fullWidth>
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
                    <FormControl disabled={props.gameInProgress || modifyGameSettingsRestricted} fullWidth>
                        <InputLabel id="select-starting-score-label">Starting score</InputLabel>
                        <Select
                            labelId="select-starting-score-label"
                            id="select-starting-score"
                            value={props.gameStartingScore}
                            onChange={(event) => {
                                props.setGlobalStateParameter('gameStartingScore', event.target.value)
                            }}
                        >
                            {arrayRange(8, 3).map(
                                (t, reactKey) => <MenuItem key={reactKey} value={t}>{t}</MenuItem>
                            )}
                        </Select>
                    </FormControl>                     
                </ListItem>                    
                
                {!props.gameInProgress && <div className="startButton">
                    <BlueButton variant="contained" color="secondary" 
                                onClick={() => {
                                    let result = confirm('Start the game?');
                                    if (result) {
                                        props.setGlobalStateParameter('gameInProgress', true);

                                        // opening all the cards to show them on start, then closing them
                                        props.setGameStateParameter('gameJustStarted', true);
                                        sleep(props.gameStartingDelay*1000).then(
                                            () => props.setGameStateParameter('gameJustStarted', false)                                
                                        )
                                    }
                                }} 
                    >Start</BlueButton>
                </div>}

                {props.gameInProgress && <div className="startButton">
                    <BlueButton onClick={()=>{
                        let result = confirm('Stop the game?');
                        if (result) props.setGlobalStateParameter('gameInProgress', false)                        
                    }} 
                        variant="contained" color="secondary">Stop</BlueButton>
                </div>}

            </div>
        )


    else if (props.currentView === "presets") {
        let propsToCreatePreset = {
            toggleCreatePreset: props.toggleCreatePreset,
            createPresetActive: props.createPresetActive
        };
        let propsToUploadPreset = {
            toggleUploadPreset: props.toggleUploadPreset,
            uploadPresetActive: props.uploadPresetActive
        };
        let propsToEditPreset = {
            toggleEditPreset: props.toggleEditPreset,
            editPresetActive: props.editPresetActive,

            presetId: props.currentViewedPreset.presetId,
            presetName: props.currentViewedPreset.presetName,
            playableByAll: Boolean(props.currentViewedPreset.playableByAll),
            viewableByAll: Boolean(props.currentViewedPreset.viewableByAll),
            viewableByUsers: Boolean(props.currentViewedPreset.viewableByUsers)
        };
        let propsToDeletePreset = {
            presetId: props.currentViewedPreset.presetId,

            toggleDeletePreset: props.toggleDeletePreset,
            deletePresetActive: props.deletePresetActive            
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
                        {props.viewablePresets.map(
                            (item, reactKey) => <MenuItem key={reactKey} value={item.presetName}>{item.presetName}</MenuItem>
                        )}
                    </Select>
                </FormControl>

                {userIsAuthenticated && <div className="startButton">
                    <BlueButton variant="contained" disabled={props.gameInProgress}
                            onClick={ () => { props.toggleUploadPreset(true) }}
                    >Upload</BlueButton>
                    </div>}
                {userIsAuthenticated && <div className="startButton">
                    <BlueButton variant="contained" disabled={props.gameInProgress}
                            onClick={ () => { props.toggleCreatePreset(true) }}
                    >Create</BlueButton>
                    </div>}
                {userIsAuthenticated && <div className="startButton">
                    <RedButton variant="contained" disabled={props.gameInProgress}
                            onClick={()=>{ props.toggleEditPreset(true) }}
                    >Modify</RedButton>
                </div>}
                {userIsAuthenticated && <div className="startButton">
                    <RedButton variant="contained" disabled={props.gameInProgress}
                            onClick={()=>{ props.toggleDeletePreset(true) }}
                    >Delete</RedButton>
                </div>}

                {!userIsAuthenticated && <div className="startButton">
                    <Typography>Sign in to upload or create new presets</Typography>
                </div>}

                <CreateNewPreset {...propsToCreatePreset} />
                <UploadPreset {...propsToUploadPreset} />
                <EditPreset {...propsToEditPreset} />
                <DeletePreset {...propsToDeletePreset} />
            </div>
        )
    }

    else if (props.currentView === "users")
        return <div className="controlPanel">Manage user accounts</div>
}