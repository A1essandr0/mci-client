import React from 'react';

import { ControlPanel } from './ControlPanel';
import { Board } from './Board';
import { Console } from './Console';
import { Descriptions } from './Descriptions';
import { shuffleArray, sleep } from '../code/lib';
import Paper from '@material-ui/core/Paper';
import { ICard, User } from 'src/code/globalTypes'


type GameState = {
    cards: ICard[];

    gameJustStarted: boolean;
    userIsPlaying: User | undefined;
    gameHasEnded: boolean;

    cardsOut: ICard[];
    checkingPair: ICard | null;
    cardsFlipped: number;
    cardsOpenedAtm: number;
    currentScore: number;
    messageQueue: string[];

    cardBack: string;
    cardEmpty: string;
    presetName: string;
    presetDescription: string;
}
type GameProps = {

}


export class Game extends React.Component<any, GameState> {
    constructor(props: any) {
        super(props);
        this.state = {
            cards: [],

            gameJustStarted: false,
            userIsPlaying: undefined,
            gameHasEnded: false,
    
            cardsOut: [],
            checkingPair: null,
            cardsFlipped: 0,
            cardsOpenedAtm: 0,
            currentScore: 0,
            messageQueue: [],
    
            cardBack: '',
            cardEmpty: '',
            presetName: '',
            presetDescription:  '',    
        }
        this.setGameStateParameter = this.setGameStateParameter.bind(this);
        this.flipAllCards = this.flipAllCards.bind(this);
        this.takeCardOut = this.takeCardOut.bind(this);
        this.messageAddToQueue = this.messageAddToQueue.bind(this);
        this.manageGameBoard = this.manageGameBoard.bind(this);
    }

    setGameStateParameter(paramName: string, paramValue: any): void {
        this.setState((state) => ({ ...state, [paramName]: paramValue }))
    }

    flipAllCards(value: boolean): void {
        for (let card of this.state.cards) card.isOpened = value;
    }

    takeCardOut(card: ICard) {
        card.isInGame = false;
        this.setState((state) => {return {
            cardsOut: [card, ...state.cardsOut],
            cardsOpenedAtm: state.cardsOpenedAtm - 1
        }})
    }

    messageAddToQueue(msg: string) {
        this.setState((state) => { return {
            messageQueue: [...state.messageQueue, msg]
        }})
    }

    // main game logic resides here
    manageGameBoard(card: ICard) {
        card.isOpened = !card.isOpened;
        this.setState((state) => { return {
            cardsFlipped: state.cardsFlipped + 1,
            cardsOpenedAtm: state.cardsOpenedAtm + 1
        }});


        if (this.state.checkingPair === null) this.setState({checkingPair: card})
        else {

            sleep(this.props.gameDelayOnShow).then( () => {
                this.setState({});

                // matching case: pair leaves the game and goes to cardsOut
                if (this.state.checkingPair != card &&
                        this.state.checkingPair?.value === card.value) {
                    this.messageAddToQueue(`matched, score: ${this.state.currentScore}`);
                    this.takeCardOut(this.state.checkingPair);
                    this.takeCardOut(card);
                }

                // non-matching case: pair flips back
                else {
                    if (this.state.checkingPair) this.state.checkingPair.isOpened = false;
                    card.isOpened = false;
                    this.setState((state) => {return {
                        currentScore: state.currentScore - 1,
                        cardsOpenedAtm: state.cardsOpenedAtm - 2
                    }})
                    this.messageAddToQueue(`not matched, score: ${this.state.currentScore}`);
                }

                // checking whether wrong amount of cards is opened at the moment
                // this could happen due to fast clicking, which is viewed as cheating
                if (this.state.cardsOpenedAtm > 0) {
                    this.flipAllCards(false);
                    this.setState((state) => {return {
                        currentScore: state.currentScore - 1,
                        cardsOpenedAtm: 0
                    }})
                    this.messageAddToQueue(`fast clicking penalty, mate. Score: ${this.state.currentScore}`);
                }

                // winning case
                if (this.state.cardsOut.length >= this.state.cards.length &&
                        this.state.currentScore > 0) {
                    this.messageAddToQueue(`You've won, mate.`);
                    this.messageAddToQueue(`End score: ${this.state.currentScore}`);
                    this.messageAddToQueue(`Great success.`);

                    console.log("User has won", this.state.userIsPlaying)
                    // TODO logic to record game results for user

                    this.setState({
                        gameHasEnded: true,
                        userIsPlaying: undefined
                    });
                }

                // losing case
                if (this.state.currentScore < 1) {
                    this.messageAddToQueue(`No points left. Game over.`);
                    this.messageAddToQueue(`You can continue clicking mate, but what's the point?`);

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
    }




    componentDidUpdate(prevProps: any) {
        if (this.props != prevProps)  {
            let cards: ICard[] = [...this.props.cards];
            
            // on game start (and only then) we have to shuffle the cards
            if (this.props.gameInProgress && !prevProps.gameInProgress)
                cards = shuffleArray(cards);

            this.setState({
                cards: cards,
                gameHasEnded: false,

                cardsOut: [],
                checkingPair: null,
                cardsFlipped: 0,
                cardsOpenedAtm: 0,
                messageQueue: ['The game has started'],

                currentScore: this.props.gameStartingScore,
                cardBack: this.props.currentPlayedPreset.cardBack,
                cardEmpty: this.props.currentPlayedPreset.cardEmpty,
                presetName: this.props.currentPlayedPreset.presetName,
                presetDescription: this.props.currentPlayedPreset.description,
            })
        }
    }


    render() {
        // console.log(this.state)
        return (
            <div className="gameArea">
                <Paper elevation={4}>
                    <ControlPanel setGameStateParameter={this.setGameStateParameter}
                            {...this.props}
                    />
                </Paper>

                <Board gameInProgress={this.props.gameInProgress}
                        showIsOn={this.props.showIsOn}
                        currentView={this.props.currentView}
                        currentViewedPreset={this.props.currentViewedPreset}
                        currentPlayedPreset={this.props.currentPlayedPreset}
                        manageGameBoard={this.manageGameBoard}

                        gameHasEnded={this.state.gameHasEnded}
                        gameJustStarted={this.state.gameJustStarted}
                        cardEmpty={this.state.cardEmpty}
                        cardBack={this.state.cardBack}
                        cards={this.state.cards}
                />
                
                <Console gameInProgress={this.props.gameInProgress}
                                currentView={this.props.currentView}
                                messageQueue={this.state.messageQueue}
                />

                <Descriptions gameInProgress={this.props.gameInProgress} 
                                currentView={this.props.currentView}
                                currentViewedPreset={this.props.currentViewedPreset}
                                cardsOut={this.state.cardsOut}
                />
            </div>
        )
    }
}