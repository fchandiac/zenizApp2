
const config= require('../config.js')
const server_url = config.serverUrl



function create(producer_id, credit, debit, balance, reference_id, reference_type, description) {
    let data = { producer_id, credit, debit, balance, reference_id, reference_type, description }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const account = new Promise((resolve, reject) => {
        fetch(server_url + 'producerAccounts/create', {
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
    return account
}

function findAllByProducerId(producer_id) {
    let data = { producer_id }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const account = new Promise((resolve, reject) => {
        fetch(server_url + 'producerAccounts/findAllByProducerId', {
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
    return account
}

function producerAccountBalance(producer_id) {

    const balance = async (producer_id) => {
        const lastAccount = await findLastByProducerId(producer_id)
        return lastAccount == null ? 0 : lastAccount.balance
    }

    return balance(producer_id)

}




function findLastByProducerId(producer_id) {
    let data = { producer_id }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const account = new Promise((resolve, reject) => {
        fetch(server_url + 'producerAccounts/findLastByProducerId', {
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
    return account
}




function findAllByProducerIdBetweenDates(producer_id, start, end) {
    let data = { producer_id, start, end }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const account = new Promise((resolve, reject) => {
        fetch(server_url + 'producerAccounts/findAllByProducerIdBetweenDates', {
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
    return account
}

function findLastByProducerIdBetweenDates(producer_id, start, end) {
    let data = { producer_id, start, end}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const account = new Promise((resolve, reject) => {
        fetch(server_url + 'producerAccounts/findLastByProducerIdBetweenDates', {
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
    return account
}

function findFirstByProducerIdBetweenDate(producer_id, start, end) {
    let data = { producer_id, start, end}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const account = new Promise((resolve, reject) => {
        fetch(server_url + 'producerAccounts/findFirstByProducerIdBetweenDate', {
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
    return account
}



export { 
    create, 
    findAllByProducerId, 
    producerAccountBalance, 
    findLastByProducerId,
    findAllByProducerIdBetweenDates,
    findLastByProducerIdBetweenDates,
    findFirstByProducerIdBetweenDate
}