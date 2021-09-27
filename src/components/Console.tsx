import React from 'react';
import { config } from '../code/config';


export const Console = function(props) {
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
                    <div className="consoleMessage">UPLOAD to make new preset from your files</div>
                    <div className="consoleMessage">CREATE to generate images from words</div>
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
}