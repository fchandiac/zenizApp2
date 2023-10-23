
const config= require('../config.js')
const server_url = config.serverUrl


function findAll() {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const storage = new Promise((resolve, reject) => {
        fetch(server_url + 'storages/findAll', {
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

    return storage
}



function create(name) {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const storage = new Promise((resolve, reject) => {
        fetch(server_url + 'storages/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
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

    return storage
}

function update(id, name) {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const storage = new Promise((resolve, reject) => {
        fetch(server_url + 'storages/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, name: name })
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

    return storage
}




export { findAll, create, update}