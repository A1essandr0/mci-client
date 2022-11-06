
export const config = {
    mode: process.env.CLIENT_MODE,

    local_server_url: 'https://localhost:3003',
    azurevm_server_url: 'https://memoricci.fun',
    application_url: 'https://memoricci.fun',

    gameStartingDelay: 7,
    gameDelayOnShow: 400,
    gameStartingScore: 7,
    
    messageQueueLength: 7,

    maxCardPairNum: 10,
}