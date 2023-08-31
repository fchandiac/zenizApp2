
const server_url = "http://localhost:3003/"

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

export { findAll}