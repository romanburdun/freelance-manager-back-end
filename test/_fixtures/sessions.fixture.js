const {sessionOneId, sessionTwoId, sessionThreeId, sessionFourId, userOneId} = require('./ids.fixture');

let sessionOne = {
    _id: sessionOneId,
    sessionDate: new Date(),
    sessionStart: new Date(),
    sessionEnd: new Date(),
    user: userOneId
}


let sessionTwo = {
    _id: sessionTwoId,
    sessionDate: new Date(),
    sessionStart: new Date(),
    sessionEnd: new Date(),
    user: userOneId
}

let sessionThree = {
    _id: sessionThreeId,
    sessionDate: new Date(),
    sessionStart: new Date(),
    sessionEnd: new Date(),
    user: userOneId
}

let sessionFour = {
    _id: sessionFourId,
    sessionDate: new Date(),
    sessionStart: new Date(),
    sessionEnd: new Date(),
    user: userOneId
}

module.exports = {
    sessionOne,
    sessionTwo,
    sessionThree,
    sessionFour,
}
