require('./config.js')
const request = require('request');
const querystring = require('query-string');

// simple get request
const getRequest = async (url) => {
    let result = new Promise((resolve, reject) => {
        request(url, (error, res, body) => {
            if (!error && res.statusCode === 200) {
                resolve(JSON.parse(body));
            } else {
                reject(error);
            }
        });
    });
    return result
}

const getTeam = async (id = null, params = {}) => {
    try {
        let url = process.env.TEAM_ENDPOINT

        //query by team id
        if (id) url = `${url}/${id}`

        //add modifiers
        let modifiers = querystring.stringify(params);
        if (modifiers.length > 0) url = `${url}?${modifiers}`
        // console.log('url:', url)


        let body = await getRequest(url)
        return body
    } catch (e) {
        throw new Error('getTeam Error');
    }
}
module.exports.getTeam = getTeam;

const getDivision = async (id = null) => {
    let url = process.env.DIVISION_ENDPOINT

    //query by team id
    if (id) url = `${url}/${id}`

    let body = await getRequest(url)
    return body
}
module.exports.getDivision = getDivision;

const getConference = async (id = null) => {
    let url = process.env.CONFERENCE_ENDPOINT

    //query by team id
    if (id) url = `${url}/${id}`

    let body = await getRequest(url)
    return body
}
module.exports.getConference = getConference;


const getPeople = async (id = null) => {
    try {
        let url = process.env.PEOPLE_ENDPOINT

        //query by team id
        if (id) url = `${url}/${id}`
        // console.log('url: ', url)

        let body = await getRequest(url)
        return body
    } catch (e) {
        throw new Error('getPeople error')
    }
}
module.exports.getPeople = getPeople;

const getPeopleStat = async (id = null, params = {}) => {
    try {
        let url = process.env.PEOPLE_ENDPOINT

        //query by team id
        if (id) url = `${url}/${id}/stats`

        //add modifiers
        let modifiers = querystring.stringify(params);
        if (modifiers.length > 0) url = `${url}?${modifiers}`
        // console.log('url:', url)

        let body = await getRequest(url)
        return body
    } catch (e) {
        throw new Error('getPeopleStat error')
    }
}
module.exports.getPeopleStat = getPeopleStat;


const getPositions = async () => {
    let url = process.env.POSITIONS_ENDPOINT

    let body = await getRequest(url)
    return body
}
module.exports.getPositions = getPositions;

const getStanding = async (params = {}) => {
    let url = process.env.STANDING_ENDPOINT

    //add modifiers
    let modifiers = querystring.stringify(params);
    if (modifiers.length > 0) url = `${url}?${modifiers}`
    // console.log('url:', url)


    let body = await getRequest(url)
    return body
}
module.exports.getStanding = getStanding;


const getSchedule = async (params = {}) => {
    try {
        let url = process.env.SCHEDULE_ENDPOINT

        //add modifiers
        let modifiers = querystring.stringify(params);
        if (modifiers.length > 0) url = `${url}?${modifiers}`
        // console.log('url:', url)


        let body = await getRequest(url)
        return body
    } catch (e) {
        throw new Error('getSchedule Error');
    }
}
module.exports.getSchedule = getSchedule;
