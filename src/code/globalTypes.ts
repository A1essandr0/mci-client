// just received card
export interface ICard {
    filename: string;
    info: string;
    value: string;
}

// @TODO game ready card


// just received preset
export interface IPreset {
    owner: number;
    presetName: string;
    cardBack: string;
    cardEmpty: string;
    description: string;
    cards: ICard[];
    playableByAll: number;
    viewableByAll: number;
    viewableByUsers: number;
    presetId: number;
}

// @TODO game ready preset


// @TODO user type, credentials type

