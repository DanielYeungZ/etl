require('dotenv').config({path: '../.env'});
let pipeline=require('../pipeline.js')
let api=require('../api.js');
const run =async ()=>{
    const myArgs = process.argv.slice(2);

    //default season and team
    let teamId = myArgs[0] || '1'
    let season =  myArgs[1] || '20212022'
    console.log('add sample players')
    console.log('teamId :',teamId, "=== season: ",season)

    // get team roster
    let params ={
        expand: [
            'team.roster',
        ]
    }
    let response = await api.getTeam(teamId,params);
    const team= response.teams[0]
    const roster = team.roster.roster

    //writing all players to csv
    for(let current of roster){
        let id = current && current.person.id
        try {
            let {
                player: playerPipe,
                stats: statsPipe,
                csvPayload: playerPayload
            } = await pipeline.playerPipeline(id, season)
        } catch (e){
            console.log('id : ', id , "failed")
            console.log(e)
        }
    }

    console.log('Done!')
}

( async ()=>{
    await run();
})()
