
const server_url = "http://localhost:3003/"

function create(name) {
    let data = { name }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const type = new Promise((resolve, reject) => {
        fetch(server_url + 'types/create', {
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
    return type
}


function findAll() {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const variety = new Promise((resolve, reject) => {
        fetch(server_url + 'types/findAll', {
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

export { findAll, create}