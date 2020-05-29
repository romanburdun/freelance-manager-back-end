const {platformOneId, platformDeleteId} = require('./ids.fixture')


const platformOne = {
    _id: platformOneId,
    platformName: 'Local'
}

const platformDelete = {
    _id: platformDeleteId,
    platformName: 'Delete platform'
}

module.exports = {
    platformOne,
    platformDelete
}
