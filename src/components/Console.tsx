import React, { FC } from 'react';
import { config } from '../code/config';
import { CurrentViewTypes } from 'src/components/GeneralLayout';


type ConsoleProps = {
    gameInProgress: boolean;
    currentView: CurrentViewTypes;
    messageQueue: string[];
}

export const Console: FC<ConsoleProps> = function(props) {
    if (!props.gameInProgress) {
        if (props.currentView === 'play')
            return (
                <div className="infoPanelConsole">
                    <div className="consoleMessage">SHOW to see the card pairs</div>
                    <div className="consoleMessage">START to start the game</div>
                </div>
            )
        else if (props.currentView === 'presets')
            return (
                <div className="infoPanelConsole">
                    <div className="consoleMessage">NEW PRESET to create your own preset</div>
                    <div className="consoleMessage">MODIFY to manage access rights</div>
                </div>                
            )
        else if (props.currentView === 'users')
            return (
                <div className="infoPanelConsole">
                </div>
            )
    }
    else return (
            <div className="infoPanelConsole">
                    {
                    (props.messageQueue.length > config.messageQueueLength 
                        ? props.messageQueue.slice(props.messageQueue.length - config.messageQueueLength)
                        : props.messageQueue
                    ).map(
                        (msg, reactKey) => <div key={reactKey} className="consoleMessageLeft">{msg}</div>
                    )}
            </div>
        )
    
    
    return <div></div> // unreachable, but helps to maintain JSX.Element type
}