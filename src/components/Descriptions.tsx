import React, { FC } from 'react';
import { server_url} from '../code/urls';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';

import { AboutTheMemoricci } from './AboutTheMemoricci';
import { config } from '../code/config';
import { CurrentViewTypes } from 'src/components/GeneralLayout';
import { IPreset, ICard } from 'src/code/globalTypes'


type DescriptionsProps = {
    gameInProgress: boolean;
    currentView: CurrentViewTypes;
    currentViewedPreset: IPreset;
    cardsOut: ICard[];
}

export const Descriptions: FC<DescriptionsProps> = function(props: DescriptionsProps) {
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