let pipeline=require('../pipeline.js')


const run =async ()=>{
    let {
        team: team2,
        schedule: schedule2,
        csvPayload : teamPayload2,
    }= await pipeline.teamPipeline(-1, '20002001')
    //
    // let {
    //     team: team,
    //     schedule: schedule,
    //     csvPayload : teamPayload,
    // }= await pipeline.teamPipeline(1, '20002001')
    //  console.log(teamPayload)
    // console.log(team.teams[0].roster.roster)
    // let {
    //     player: player,
    //     stats: stats,
    //     csvPayload: playerPayload
    // } = await pipeline.playerPipeline(8467351, '20132014')
    // console.log(player)
    // console.log(playerPayload)

}

( async ()=>{
    await run();
})()
