
const server_url = "http://localhost:3003/"


function create(rut, name, phone, mail, address){
    let data = { rut, name, phone, mail, address}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const producer = new Promise((resolve, reject) => {
        fetch(server_url + 'producers/create', {
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
    const producer = new Promise((resolve, reject) => {
        fetch(server_url + 'producers/findAll', {
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

    return producer
}



function findOneById(id) {
    let data = { id }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const producer = new Promise((resolve, reject) => {
        fetch(server_url + 'producers/findOneById', {
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


function update(id, rut, name, phone, mail, address) {
    let data = { id, rut, name, phone, mail, address }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const producer = new Promise((resolve, reject) => {
        fetch(server_url + 'producers/update', {
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


export { findAll, create, findOneById, update }