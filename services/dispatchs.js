
const config = require('../config.js')
const server_url = config.serverUrl


function create(
    customer_id,
    guide,
    clp,
    usd,
    change,
    money,
    pallets_quanty,
    pallets_weight,
    impurity_weight,
    gross,
    net,
    to_pay,
    open
) {
    let data = {
        customer_id,
        guide,
        clp,
        usd,
        change,
        money,
        pallets_quanty,
        pallets_weight,
        impurity_weight,
        gross,
        net,
        to_pay,
        open,

    }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const dispatch = new Promise((resolve, reject) => {
        fetch(server_url + 'dispatchs/create', {
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
    return dispatch
}

function findAll() {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const dispatch = new Promise((resolve, reject) => {
        fetch(server_url + 'dispatchs/findAll', {
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

    return dispatch
}

function findAllBetweenDate(start, end) {
    let data = {
        start,
        end
    }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const dispatch = new Promise((resolve, reject) => {
        fetch(server_url + 'dispatchs/findAllBetweenDate', {
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

    return dispatch
}

function close(id) {
    let data = {
        id
    }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const dispatch = new Promise((resolve, reject) => {
        fetch(server_url + 'dispatchs/updateClose', {
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

    return dispatch
}



function findOneById(id) {
    let data = {
        id
    }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const dispatch = new Promise((resolve, reject) => {
        fetch(server_url + 'dispatchs/findOneById', {
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

    return dispatch
}

function update(
    id,
    clp,
    usd,
    change,
    money,
    impurity_weight,
    to_pay,
    net,
    gross
) {
    let data = {
        id,
        clp,
        usd,
        change,
        money,
        impurity_weight,
        to_pay,
        net,
        gross
    }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const dispatch = new Promise((resolve, reject) => {
        fetch(server_url + 'dispatchs/update', {
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

    return dispatch
}
export { create, findAll, findAllBetweenDate, close, findOneById, update }