
const server_url = "http://localhost:3003/"

function create(name, clp, usd, money) {
    let data = { name, clp, usd, money }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const producer = new Promise((resolve, reject) => {
        fetch(server_url + 'varieties/create', {
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
    return producer
}



function findAll() {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const variety = new Promise((resolve, reject) => {
        fetch(server_url + 'varieties/findAll', {
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
    return variety
}

function update(id, name, clp, usd, money) {
    let data = { id, name, clp, usd, money }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const producer = new Promise((resolve, reject) => {
        fetch(server_url + 'varieties/update', {
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
    return producer
}

export { findAll, create, update }