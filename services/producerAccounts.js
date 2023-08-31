const server_url = "http://localhost:3003/"



function create(producer_id, credit, debit, balance, reference_id, reference_type, description) {
    let data = { producer_id, credit, debit, balance, reference_id, reference_type, description }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const account = new Promise((resolve, reject) => {
        fetch(server_url + 'producerAccounts/create', {
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
    return account
}

function findAllByProducerId(producer_id) {
    let data = { producer_id }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const account = new Promise((resolve, reject) => {
        fetch(server_url + 'producerAccounts/findAllByProducerId', {
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
    return account
}

function producerAccountBalance(producer_id) {

    const balance = async (producer_id) => {
        const producerAccount = await findAllByProducerId(producer_id)
        let curentBalance = 0

        if (producerAccount.length > 0) {
            let sumCredits = producerAccount.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.credit;
            }, 0)

            let sumDebits = producerAccount.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.debit;
            }, 0)

            curentBalance = sumCredits - sumDebits

        }
        return curentBalance
    }

    return balance(producer_id)

}




export { create, findAllByProducerId, producerAccountBalance }