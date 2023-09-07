const options = {
    'viewbox': 4500,
    'pixelDensity': 20
}

class FakeSocket {
    constructor() {
        this.events = []
        this.readyState = 1
        this.override()
    }
    override() {
        for(var i = 0; i < 2; i++) {
            var socket = sockets[i]
            if (socket?.readyState == 1) sockets[i] = this
        }
    }
    spoofPacket(data) {
        var encoder = new TextEncoder()
        var view = encoder.encode(data)
        var uint8Array = new Uint8Array(view)
        var buffer = Module._malloc(uint8Array.length)
        writeArrayToMemory(uint8Array, buffer)
        this.events.push([buffer, uint8Array.length, Module.getClientTime()])
    }
    send(data) {}
    close() {}
}

class SpoofBuilder {
    joinGame(obj) {
        Object.clean(obj)
        return [
            "a",
            obj.id || Math.floor(Math.random() * 120),
            obj.team || 2,
            0,
            obj.x || 0, 
            obj.y || 0,
            25, 0, 100, 100, 0, 0, 8, 8, 0, 0, 100,
            obj.name || "Guest " + Math.floor(Math.random() * 1000),
            obj.invis || 1,
            100, 100
        ].join(",")
    }
    killEntity(obj) {
        Object.clean(obj)
        return [
            "e",
            obj.id,
        ].join(",")
    }
    leaderboardUpdate(obj) {
        return [
            "w",
            ...obj.players.map(player => player.join("."))
        ].join(",")
    }
    zoomOut(obj) {
        return [
            "v",
            obj.id,
            obj.vx,
            obj.vy
        ].join(",")
    }
    updatePoint(obj) {
        return [
            "pu",
            obj.id,
            obj.captureProgress,
            obj.team
        ].join(",")
    }
}

Object.clean = function(obj) {
    Object.keys(obj).forEach(key => {
        obj[key] = obj[key].toString()
    })
}

const socket = new FakeSocket()
const spoofBuilder = new SpoofBuilder()
socket.spoofPacket(spoofBuilder.joinGame({name: "BadApple", id: 120, team: 1, x: 0, y: 0, invis: 0}))
for (var i = 0; i <= 120; i++) {
    socket.spoofPacket(spoofBuilder.killEntity({id: i}))
}
socket.spoofPacket(spoofBuilder.leaderboardUpdate({players: [[120, "BadApple", 4600, 1337, 1]]}))
socket.spoofPacket(spoofBuilder.zoomOut({id: 120, vx: options.viewbox, vy: options.viewbox}))
for (var i = 0; i <= 19; i++) {
    socket.spoofPacket(spoofBuilder.updatePoint({id: i, captureProgress: 0, team: 3}))
}


const pixelLocations = []
var height = Math.round(options.viewbox / 9 * 16)
var width = options.viewbox
var pixelDensity = options.pixelDensity
for (var x = 0; x < width; x += pixelDensity) {
    var row = []
    for (var y = 0; y < height; y += pixelDensity) {
        row.push(0)
    }
    pixelLocations.push(row)
}

