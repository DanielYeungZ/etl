let pipeline=require('../pipeline.js')

let api=require('../api.js');
const run =async ()=>{
    const myArgs = process.argv.slice(2);

    //default season
    let season = myArgs[0] || '20212022'
    console.log('add sample teams')
    console.log("season: ",season)

    // get all teams
    let response = await api.getTeam();
    const teams= response.teams

    //writing all teams to csv
    for(let team of teams){
        let id = team.id
        try {
            let {
                team: teamPipe,
                schedule: schedulePipe,
                csvPayload: teamPayload,
            } = await pipeline.teamPipeline(id, season)
        } catch (e){
            console.log('id : ', id , "======> failed")
        }
    }


    console.log('Done!')
}

( async ()=>{
    await run();
})()
