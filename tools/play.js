require('dotenv').config({path: '../.env'});

let pipeline=require('../pipeline.js')

const run =async ()=>{
    let {
        team: team2,
        schedule: schedule2,
        csvPayload : teamPayload2,
    }= await pipeline.teamPipeline(-1, '20002001')

}

( async ()=>{
    await run();
})()
