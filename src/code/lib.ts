
export function sleep(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export function shuffleArray(array: Array<any>): Array<any> {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export function arrayRange(len: number, from: number = 0, step: number = 1): Array<number> {
    return Array.from( {length: len}, 
        (a, b) => b*step + from
    )
}

export function expandFormData(form: FormData) {
    const result: any = {};
    form.forEach((value: any, key: any) => {
        result.key = value;
    })
    return result;
}

