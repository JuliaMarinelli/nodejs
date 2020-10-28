const net = require('net');
const users = [];
const messages = [];

const regWisp = new RegExp("^/w [0-9]")

const userConnection = function(users, socket){
    users.forEach(user => {
        if(user !== socket){
            user.write("Un nouvel utilisateur s'est connecte \n\r")
        }
    })
}

const server = net.createServer(function(socket){
    users.push(socket);
    messages.push('');
    userConnection(users, socket)
    console.log('users : ', users.length)
    socket.write("===== CHAT TCP ======== \n\r")
    socket.write("Bienvenu dans le chat TCP WF3 :D \n\r")
    socket.write("Havre fun ! :)\n\r")

    console.log('new user is now connected...')

    socket.on('data', function(data){
        let enter = new Buffer.from([0x0d, 0x0a]);
        users.forEach((user, i) => {
            if(user === socket){
                if(Buffer.compare(data, enter) == false){
                    console.log(messages[i])
                    if(regWisp.test(messages[i])){
                        let wisp = messages[i].split(" ");
                        if(wisp[1] < users.length ){
                            users[wisp[1]].write(messages[i] + "\n")
                        }
                    } else {
                        users.forEach(user => {
                            if(user !== socket){
                                user.write(messages[i] + "\n")
                            }
                        })
                    }
                    messages[i] = "";
                } else {
                    messages[i] += data.toString()
                }
            }
        })
    })
})

server.listen(3000, function(){
    console.log('Server started...', server.address().port, server.address().address)
})