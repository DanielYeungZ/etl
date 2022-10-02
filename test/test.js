const assert = require('assert');
const pipeline = require('../pipeline.js')
const {expect} = require('chai');

describe('team pipeline: ', async () => {
    let id1 = '1'
    let season1 = '20002001'
    describe(`Team ${id1}, Season ${season1}`, async () => {
        it('team data equal', async () => {
            let {csvPayload} = await pipeline.teamPipeline(id1, season1)
            let team1 = {
                id: 1,
                name: 'New Jersey Devils',
                venueName: 'Prudential Center',
                games: 82,
                wins: 48,
                losses: 19,
                points: 111,
                goalsPerGame: 3.598,
                firstGameDate: '2000-10-06T23:00:00Z',
                firstGameOpponent: 'Montréal Canadiens'
            }
            assert.deepEqual(csvPayload, team1);
        });
    });

    let id2 = '2'
    let season2 = '20002001'
    describe(`Team ${id2}, Season ${season2}`, async () => {
        it('team data equal', async () => {
            let {csvPayload} = await pipeline.teamPipeline(id2, season2)
            let team2 = {
                id: 2,
                name: 'New York Islanders',
                venueName: 'UBS Arena',
                games: 82,
                wins: 21,
                losses: 51,
                points: 52,
                goalsPerGame: 2.256,
                firstGameDate: '2000-10-06T23:30:00Z',
                firstGameOpponent: 'Tampa Bay Lightning'
            }
            assert.deepEqual(csvPayload, team2);
        });
    });

    let idError;
    let seasonError;
    describe(`Team ${idError}, Season ${seasonError}`, async () => {
        it('team id error', async () => {
            try {
                let records = await pipeline.teamPipeline(idError, seasonError)
            } catch (e) {
                expect(e).to.be.instanceOf(Error)
                expect(e.message).to.eql('id not specified')
            }
        });
        it('team season error', async () => {
            try {
                idError = 3
                let records = await pipeline.teamPipeline(idError, seasonError)
            } catch (e) {
                expect(e).to.be.instanceOf(Error)
                expect(e.message).to.eql('season not specified')
            }
        });
        it('team invalid error', async () => {
            try {
                idError = -1
                seasonError = '20202021'
                let records = await pipeline.teamPipeline(idError, seasonError)
            } catch (e) {
                expect(e).to.be.instanceOf(Error)
                expect(e.message).to.eql('getTeam Error')
            }
        });
    });

});


describe('player pipeline: ', async () => {
    const id1 = '8476792'
    const season1 = '20202021'
    describe(`Player ${id1}, Season ${season1}`, async () => {
        it('player data equal', async () => {

            let {csvPayload} = await pipeline.playerPipeline(id1, season1)
            let player1 = {
                id: 8476792,
                name: 'Torey Krug',
                currentTeam: 'St. Louis Blues',
                age: 31,
                number: '47',
                position: 'Defenseman',
                rookie: false,
                assists: 30,
                goals: 2,
                games: 51,
                hits: 51,
                points: 32
            }
            assert.deepEqual(csvPayload, player1);
        });
    });

    const id2 = '8446165'
    const season2 = '20202021'
    describe(`Player ${id2}, Season ${season2}`, async () => {
        it('player data equal', async () => {
            let {csvPayload} = await pipeline.playerPipeline(id2, season2)
            let player = {
                id: 8446165,
                name: 'Bob Corkum',
                number: '27',
                position: 'Center',
                rookie: false
            }
            assert.deepEqual(csvPayload, player);
        });
    });

    const id3 = '8465005'
    const season3 = '20132014'
    describe(`Player ${id3}, Season ${season3}`, async () => {
        it('player data equal', async () => {
            let {csvPayload} = await pipeline.playerPipeline(id3, season3)
            let player = {
                id: 8465005,
                name: 'Colin White',
                number: '5',
                position: 'Defenseman',
                rookie: false
            }
            assert.deepEqual(csvPayload, player);
        });
    });

    let idError;
    let seasonError;
    describe(`Player ${idError}, Season ${seasonError}`, async () => {
        it('player id error', async () => {
            try {
                let records = await pipeline.playerPipeline(idError, seasonError)
            } catch (e) {
                expect(e).to.be.instanceOf(Error)
                expect(e.message).to.eql('id not specified')
            }
        });
        it('player season error', async () => {
            try {
                idError = 3
                let records = await pipeline.playerPipeline(idError, seasonError)
            } catch (e) {
                expect(e).to.be.instanceOf(Error)
                expect(e.message).to.eql('season not specified')
            }
        });
        it('player invalid error', async () => {
            try {
                idError = -1
                seasonError = '20202021'
                let records = await pipeline.playerPipeline(idError, seasonError)
            } catch (e) {
                expect(e).to.be.instanceOf(Error)
                expect(e.message).to.eql('getPeople error')
            }
        });
    });

});
