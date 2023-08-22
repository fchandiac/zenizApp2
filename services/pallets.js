const server_url = "http://localhost:3003/"




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

export { findAllByTray, updateTrays, findAll, findOneById }