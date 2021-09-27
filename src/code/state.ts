import { sleep } from './lib';
import { config } from './config';


export interface ICard {
    filename: string,
    info: string,
    value: string
}

export interface IPreset {
    owner: number,
    presetName: string,
    cardBack: string,
    cardEmpty: string,
    description: string,
    cards: ICard[],
    playableByAll: number,
    viewableByAll: number,
    viewableByUsers: number
}


export function createGlobalState(parentComponent) {
    return {
        currentView: "play",
        gameInProgress: false,
        showIsOn: false,

        signinActive: false,
        signupActive: false,
        createPresetActive: false,
        uploadPresetActive: false,
        deletePresetActive: false,
        editPresetActive: false,

        playablePresets: [],
        viewablePresets: [],
        currentPlayedPreset: "",
        currentViewedPreset: "",

        gameStartingDelay: config.gameStartingDelay,
        gameDelayOnShow: config.gameDelayOnShow,
        gameStartingScore: config.gameStartingScore,


        toggleSignin: function(value: boolean): void { 
            this.setState({ signinActive: value })
        }.bind(parentComponent),
        toggleSignup: function(value: boolean): void 
            { this.setState({ signupActive: value })
        }.bind(parentComponent),
        toggleCreatePreset: function(value: boolean): void { 
            this.setState({ createPresetActive: value })
        }.bind(parentComponent),
        toggleUploadPreset: function(value: boolean): void { 
            this.setState({ uploadPresetActive: value })
        }.bind(parentComponent),
        toggleEditPreset: function(value: boolean): void { 
            this.setState({ editPresetActive: value })
        }.bind(parentComponent),
        toggleDeletePreset: function(value: boolean): void { 
            this.setState({ deletePresetActive: value })
        }.bind(parentComponent),


        setView: function(viewName: string) {
            this.setState({ currentView: viewName})
        }.bind(parentComponent),

        setPlayedPreset: function(presetName: string) {
            let preset = this.state.playablePresets
                .filter(item => item.presetName === presetName)[0] // O(n) search
            this.setState({ 
                currentPlayedPreset: preset,
                gameStartingDelay: config.gameStartingDelay, // to avoid cheating
                gameDelayOnShow: config.gameDelayOnShow,
                gameStartingScore: config.gameStartingScore
            })
        }.bind(parentComponent),

        setViewedPreset: function(presetName: string) {
            let preset = this.state.viewablePresets
                .filter(item => item.presetName === presetName)[0] // O(n) search
            this.setState({ currentViewedPreset: preset})
        }.bind(parentComponent),


        setGlobalStateParameter: function(paramName: string, paramValue: any): void {
            this.setState({ [paramName]: paramValue })
        }.bind(parentComponent),

    }
}


export function createGameState(gameComponent) {
    return {
        cards: [],

        gameJustStarted: false,
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
            this.setState({
                cardsOut: [card, ...this.state.cardsOut],
                cardsOpenedAtm: this.state['cardsOpenedAtm'] - 1
            })
        }.bind(gameComponent),

        messageAddToQueue: function(msg: string) {
            this.setState({
                messageQueue: [...this.state.messageQueue, msg]
            })
        }.bind(gameComponent),


        // main game logic
        manageGameBoard: function(card) {
            card.isOpened = !card.isOpened;
            this.setState({
                cardsFlipped: this.state['cardsFlipped'] + 1,
                cardsOpenedAtm: this.state['cardsOpenedAtm'] + 1
            });


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
                        this.setState({
                            currentScore: this.state.currentScore - 1,
                            cardsOpenedAtm: this.state['cardsOpenedAtm'] - 2
                        })
                        this.state.messageAddToQueue(`not matched, score: ${this.state.currentScore}`);
                    }

                    // checking whether wrong amount of cards is opened at the moment
                    // this could happen due to fast clicking
                    if (this.state['cardsOpenedAtm'] > 0) {
                        this.state.flipAllCards(false);
                        this.setState({
                            currentScore: this.state.currentScore - 1,
                            cardsOpenedAtm: 0
                        })
                        this.state.messageAddToQueue(`fast clicking penalty, score: ${this.state.currentScore}`);
                    }

                    // winning case
                    if (this.state['cardsOut'].length >= this.state['cards'].length &&
                            this.state['currentScore'] > 0) {
                        this.state.messageAddToQueue(`You've won, mate.`);
                        this.state.messageAddToQueue(`End score: ${this.state['currentScore']}`);
                        this.state.messageAddToQueue(`Great success.`);
                        this.setState({
                            gameHasEnded: true
                        });
                    }

                    // losing case
                    if (this.state['currentScore'] < 1) {
                        this.state.messageAddToQueue(`No points left. Game over.`);
                        this.state.messageAddToQueue(`You can continue clicking mate, but what's the point?`);
                        this.setState({
                            gameHasEnded: true
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

