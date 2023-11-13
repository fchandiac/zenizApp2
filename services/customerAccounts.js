
const config= require('../config.js')
const server_url = config.serverUrl



function findLastByCustomerId(customer_id) {
    let data = {customer_id}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pack = new Promise((resolve, reject) => {
        fetch(server_url + 'customerAccounts/findLastByCustomerId', {
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


function create(customer_id, credit, debit, balance, reference_id, reference_type, description) {
    let data = {
        customer_id,
        credit,
        debit,
        balance,
        reference_id,
        reference_type,
        description
    }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const customerAccount = new Promise((resolve, reject) => {
        fetch(server_url + 'customerAccounts/create', {
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
    return customerAccount
}


function findAll() {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const customerAccounts = new Promise((resolve, reject) => {
        fetch(server_url + 'customerAccounts/findAll', {
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
    return customerAccounts
}



function findAllByCustomerId(customer_id) {
    let data = {customer_id}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const customerAccounts = new Promise((resolve, reject) => {
        fetch(server_url + 'customerAccounts/findAllByCustomerId', {
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
    return customerAccounts
}



export { findLastByCustomerId, create, findAll, findAllByCustomerId}