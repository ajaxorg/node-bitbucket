// Zork Server by whiskers75

var cp = require('child_process');
var net = require('telnet');
var util = require('util');
var readline = require('readline');
var sessions = [];
var sockets = [];
var readlines = [];
var fs = require('fs');
var clients = [];
var zorkargs = [process.env.PWD + '/Zork/DATA/ZORK1.DAT', '-Q'];
var saveTrue = [];
var Dropbox = require('dropbox');
cp.spawn('./zork.sh');
var startsWith = function (superstr, str) {
    return !superstr.indexOf(str);
};


net.createServer(function (socket) {
    sockets.push(socket);
    // socket.write('Please authorize Zork Server in your browser, it will open shortly.\n');
    clients[sockets.indexOf(socket)] = client;

    clients[sockets.indexOf(socket)].readdir('/', function (error, entries) {
        // if (error) {
        //     socket.write('DROPBOX ERROR\n');
        //     socket.end();
        // }
        if (entries.join('') === '') {
            // We have no Zork save file
            saveTrue[sockets.indexOf(socket)] = false;
            socket.write('Please place a Zork I save file (ZORK1.sav) in Dropbox/Apps/Zork Server.\n');
            socket.end();
        }
        else {
            socket.write('Zork I save file detected.\n');
            // We have a Zork save file
            saveTrue[sockets.indexOf(socket)] = true;
            socket.write('Loading save file...\n');
            clients[sockets.indexOf(socket)].readFile('ZORK1.sav', function (error, save) {
                if (error) {
                    socket.write('ERROR LOADING SAVE FILE FROM DROPBOX\n');
                    socket.end();
                }
                else {
                    socket.write('Save file loaded into memory.\n');
                    clients[sockets.indexOf(socket)].getUserInfo(function (error, userInfo) {
                        if (error) {
                            socket.write('ERROR GETTING USER INFO\n');
                            socket.end();
                        }
                        else {
                            socket.write('Writing savefile.\n');
                            fs.writeFile('obsolete?.sav', save, function (error) {
                                if (error) {
                                    socket.write('ERROR WRITING SAVEFILE\n');
                                    socket.end();
                                }
                                socket.write('Savefile loaded.\n');
                                readlines[sockets.indexOf(socket)] = readline.createInterface(socket, socket);
                                socket.write('Loading Zork...\n');
                                sessions[sockets.indexOf(socket)] = cp.spawn('frotz', zorkargs);
                                sessions[sockets.indexOf(socket)].stdout.setEncoding('utf8');
                                sessions[sockets.indexOf(socket)].stdout.pipe(socket);
                                sessions[sockets.indexOf(socket)].stderr.pipe(socket);
                                // sessions[sockets.indexOf(socket)].stdin.write('restore\n');
                                // sessions[sockets.indexOf(socket)].stdin.write(clients[sockets.indexOf(socket)].uid + '.sav\n');
                                readlines[sockets.indexOf(socket)].on('line', function (data) {
                                    data = util.inspect(data);
                                    data = data.replace(/[^A-Za-z ]/g, "");
                                    data = data.substr(0, data.length - 2);

                                    // if (startsWith(data, 'restore')) {
                                    //     // You can't do that!
                                    //     socket.write('\n>');
                                    // }
                                    // else {
                                    sessions[sockets.indexOf(socket)].stdin.write(data + '\n');
                                });
                                sessions[sockets.indexOf(socket)].on('exit', function () {
                                    socket.end();
                                });
                            });
                        }
                    });
                }
            });
        }
    }

}).listen(3000);