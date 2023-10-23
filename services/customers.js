
const config= require('../config.js')
const server_url = config.serverUrl

function findAll() {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const customer = new Promise((resolve, reject) => {
        fetch(server_url + 'customers/findAll', {
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

    return customer
}



function create(rut, name, address, phone, email) {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    let data = {rut, name, address, phone, email}
    const customer = new Promise((resolve, reject) => {
        fetch(server_url + 'customers/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
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

    return customer
}
            
        

export { findAll, create }