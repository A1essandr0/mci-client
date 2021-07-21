import React from 'react';
import { server_url} from '../code/urls';
import { Card } from '@material-ui/core';
import { AboutTheMemoricci } from './AboutTheMemoricci';


export const Descriptions = function(props) {
    if (!props.gameInProgress) {
        if (props.currentView === "presets")
            return (
                <div className="infoPanelDescriptions">
                    Preset name:  {props.currentViewedPreset.presetName}<br /><br />
                    Preset info: {props.currentViewedPreset.description}<br /><br />
                    Owner: {props.currentViewedPreset.ownerName}
                </div>
            )
        
        else return <AboutTheMemoricci />
    }

    else return (
            <div className="infoPanelDescriptions">
                    {props.cardsOut && props.cardsOut.map((card, reactKey) => {
                        return (
                            <Card key={reactKey} className="gameCell" raised>
                                <img src={`${server_url}${card.filename}`}
                                    onClick={() => { alert(card.info) }} />
                            </ Card>
                        )
                    })}
            </div>
        )
}