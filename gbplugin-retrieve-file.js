const fs = require('fs')
const CommandPlugin = require('./gbp-common').CommandPlugin

class RetrieveFileCommand extends CommandPlugin {
    constructor() {
        super('retrieve', '\ud83d\uDCC2', false)
    }
    
    invoke(ctx, markup) {
        console.log('[debug] doc retrieval', ctx.message)
        const path = ctx.message.text.replace("/retrieve ", "")
        if (fs.existsSync(path)) {
            let stats = fs.statSync(path)
            if (stats.isFile()) {
                ctx.replyWithDocument({ source: path }, markup)
            } else {
                ctx.reply('Not a file, sorry :(', markup)
            }
        } else {
            ctx.reply('Oops, file does not exist!', markup)
        }
    }
}

module.exports = {
    commands: [RetrieveFileCommand],
    RetrieveFileCommand: RetrieveFileCommand
}