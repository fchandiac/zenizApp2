const server_url = "http://localhost:3003/"


function create(producer_id, amount, description) {
    let data = {producer_id, amount, description}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pack = new Promise((resolve, reject) => {
        fetch(server_url + 'advances/create', {
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
    return pack
}



function findAllBetweenDates(start, end) {
    let data = {start, end}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pack = new Promise((resolve, reject) => {
        fetch(server_url + 'advances/findAllBetweenDates', {
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
    return pack
}

export { create, findAllBetweenDates }