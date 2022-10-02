require('./config.js')
const api = require('./api.js');
const _ = require('lodash');
const {createObjectCsvWriter} = require('csv-writer');
const omitEmpty = require('omit-empty');
const teamCsvHeader = [
    {id: 'id', title: 'Team ID'},
    {id: 'name', title: 'Team Name'},
    {id: 'venueName', title: 'Team Venue Name'},
    {id: 'games', title: 'Games Played'},
    {id: 'wins', title: 'Wins'},
    {id: 'losses', title: 'Losses'},
    {id: 'points', title: 'Points'},
    {id: 'goalsPerGame', title: 'Goals Per Game'},
    {id: 'firstGameDate', title: 'Game Date of First Game of Season'},
    {id: 'firstGameOpponent', title: 'Opponent Name in First Game of Season'},
]

const teamCsvPath = __dirname+'/csv/team.csv'

const teamWriter = createObjectCsvWriter({
    path: teamCsvPath,
    header: teamCsvHeader
});

const teamAppend = createObjectCsvWriter({
    path: teamCsvPath,
    header: teamCsvHeader,
    append: true
});

const teamPipeline = async (id, season, append = false) => {
    if (!id) throw new Error('id not specified')
    if (!season) throw new Error('season not specified')

    //get team data params
    let paramsTeam = {
        season: season,
        expand: [
            'team.stats',
        ]
    }

    //get team schedule params
    let paramsSchedule = {
        season: season,
        teamId: id,
    }

    let [responseTeam, responseSchedule] = await Promise.all([api.getTeam(id, paramsTeam), api.getSchedule(paramsSchedule)]);

    // team & team stats data
    const team = responseTeam.teams[0]
    const teamStats = team.teamStats[0]
    const stat = teamStats && teamStats.splits[0].stat

    // first team game data
    const firstDate = responseSchedule && responseSchedule.dates[0]
    const firstGame = firstDate && firstDate.games[0]
    const firstGameTeams = firstGame && firstGame.teams

    // find opponent name
    const opponent = _.find(firstGameTeams, (current) => {
        if (current.team.name !== team.name) return true
    })
    const opponentName = opponent && opponent.team.name


    // generate payload for csv
    let teamPayload = omitEmpty({
        id: team.id,
        name: team.name,
        venueName: team.venue.name,
        games: stat.gamesPlayed,
        wins: stat.wins,
        losses: stat.losses,
        points: stat.pts,
        goalsPerGame: stat.goalsPerGame,
        firstGameDate: firstGame.gameDate,
        firstGameOpponent: opponentName,
    })
    const records = [teamPayload];

    //write records to csv
    if (append) await teamAppend.writeRecords(records)
    else await teamWriter.writeRecords(records)

    return {
        team: responseTeam,
        schedule: responseSchedule,
        csvPayload: teamPayload,
    }

}
module.exports.teamPipeline = teamPipeline;

const playerCsvHeader = [
    {id: 'id', title: 'Player ID'},
    {id: 'name', title: 'Player Name'},
    {id: 'currentTeam', title: 'Current Team'},
    {id: 'age', title: 'Player Age'},
    {id: 'number', title: 'Player Number'},
    {id: 'position', title: 'Player Position'},
    {id: 'rookie', title: 'If the player is a rookie'},
    {id: 'assists', title: 'Assists'},
    {id: 'goals', title: 'Goals'},
    {id: 'games', title: 'Games'},
    {id: 'hits', title: 'Hits'},
    {id: 'points', title: 'Points'},
]

const playerCsvPath =  __dirname+'/csv/player.csv'

const playerWriter = createObjectCsvWriter({
    path: playerCsvPath,
    header: playerCsvHeader
});

const playerAppend = createObjectCsvWriter({
    path: playerCsvPath,
    header: playerCsvHeader,
    append: true
});

const playerPipeline = async (id, season, append = false) => {
    if (!id) throw new Error('id not specified')
    if (!season) throw new Error('season not specified')

    // get player stats params
    let params = {
        season: season,
        stats: 'statsSingleSeason',
    }

    let [responsePlayer, responseStats] = await Promise.all([api.getPeople(id), api.getPeopleStat(id, params)]);

    // player data
    const player = responsePlayer.people[0]

    // player stats data
    const playerStats = responseStats.stats[0]
    const playerStat = playerStats && playerStats.splits[0] && playerStats.splits[0].stat

    //generate player csv payload
    let playerPayload = omitEmpty({
        id: player.id,
        name: player.fullName,
        currentTeam: player.currentTeam && player.currentTeam.name,
        age: player.currentAge,
        number: player.primaryNumber,
        position: player.primaryPosition && player.primaryPosition.name,
        rookie: player.rookie,
        assists: playerStat && playerStat.assists,
        goals: playerStat && playerStat.goals,
        games: playerStat && playerStat.games,
        hits: playerStat && playerStat.hits,
        points: playerStat && playerStat.points,
    })
    const records = [playerPayload];

    //write records to csv
    if (append) await playerAppend.writeRecords(records)
    else await playerWriter.writeRecords(records)


    return {
        player: responsePlayer,
        stats: responseStats,
        csvPayload: playerPayload
    }
}
module.exports.playerPipeline = playerPipeline;
