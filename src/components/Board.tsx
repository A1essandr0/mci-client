import React, { FC } from 'react';
import { server_url} from '../code/urls';
import { Users } from './Users';
import Card from '@material-ui/core/Card';
import { CurrentViewTypes } from 'src/components/GeneralLayout';
import { IPreset, ICard } from 'src/code/globalTypes';


type BoardProps = {
    currentView: CurrentViewTypes;
    gameInProgress: boolean;
    gameHasEnded: boolean;
    gameJustStarted: boolean;
    showIsOn: boolean;
    cardEmpty: string;
    cardBack: string;

    cards: ICard[];
    currentViewedPreset: IPreset;
    currentPlayedPreset: IPreset;
    manageGameBoard: (card: ICard) => void;
}

export const Board: FC<BoardProps> = function(props: BoardProps) {
    if (props.currentView === "play") {
        if (props.gameInProgress) {
            return (
                <div className="gameBoard">
                    {props.cards && props.cards.map((card, reactKey) => {
                        if (!card.isInGame || props.gameHasEnded) 
                            return (
                                <Card key={reactKey} className="gameCell">
                                    <img src={`${server_url}${props.cardEmpty}`}/>
                                </Card>
                            )
                        else return (
                            <Card key={reactKey} className="gameCell">
                                <img src={`${server_url}${card.isOpened || props.gameJustStarted ? 
                                        card.filename : props.cardBack}`}
                                    onClick={ props.gameJustStarted || props.gameHasEnded ? 
                                        ()=>{} : () => { props.manageGameBoard(card) }}/>
                            </Card>
                        )})
                    }
                </div>
            )
        }

        else return (
                <div className="gameBoard" >
                    {props.currentPlayedPreset.cards && 
                        props.currentPlayedPreset.cards.map((item, reactKey) => {
                            return (
                                <Card key={reactKey} className="gameCell">
                                    <img src={`${server_url}${
                                        props.showIsOn ? item.filename : props.currentPlayedPreset.cardBack
                                        }
                                    `}/>
                                </Card>
                            )
                        })
                    }
                </div>
            )
    }

    else if (props.currentView === "presets")
        return (
            <div className="presetEditView">
                {props.currentViewedPreset.cards && 
                    props.currentViewedPreset.cards.map((card, reactKey) => {
                        return (
                            <img key={reactKey} className="gameCell" src={`${server_url}${card.filename}`}
                                    onClick={() => { alert(card.info) }}
                            />
                        )
                    })                
                }
            </div>
        )

    else if (props.currentView === "users")
            return (
                <div>
                    <Users />
                </div>
            )
    
    return <div></div> // unreachable, but helps to maintain JSX.Element type
}
