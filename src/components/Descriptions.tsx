import React from 'react';
import { server_url} from '../code/urls';
import { Card } from '@material-ui/core';


export const Descriptions = function(props) {
    if (!props.gameInProgress) {
        if (props.currentView === "presets")
            return (
                <div className="infoPanelDescriptions">
                    Preset info: {props.currentViewedPreset.description}
                </div>

                // TODO delete preset button

            )
        
        else return (
            <div className="infoPanelDescriptions">
                About the Memoricci
            </div>
        )
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