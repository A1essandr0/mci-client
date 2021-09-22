import React from 'react';
import { server_url} from '../code/urls';
import { Card, Link, Button } from '@material-ui/core';

import { AboutTheMemoricci } from './AboutTheMemoricci';
import { config } from '../code/config';


export const Descriptions = function(props) {
    if (!props.gameInProgress) {
        if (props.currentView === "presets") {
            const presetUrl = `${config.application_url}/preset=${props.currentViewedPreset.presetId}`;
            return (
                <div className="infoPanelLinks">
                    <div className="infoPanelLinksElement">Preset name: {props.currentViewedPreset.presetName}</div>
                    <div className="infoPanelLinksElement">
                        <Link href={presetUrl}>{presetUrl}</Link>&nbsp;&nbsp;&nbsp;
                        <Button variant="outlined" color="primary" size="small"
                                onClick={() => {
                                    navigator.clipboard.writeText(presetUrl)
                                }}
                        >Copy link</Button>&nbsp;&nbsp;&nbsp;<span></span>
                    </div>
                    <div className="infoPanelLinksElement">Preset info: {props.currentViewedPreset.description}</div>
                    <div className="infoPanelLinksElement">Owner: {props.currentViewedPreset.ownerName}</div>
                </div>
            )
        }
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