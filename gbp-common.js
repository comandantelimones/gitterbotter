//------------------------------------------------------------------------------
class Markdown {
    static it(text) {
        return '_' + text + '_'
    }

    static bl(text) {
        return '*' + text + '*'
    }

    static cd(text) {
        return '```\n' + text + '\n```'
    }
}

//------------------------------------------------------------------------------
class CommandPlugin {
    constructor(command, icon = '', simple = false) {
        this.command = command
        this.icon = icon
        this.simple = simple
    }

    get commandText() {
        return `${this.icon} ${this.command}`
    }

    invoke(ctx, markup) {
        ctx.reply('**Generic command**')
    }
}

//------------------------------------------------------------------------------
module.exports = {
    Markdown: Markdown,
    CommandPlugin: CommandPlugin
}