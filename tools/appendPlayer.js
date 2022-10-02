require('dotenv').config({path: '../.env'});
const api = require("../api.js");
const pipeline = require("../pipeline.js");
const run = async () => {
    const myArgs = process.argv.slice(2);

    //season and playerId
    let id = myArgs[0]
    let season = myArgs[1]
    console.log('add player')
    console.log('id :', id, "=== season: ", season)

    //append player to csv
    try {
        let {
            player: playerPipe,
            stats: statsPipe,
            csvPayload: playerPayload
        } = await pipeline.playerPipeline(id, season, true)
    } catch (e) {
        console.log('id : ', id, "failed")
    }

    console.log('Done!')
}

(async () => {
    await run();
})()
