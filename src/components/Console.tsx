import React from 'react';


const messageQueueLength = 7;

export const Console = function(props) {
    if (!props.gameInProgress)
        return (
            <div className="infoPanelConsole">
                <div className="consoleMessage">No game in progress</div>
            </div>
        )

    else return (
            <div className="infoPanelConsole">
                    {
                    (props.messageQueue.length > messageQueueLength 
                        ? props.messageQueue.slice(props.messageQueue.length - messageQueueLength)
                        : props.messageQueue
                    ).map(
                        (msg, reactKey) => <div key={reactKey} className="consoleMessage">{msg}</div>
                    )}
            </div>
        )
}