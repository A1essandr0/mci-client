import React from 'react';

import { ToolBar } from './ToolBar';
import { Signup } from './Signup';
import { Signin } from './Signin';
import { Game } from './Game';

import { createGlobalState, IPreset } from '../code/state';
import { auth } from '../code/auth';
import { getPresets } from "../code/presets";


class GeneralLayout extends React.Component {
    constructor(props) {
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

                // preset id from props defines current preset here
                console.log(this.props['path']);

                this.setState({
                    playablePresets: playablePresetsData,
                    viewablePresets: viewablePresetsData,
                    currentPlayedPreset: playablePresetsData[0],
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
                            (item) => {
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
            toggleSignin: this.state['toggleSignin'],
            signinActive: this.state['signinActive']

        };
        const propsToSignup = {
            toggleSignup: this.state['toggleSignup'],
            signupActive: this.state['signupActive']
        };
        const propsToToolBar = {
            gameInProgress: this.state['gameInProgress'],
            setView: this.state['setView'],
            setGlobalStateParameter: this.state['setGlobalStateParameter'],
            toggleSignin: this.state['toggleSignin'],
            toggleSignup: this.state['toggleSignup'],
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