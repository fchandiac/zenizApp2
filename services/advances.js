
const config= require('../config.js')
const server_url = config.serverUrl

function create(producer_id, amount, description) {
    let data = {producer_id, amount, description}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pack = new Promise((resolve, reject) => {
        fetch(server_url + 'advances/create', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return pack
}



function findAllBetweenDates(start, end) {
    let data = {start, end}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pack = new Promise((resolve, reject) => {
        fetch(server_url + 'advances/findAllBetweenDates', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return pack
}



function findOneById(id) {
    let data = {id}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pack = new Promise((resolve, reject) => {
        fetch(server_url + 'advances/findOneById', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return pack
}



function findAllByProducerIdBetweenDates(producer_id, start, end) {
    let data = {producer_id, start, end}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pack = new Promise((resolve, reject) => {
        fetch(server_url + 'advances/findAllByProducerIdBetweenDates', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return pack
}


// router.post('/advances/updateCreatedAt', (req, res) => {
//     advances.updateCreatedAt(
//         req.body.id,
//         req.body.createdAt
//     )
//     .then(data => {
//         res.json(data)
//     })
//     .catch(err => {
//         res.json(err)
//     })
// })


function updateCreatedAt(id, createdAt) {
    let data = {id, createdAt}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pack = new Promise((resolve, reject) => {
        fetch(server_url + 'advances/updateCreatedAt', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return pack
}


export { create, findAllBetweenDates, findOneById, findAllByProducerIdBetweenDates, updateCreatedAt }