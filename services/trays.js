
const server_url = "http://localhost:3003/"


function create(name, weight) {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, weight })
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
    return tray
}

function findAll() {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/findAll', {
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

    return tray
}



function update(id, name, weight) {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name, weight })

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

    return tray
}

function updateStock(id, stock) {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/updateStock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, stock })
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

    return tray
}


export {
    findAll,
    create,
    update,
    updateStock
}