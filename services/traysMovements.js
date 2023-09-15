
const config= require('../config.js')
const server_url = config.serverUrl

function create(tray_id, producer_id, reception_id, quanty, type, balance, description) {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'traysMovements/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tray_id, producer_id, reception_id, quanty, type, balance, description })
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
        fetch(server_url + 'traysMovements/findAll', {
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

function findAllByTrayBetweenDate(tray_id, start, end) {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'traysMovements/findAllByTrayBetweenDate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tray_id, start, end })
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

function findLastByTrayBetweenDate(tray_id, start, end) {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'traysMovements/findLastByTrayBetweenDate', {    
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tray_id, start, end })
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

function findFirstByTrayBetweenDate(tray_id, start, end) {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'traysMovements/findFirstByTrayBetweenDate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tray_id, start, end })
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



function findOneLastByTray(tray_id) {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'traysMovements/findOneLastByTray', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tray_id })
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



function findAllByTrayByProducerBetweenDate(tray_id, producer_id, start, end) {
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'traysMovements/findAllByTrayByProducerBetweenDate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tray_id, producer_id, start, end })
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



function findAllByProducerByTray(tray_id, producer_id) {
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'traysMovements/findAllByProducerByTray', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tray_id, producer_id })
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
    create,
    findAll,
    findAllByTrayBetweenDate,
    findLastByTrayBetweenDate,
    findFirstByTrayBetweenDate,
    findOneLastByTray,
    findAllByTrayByProducerBetweenDate,
    findAllByProducerByTray

}