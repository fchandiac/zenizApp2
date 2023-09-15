
const config= require('../config.js')
const server_url = config.serverUrl

const pallets = require('./pallets')
const packs = require('./packs')

function create(
    producer_id,
    variety_id,
    type_id,
    guide,
    clp,
    usd,
    change,
    money,
    trays_quanty,
    trays_weight,
    gross,
    net,
    impurity_weight,
    to_pay
) {
    let data = {
        producer_id,
        variety_id,
        type_id,
        guide,
        clp,
        usd,
        change,
        money,
        trays_quanty,
        trays_weight,
        gross,
        net,
        impurity_weight,
        to_pay
    }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')

    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/create', {
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
    return reception
}

function findAll() {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/findAll', {
            method: 'GET',
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

    return reception
}



function update(
    id,
    clp,
    usd,
    change,
    money,
    variety,
    type,
    to_pay,
    impurity_weight,
    net) {

    let data = {
        id,
        clp,
        usd,
        change,
        money,
        variety,
        type,
        to_pay,
        impurity_weight,
        net
    }

    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/update', {
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
    return reception

}


function closeReception(id) {
    let data = {id: id, open: false}
    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/updateOpen', {
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
    return reception

}




function findAllBetweenDates(start, end) {
    let data = {start, end}
    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/findAllBetweenDates', {
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
    return reception

}


function findAllByProducerBetweenDates(producer_id, start, end) {
    let data = {producer_id, start, end}
    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/findAllByProducerBetweenDates', {
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
    return reception

}

function updateSettlement(id, settlement_id) {
    let data = {id, settlement_id}
    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/updateSettlement', {
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
    return reception
}



function findOneById(id) {
    let data = { id }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/findOneById', {
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
        }).catch(err => {
            reject(err)
        })
    })
    return reception
}



export { 
    create, 
    findAll, 
    update, 
    closeReception, 
    findAllBetweenDates, 
    findAllByProducerBetweenDates, 
    updateSettlement,
    findOneById
}