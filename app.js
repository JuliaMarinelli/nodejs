const net = require('net');
const users = [];
const messages = [];
let admin;

const regWisp = new RegExp("^/w [0-9]")
const regKick = new RegExp("^/kick [0-9]")

const userConnection = function(users, socket){
    users.forEach(user => {
        if(user !== socket && user !== null){
            user.write("Un nouvel utilisateur s'est connecte \n\r")
        }
    })
}

const server = net.createServer(function(socket){
    users.push(socket);
    if(!admin){
        admin = socket
    }
    messages.push("");
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
                        console.log("WISP !")
                        let wisp = messages[i].split(" ");
                        if(wisp[1] < users.length && users[wisp[1]] !== null ){
                            users[wisp[1]].write(i + " : " + regWisp.exec(messages[i])[1] + "\n\r")
                        } else {
                            user.write("Le destinataire n'est pas connecté\n\r")
                        }
                    } else if(regKick.test(messages[i])){
                        if(user === admin){
                            console.log("Kick !")
                            let kick = messages[i].split(" ");
                            if(kick[1] < users.length && users[kick[1]] !== null ){
                                console.log("Client " + kick[i] + " a été kick par client " + i + "\n\r")
                                users[kick[1]].destroy();
                            }   else {
                                user.write("L'utilisateur à kick n'est pas connecté\n\r")
                            }
                        } else {
                            console.log("Permission de kick non accordée")
                        }
                    } else {
                        users.forEach(user => {
                            if(user !== socket && user !== null){
                                user.write(i + " : " + messages[i] + "\n\r")
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

    socket.on('close', function(hadError){
        users.forEach((user, i) => {
            if(user === socket) {
                console.log("Client " + i + " disconnected")
                users[i] = null
            } 
        })
    })
})

server.listen(3000, function(){
    console.log('Server started...', server.address().port, server.address().address)
})