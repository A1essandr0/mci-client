import React from 'react';
import { config } from '../code/config';


export const Console = function(props) {
    if (!props.gameInProgress)
        return (
            <div className="infoPanelConsole">
                <div className="consoleMessage">SHOW to see the card pairs</div>
                <div className="consoleMessage">START to start the game</div>
            </div>
        )

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