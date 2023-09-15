const config= require('../config.js')
const server_url = config.serverUrl


function create(table, action, description, user_id) {
    let data = {
        table,
        action,
        description,
        user_id
    }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const record = new Promise((resolve, reject) => {
        fetch(server_url + 'records/create', {
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
    return record
}



function findAll() {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const records = new Promise((resolve, reject) => {
        fetch(server_url + 'records/findAll', {
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
    return records
}


export { create, findAll}