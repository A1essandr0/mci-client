import React from 'react';

import { sleep } from './lib';
import { config } from './config';
import { ICard, IPreset } from './globalTypes';


export function createGlobalState(parentComponent: React.Component) {
    return {
        currentView: "play", // "play" | "presets" | "users"
        gameInProgress: false,
        showIsOn: false,

        signinActive: false,
        signupActive: false,
        makePresetActive: false,
        deletePresetActive: false,
        editPresetActive: false,

        playablePresets: {},
        viewablePresets: {},
        currentPlayedPreset: "",
        currentViewedPreset: "",

        gameStartingDelay: config.gameStartingDelay,
        gameDelayOnShow: config.gameDelayOnShow,
        gameStartingScore: config.gameStartingScore,

        setPlayedPreset: function(presetName: string) {
            let preset = this.state.playablePresets[presetName];
            this.setState({ 
                currentPlayedPreset: preset,
                gameStartingDelay: config.gameStartingDelay, // to avoid cheating
                gameDelayOnShow: config.gameDelayOnShow,
                gameStartingScore: config.gameStartingScore
            })
        }.bind(parentComponent),

        setViewedPreset: function(presetName: string) {
            let preset = this.state.viewablePresets[presetName];
            this.setState({ currentViewedPreset: preset})
        }.bind(parentComponent),

        setGlobalStateParameter: function(paramName: string, paramValue: any): void {
            this.setState({ [paramName]: paramValue })
        }.bind(parentComponent),
    }
}


export function createGameState(gameComponent: React.Component) {
    return {
        cards: [],

        gameJustStarted: false,
        userIsPlaying: undefined,
        // gameHasEnded: false,

        // cardsOut: [],
        // checkingPair: null,
        // cardsFlipped: 0,
        // cardsOpenedAtm: 0,
        // currentScore: 0,
        // messageQueue: [],

        // cardBack: '',
        // cardEmpty: '',
        // presetName: '',
        // presetDescription:  '',


        setGameStateParameter: function(paramName: string, paramValue: any): void {
            this.setState({ [paramName]: paramValue })
        }.bind(gameComponent),

        flipAllCards: function(value: boolean): void {
            for (let card of this.state['cards']) card.isOpened = value;
        }.bind(gameComponent),

        takeCardOut: function(card) {
            card.isInGame = false;
            this.setState((state) => {return {
                cardsOut: [card, ...state.cardsOut],
                cardsOpenedAtm: state['cardsOpenedAtm'] - 1
            }})
        }.bind(gameComponent),

        messageAddToQueue: function(msg: string) {
            this.setState((state) => { return {
                messageQueue: [...state.messageQueue, msg]
            }})
        }.bind(gameComponent),


        // main game logic
        manageGameBoard: function(card) {
            card.isOpened = !card.isOpened;
            this.setState((state) => { return {
                cardsFlipped: state['cardsFlipped'] + 1,
                cardsOpenedAtm: state['cardsOpenedAtm'] + 1
            }});


            if (this.state['checkingPair'] === null) this.state['checkingPair'] = card
            else {

                sleep(this.props['gameDelayOnShow']).then( () => {
                    this.setState({});

                    // matching case: pair leaves the game and goes to cardsOut
                    if (this.state['checkingPair'] != card &&
                            this.state['checkingPair'].value === card.value) {
                        this.state.messageAddToQueue(`matched, score: ${this.state.currentScore}`);
                        this.state.takeCardOut(this.state['checkingPair']);
                        this.state.takeCardOut(card);
                    }

                    // non-matching case: pair flips back
                    else {
                        this.state['checkingPair'].isOpened = false;
                        card.isOpened = false;
                        this.setState((state) => {return {
                            currentScore: state.currentScore - 1,
                            cardsOpenedAtm: state['cardsOpenedAtm'] - 2
                        }})
                        this.state.messageAddToQueue(`not matched, score: ${this.state.currentScore}`);
                    }

                    // checking whether wrong amount of cards is opened at the moment
                    // this could happen due to fast clicking, which is viewed as cheating
                    if (this.state['cardsOpenedAtm'] > 0) {
                        this.state.flipAllCards(false);
                        this.setState((state) => {return {
                            currentScore: state.currentScore - 1,
                            cardsOpenedAtm: 0
                        }})
                        this.state.messageAddToQueue(`fast clicking penalty, score: ${this.state.currentScore}`);
                    }

                    // winning case
                    if (this.state['cardsOut'].length >= this.state['cards'].length &&
                            this.state['currentScore'] > 0) {
                        this.state.messageAddToQueue(`You've won, mate.`);
                        this.state.messageAddToQueue(`End score: ${this.state['currentScore']}`);
                        this.state.messageAddToQueue(`Great success.`);

                        console.log("User has won", this.state.userIsPlaying)
                        // TODO logic to record game results for user

                        this.setState({
                            gameHasEnded: true,
                            userIsPlaying: undefined
                        });
                    }

                    // losing case
                    if (this.state['currentScore'] < 1) {
                        this.state.messageAddToQueue(`No points left. Game over.`);
                        this.state.messageAddToQueue(`You can continue clicking mate, but what's the point?`);

                        console.log("User has lost", this.state.userIsPlaying)
                        // TODO logic to record game results for user

                        this.setState({
                            gameHasEnded: true,
                            userIsPlaying: undefined
                        });
                    }


                    this.setState({
                        checkingPair: null
                    });
                })       
            }
        }.bind(gameComponent)

    }
}

