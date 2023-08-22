const server_url = "http://localhost:3003/"


function create(pallet_id, tray_id, reception_id, quanty, trays_weight, impurity, impurity_weight, gross, net) {
    let data = {pallet_id, tray_id, reception_id, quanty, trays_weight, impurity, impurity_weight, gross, net}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const pack = new Promise((resolve, reject) => {
        fetch(server_url + 'packs/create', {
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

export { create }