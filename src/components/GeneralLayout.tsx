import React from 'react';

import { ToolBar } from './ToolBar';
import { Signup } from './Signup';
import { Signin } from './Signin';
import { Game } from './Game';

import { ICard, IPreset } from 'src/code/globalTypes';
import { auth } from '../code/auth';
import { getPresets } from "../code/presets";
import { config } from '../code/config';


export type CurrentViewTypes = "play" | "presets" | "users";
type GeneralLayoutState = {
    currentView: CurrentViewTypes;
    gameInProgress: boolean,
    showIsOn: boolean,
    signinActive: boolean,
    signupActive: boolean,
    makePresetActive: boolean,
    deletePresetActive: boolean,
    editPresetActive: boolean,
    gameStartingDelay: number,
    gameDelayOnShow: number,
    gameStartingScore: number,

    playablePresets: { [key in string]: IPreset},
    viewablePresets: { [key in string]: IPreset},
    currentPlayedPreset: any,
    currentViewedPreset: any,
}
type GeneralLayoutProps = {
    path: string
}


class GeneralLayout extends React.Component<GeneralLayoutProps, GeneralLayoutState> {
    constructor(props: GeneralLayoutProps) {
        super(props);
        this.state = {
            currentView: "play",
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
        }
        this.setPlayedPreset = this.setPlayedPreset.bind(this);
        this.setViewedPreset = this.setViewedPreset.bind(this);
        this.setGlobalStateParameter = this.setGlobalStateParameter.bind(this);
    }

    setPlayedPreset(presetName: string) {
        let preset = this.state.playablePresets[presetName];
        this.setState({ 
            currentPlayedPreset: preset,
            gameStartingDelay: config.gameStartingDelay, // to avoid cheating
            gameDelayOnShow: config.gameDelayOnShow,
            gameStartingScore: config.gameStartingScore
        })
    }
    
    setViewedPreset(presetName: string) {
        let preset = this.state.viewablePresets[presetName];
        this.setState({ currentViewedPreset: preset})
    }
    
    setGlobalStateParameter(paramName: string, paramValue: any): void {
        this.setState((state) => ({ ...state, [paramName]: paramValue}))
    }


    componentDidMount() {
        let user = auth.isAuthenticated().user;

        getPresets(user && user.id).then((data) => {
            if (data.error) console.log(data.error)
            else {
                let playablePresetsData: IPreset[] = data.filter(
                    (item: IPreset) => item.playableByAll || user && user.id === item.owner
                );
                let viewablePresetsData: IPreset[] = data.filter(
                    (item: IPreset) => item.viewableByAll || item.viewableByUsers && user || user && user.id === item.owner
                );
                
                let path = this.props.path.split(/[=|?]/);
                // console.log(`source path: ${this.props.path}`);
                // console.log(path);
                
                let chosenPreset: IPreset;
                if (path[1] === 'preset' && path[2]) {
                    const presetViaLink = playablePresetsData.filter(item => 
                        item['presetId'] === Number(path[2])
                    )
                    if (presetViaLink.length === 1) chosenPreset = presetViaLink[0]
                        else chosenPreset = playablePresetsData[0];                
                } else chosenPreset = playablePresetsData[0];

                // it is better to have presets in dictionary, indexed by presetName
                let playablePresetsDict = {};
                for (let pr of playablePresetsData) {
                    playablePresetsDict = {...playablePresetsDict,
                        [pr.presetName]: pr
                    }
                }
                let viewablePresetsDict = {};
                for (let pr of viewablePresetsData) {
                    viewablePresetsDict = {...viewablePresetsDict,
                        [pr.presetName]: pr
                    }
                }

                this.setState({
                    playablePresets: playablePresetsDict,
                    viewablePresets: viewablePresetsDict,
                    currentPlayedPreset: chosenPreset,
                    currentViewedPreset: viewablePresetsData[0]
                })
            }
        })
    }

    render() {
        // giving the game its initial state based on the chosen preset and game settings
        // since it is in the render(), happens every time the state of GeneralLayout changes
        const propsToGame = {
            cards: this.state.currentPlayedPreset.cards ? 
                        this.state.currentPlayedPreset.cards.map(
                            (item: ICard) => { return {
                                    value: item.value,
                                    filename: item.filename,
                                    info: item.info,
                                    isOpened: false,
                                    isInGame: true                        
                                };
                            }
                        ) : undefined, 

            currentScore: this.state.gameStartingScore,
            cardBack: this.state.currentPlayedPreset ? this.state.currentPlayedPreset.cardBack : undefined,
            cardEmpty: this.state.currentPlayedPreset ? this.state.currentPlayedPreset.cardEmpty : undefined,
            presetName: this.state.currentPlayedPreset ? this.state.currentPlayedPreset.presetName : undefined,
            presetDescription: this.state.currentPlayedPreset ? this.state.currentPlayedPreset.description : undefined,
            setGlobalStateParameter: this.setGlobalStateParameter,
            setPlayedPreset: this.setPlayedPreset,
            setViewedPreset: this.setViewedPreset
        };

        return (
            <div className="appContainer">
                <ToolBar gameInProgress={this.state.gameInProgress}
                            signupActive={this.state.signupActive}
                            signinActive={this.state.signinActive}
                            setGlobalStateParameter={this.setGlobalStateParameter}
                />

                <Game {...propsToGame} 
                        {...this.state} // TODO no need to pass on all the state
                />

                <Signup signupActive={this.state.signupActive}
                        setGlobalStateParameter={this.setGlobalStateParameter}
                />                
                <Signin signinActive={this.state.signinActive}
                        setGlobalStateParameter={this.setGlobalStateParameter}
                />
            </div>
        )
    }
}

export default GeneralLayout;