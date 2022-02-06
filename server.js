const EventEmitter = require('events')

class Server extends EventEmitter{
    constructor(client){
        super()
        process.nextTick(() => {
            this.emit('response', 'Type (help | ls) to get list of all commands...')
        })
        this.task = {}
        this.taskId = 0

        client.on('command', (command, args) => {
           switch(command){
               case 'add':
               case 'help':
               case 'ls':
               case 'delete':
                   this[command](args);
                   break;
                   default:
                this.emit('response', 'Unknown command')
           }
        })
    }
    // add help delete ls
    add(args){
        this.task[this.taskId] = args.join(' ')
        this.emit('response', `Added task ${this.taskId}`)
        this.taskId++
    }
    help(){
        this.emit('response', `Available commands:
        add task
        ls
        delete :id`)
    }
    delete(args){
        delete this.task[args[0]]
        this.emit('response', `Deleted task ${args[0]}`)
    }
    taskString(){
        return Object.keys(this.task).map(key => {
            return `${key}: ${this.task[key]}`
        }).join('\n')
    }
    ls(){
        this.emit('response', `Tasks:\n${this.taskString()}`)
    }
}

module.exports = (client) => new Server(client)