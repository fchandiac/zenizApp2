
const config= require('../config.js')
const server_url = config.serverUrl



function create(tray_id, storage_id, weight){
    let data = { tray_id, storage_id, weight }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'pallets/create', {
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
    return pallet
}



function findAllByTray(tray_id) {
    let data = { tray_id }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'pallets/findAllByTray', {
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
    return pallet
}


function updateTrays(id, trays) {
    let data = { id, trays}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'pallets/updateTrays', {
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
    return pallet
}



function findAll() {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'pallets/findAll', {
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

    return pallet
}


function findOneById(id) {
    let data = { id}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'pallets/findOneById', {
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
    return pallet
}



function updateDisptach(id, dispatch_id) {
    let data = { id, dispatch_id}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'pallets/updateDispatch', {
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
    return pallet
}




function update(id, max, storage_id) {
    let data = { id, max, storage_id }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'pallets/update', {
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
    return pallet
}


function updateMax(id, max) {
    let data = { id, max }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pallet = new Promise((resolve, reject) => {
        fetch(server_url + 'pallets/updateMax', {
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
    return pallet
}

export { findAllByTray, updateTrays, findAll, findOneById, create, updateDisptach, update, updateMax }