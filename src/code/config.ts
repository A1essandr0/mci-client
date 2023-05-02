
export const config = {
    mode: process.env.CLIENT_MODE,

    local_backend_server_url: 'http://localhost:3003',
    production_backend_server_url: 'https://memoricci.fun',

    gameStartingDelay: 7,
    gameDelayOnShow: 400,
    gameStartingScore: 7,
    
    messageQueueLength: 7,

    maxCardPairNum: 10,
}
