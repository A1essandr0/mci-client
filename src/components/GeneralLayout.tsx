import React from 'react';

import { ToolBar } from './ToolBar';
import { Signup } from './Signup';
import { Signin } from './Signin';
import { Game } from './Game';

import { createGlobalState } from '../code/state';
import { IPreset } from 'src/code/globalTypes';
import { auth } from '../code/auth';
import { getPresets } from "../code/presets";


class GeneralLayout extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = createGlobalState(this);
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
                
                let path = this.props['path'].split('=');
                let chosenPreset: IPreset;
                if (path[0] === '/preset' && path[1]) {
                    const presetViaLink = playablePresetsData.filter(item => 
                        item['presetId'] === Number(path[1])
                    )
                    if (presetViaLink.length === 1) chosenPreset = presetViaLink[0]
                        else chosenPreset = playablePresetsData[0];                
                } else chosenPreset = playablePresetsData[0];

                // it is better to have presets in dictionary, indexed by presetName
                // TODO extract method
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
            cards: this.state['currentPlayedPreset']['cards'] ? 
                        this.state['currentPlayedPreset']['cards'].map(
                            (item: any) => {
                                return {
                                    value: item.value,
                                    filename: item.filename,
                                    info: item.info,
                                    isOpened: false,
                                    isInGame: true                        
                                };
                            }
                        ) : undefined, 

            currentScore: this.state['gameStartingScore'],
            cardBack: this.state['currentPlayedPreset'] ? this.state['currentPlayedPreset']['cardBack'] : undefined,
            cardEmpty: this.state['currentPlayedPreset'] ? this.state['currentPlayedPreset']['cardEmpty'] : undefined,
            presetName: this.state['currentPlayedPreset'] ? this.state['currentPlayedPreset']['presetName'] : undefined,
            presetDescription: this.state['currentPlayedPreset'] ? this.state['currentPlayedPreset']['description'] : undefined
        };

        const propsToSignin = {
            signinActive: this.state['signinActive'],
            setGlobalStateParameter: this.state['setGlobalStateParameter'],
        };
        const propsToSignup = {
            signupActive: this.state['signupActive'],
            setGlobalStateParameter: this.state['setGlobalStateParameter'],
        };
        const propsToToolBar = {
            gameInProgress: this.state['gameInProgress'],
            setGlobalStateParameter: this.state['setGlobalStateParameter'],
            signupActive: this.state['signupActive'],
            signinActive: this.state['signinActive']
        }

        return (
            <div className="appContainer">
                <ToolBar {...propsToToolBar}/>
                <Game {...propsToGame} {...this.state}/>
                <Signup {...propsToSignup}/>                
                <Signin {...propsToSignin}/>
            </div>
        )
    }
}

export default GeneralLayout;