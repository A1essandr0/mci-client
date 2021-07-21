import React from 'react';

import { ControlPanel } from './ControlPanel';
import { Board } from './Board';
import { Console } from './Console';
import { Descriptions } from './Descriptions';
import { createGameState } from '../code/state';
import { shuffleArray } from '../code/lib';
import { Paper } from '@material-ui/core';


export class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = createGameState(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props != prevProps)  {
            // on game start (and only then) we have to shuffle the cards
            let cards = [...this.props['cards']];
            if (this.props['gameInProgress'] && !prevProps['gameInProgress'])
                cards = shuffleArray(cards);

            this.setState({
                cards: cards,
                gameHasEnded: false,

                cardsOut: [],
                checkingPair: null,
                cardsFlipped: 0,
                cardsOpenedAtm: 0,
                messageQueue: ['The game has started'],

                currentScore: this.props['gameStartingScore'],
                cardBack: this.props['currentPlayedPreset']['cardBack'],
                cardEmpty: this.props['currentPlayedPreset']['cardEmpty'],
                presetName: this.props['currentPlayedPreset']['presetName'],
                presetDescription: this.props['currentPlayedPreset']['description'],
            })
        }
    }


    render() {
        // console.log("game props",this.props)
        return (
            <div className="gameArea">
                <Paper elevation={4}>
                    <ControlPanel setGameStateParameter={this.state['setGameStateParameter']}
                            {...this.props}
                    />
                </Paper>

                <Board gameInProgress={this.props['gameInProgress']}
                    currentView={this.props['currentView']}
                    currentViewedPreset={this.props['currentViewedPreset']}
                    currentPlayedPreset={this.props['currentPlayedPreset']}
                    {...this.state}
                />
                
                <Console gameInProgress={this.props['gameInProgress']}
                                currentView={this.props['currentView']}
                                {...this.state}
                />

                <Descriptions gameInProgress={this.props['gameInProgress']} 
                                currentView={this.props['currentView']}
                                currentViewedPreset={this.props['currentViewedPreset']}
                                {...this.state}
                />
            </div>
        )
    }
}