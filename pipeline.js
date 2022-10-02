require('./config.js');
const api = require('./api.js');
const _ = require('lodash');
const {createObjectCsvWriter} = require('csv-writer');
const omitEmpty = require('omit-empty');

const teamWriter = createObjectCsvWriter({
    path: './csv/team.csv',
    header: [
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
});

const teamPipeline = async (id, season) => {
    if (!id) throw new Error('id not specified')
    if (!season) throw new Error('season not specified')

    //get team data
    let paramsTeam = {
        season: season,
        expand: [
            'team.stats',
            'team.schedule.previous',
            'team.schedule.next',
        ]
    }
    const response = await api.getTeam(id, paramsTeam)
    const team = response.teams[0]
    const teamStats = team.teamStats[0]
    const stat = teamStats.splits[0].stat

    //get team schedule
    let paramsSchedule = {
        season: season,
        teamId: id,
    }
    const responseSchedule = await api.getSchedule(paramsSchedule);
    const firstDate = responseSchedule && responseSchedule.dates[0]
    const firstGame = firstDate && firstDate.games[0]
    const teams = firstGame.teams

    // find opponent name
    const opponent = _.find(teams, (current) => {
        if (current.team.name !== team.name) return true
    })
    const opponentName = opponent && opponent.team.name


    // generate records for csv
    const records = [
        {
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
        },
    ];

    // console.log(records)
    await teamWriter.writeRecords(records)
    return records
}
module.exports.teamPipeline=teamPipeline;

const playerWriter = createObjectCsvWriter({
    path: './csv/player.csv',
    header: [
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
});

const playerPipeline = async (id, season) => {
    if (!id) throw new Error('id not specified')
    if (!season) throw new Error('season not specified')

    //get player data
    const responsePlayer = await api.getPeople(id)
    const player = responsePlayer.people[0]


    // get player stats
    let params = {
        season: season,
        stats: 'statsSingleSeason',
    }
    const responseStats = await api.getPeopleStat(id, params)
    const playerStats = responseStats.stats[0]
    const playerStat = playerStats.splits[0].stat


    const records = [
        {
            id: player.id,
            name: player.fullName,
            currentTeam: player.currentTeam.name,
            age: player.currentAge,
            number: player.primaryNumber,
            position: player.primaryPosition.name,
            rookie: player.rookie,
            assists: playerStat.assists,
            goals: playerStat.goals,
            games: playerStat.games,
            hits: playerStat.hits,
            points: playerStat.points,
        },
    ];

    // console.log(records)
    await playerWriter.writeRecords(records)
    return records
}
module.exports.playerPipeline=playerPipeline;

