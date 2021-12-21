export interface ICard {
    filename: string;
    info: string;
    value: string;
    isInGame?: boolean;
    isOpened?: boolean;
}

export interface IPreset {
    cardBack: string;
    cardEmpty: string;
    cards: ICard[];
    description: string;
    owner: number;
    presetName: string;
    playableByAll: number;
    viewableByAll: number;
    viewableByUsers: number;
    presetId: number;
    ownerName?: string;
}

export type User = {
    email: string;
    id: number;
    is_admin: number;
    name: string;
}
export type StorageContent = {
    token: string;
    user: User;
}


export type HigherStateParameterChanger = (paramName: string, paramValue: any) => void;



// @TODO credentials type

