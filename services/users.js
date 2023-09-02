
const server_url = "http://localhost:3003/"


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


export { findOneByUser }
