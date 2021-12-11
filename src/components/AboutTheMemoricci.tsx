import React from 'react';


export function AboutTheMemoricci() {
    return (
        <div className="infoPanelDescriptions">
            Memoricci is a memory game. There is a set of cards lying on the table with their backs up. 
            Every card is paired, or matched with another. 
            Player has certain number of turns, and each turn he flips two cards, trying to find those that are matched. 
            If the match is found, cards stay open. Otherwise they flip back.
            <br /><br />
            Every matched pair means a connection between objects, concepts, something that cards represent. 
            So playing the set several times helps to learn these connections by hand.
            <br /><br />
            Registered users can create, upload and manage access to their own sets of cards (presets).
            <span>Got an idea? Instagram&nbsp;</span>
            <span><a href="https://instagram.com/memoriccigame">@memoriccigame</a></span>
        </div>
    )
}