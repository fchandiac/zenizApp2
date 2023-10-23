const config= require('../config.js')
const server_url = config.serverUrl

function create(
    name,
    delete_,
    edit,
    settlement,
    new_reception,
    new_dispatch,
    close_reception,
    close_dispatch,
    advance,
    users
) {
    let data = {
        name,
        delete_,
        edit,
        settlement,
        new_reception,
        new_dispatch,
        close_reception,
        close_dispatch,
        advance,
        users
    }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const profile_ = new Promise((resolve, reject) => {
        fetch(server_url + 'profiles/create', {
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
        }).catch(err => {
            reject(err)
        })
    }

    )
    return profile_

}

function findAll(){
    const profiles_ = new Promise((resolve, reject) => {
        fetch(server_url + 'profiles/findAll', {
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
        }).catch(err => {
            reject(err)
        })
    }

    )
    return profiles_
}

export { create, findAll}
