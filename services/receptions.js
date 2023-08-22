const server_url = "http://localhost:3003/"

const pallets = require('./pallets')
const packs = require('./packs')

function create(
    producer_id,
    variety_id,
    type_id,
    guide,
    clp,
    usd,
    change,
    money,
    trays_quanty,
    trays_weight,
    gross,
    net
) {
    let data = {
        producer_id,
        variety_id,
        type_id,
        guide,
        clp,
        usd,
        change,
        money,
        trays_quanty,
        trays_weight,
        gross,
        net
    }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')

    const reception= new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/create', {
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
    return reception
}

function findAll() {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/findAll', {
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

    return reception
}






export { create, findAll }