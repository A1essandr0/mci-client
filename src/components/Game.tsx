import React from 'react';

import { ControlPanel } from './ControlPanel';
import { Board } from './Board';
import { Console } from './Console';
import { Descriptions } from './Descriptions';
import { createGameState } from '../code/state';
import { shuffleArray } from '../code/lib';
import Paper from '@material-ui/core/Paper';


export class Game extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = createGameState(this);
    }

    componentDidUpdate(prevProps: any) {
        if (this.props != prevProps)  {
            let cards = [...this.props['cards']];
            
            // on game start (and only then) we have to shuffle the cards
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
        return (
            <div className="gameArea">
                <Paper elevation={4}>
                    <ControlPanel setGameStateParameter={this.state['setGameStateParameter']}
                            {...this.props}
                    />
                </Paper>

                <Board gameInProgress={this.props['gameInProgress']}
                    showIsOn={this.props['showIsOn']}
                    currentView={this.props['currentView']}
                    currentViewedPreset={this.props['currentViewedPreset']}
                    currentPlayedPreset={this.props['currentPlayedPreset']}
                    {...this.state}
                />
                
                <Console gameInProgress={this.props['gameInProgress']}
                                currentView={this.props['currentView']}
                                messageQueue={this.state['messageQueue']}
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