
const config= require('../config.js')
const server_url = config.serverUrl


function findOneByUser(user) {
    let data = { user }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const user_ = new Promise((resolve, reject) => {
        fetch(server_url + 'users/findOneByUser', {
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
    })
    return user_
}


function create(user, pass, name, mail, profile_id){
    
    let data = { user, pass, name, mail, profile_id }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const user_ = new Promise((resolve, reject) => {
        fetch(server_url + 'users/create', {
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
    return user_
    
}

function findAll() {
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const users_ = new Promise((resolve, reject) => {
        fetch(server_url + 'users/findAll', {
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
    })
    return users_
}





function updatePass(id, pass) {
    let data = { id, pass }
    // let server_url = ipcRenderer.sendSync('server-url', 'sync')
    const user_ = new Promise((resolve, reject) => {
        fetch(server_url + 'users/updatePass', {
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
    return user_
    
}



export { findOneByUser, create, findAll, updatePass }
