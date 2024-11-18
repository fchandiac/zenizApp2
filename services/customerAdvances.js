const config= require('../config.js')
const server_url = config.serverUrl

// router.post('/customerAdvances/create', (req, res) => {
//     customerAdvances.create(
//         req.body.customer_id,
//         req.body.amount,
//         req.body.description

//     )
//         .then(data => {
//             res.json(data)
//         })
//         .catch(err => {
//             res.json(err)
//         })
// })

function create(customer_id, amount, description) {
    let data = {customer_id, amount, description}
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const advance = new Promise((resolve, reject) => {
        fetch(server_url + 'customerAdvances/create', {
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
    return advance
}

export {create}