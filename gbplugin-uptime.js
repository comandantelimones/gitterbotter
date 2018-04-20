const os = require('os')
const moment = require('moment')
const CommandPlugin = require('./gbp-common').CommandPlugin

class UptimePlugin extends CommandPlugin {
    constructor() {
        super('uptime', '\u23F3')
    }

    secondsToHumanReadable(secs) {
        let remainder = secs
        let days = remainder / (60*60*24)
    }

    invoke(ctx, markup) {
        const chatId = ctx.chat.id
        const client = ctx.telegram
        const uptime = os.uptime()

        const duration = moment.duration(uptime, 'seconds')
        ctx.reply(
            `\u23F3 ${duration.humanize()}`,
            { parse_mode: 'Markdown', reply_markup: markup }
        )
    }
}

module.exports = {
    commands: [UptimePlugin],
    UptimePlugin: UptimePlugin
}