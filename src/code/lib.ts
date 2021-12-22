
export function sleep(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export function shuffleArray<Type>(array: Array<Type>): Array<Type> {
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

type ExpandFormResult = { [key in string]: FormDataEntryValue };
export function expandFormData(form: FormData): ExpandFormResult {
    const result: ExpandFormResult = {};
    form.forEach((value, key) => {
        result[key] = value;
    })
    return result;
}

