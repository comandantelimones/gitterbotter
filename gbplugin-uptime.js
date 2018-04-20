const os = require('os')
const moment = require('moment')
const CommandPlugin = require('./gbp-common').CommandPlugin

class UptimePlugin extends CommandPlugin {
    constructor() {
        super('uptime', '\u23F3', true)
    }

    secondsToHumanReadable(secs) {
        const s_in_d = 60*60*24
        const s_in_h = 60*60
        const s_in_m = 60

        let remainder = secs
        let days = Math.trunc(remainder / s_in_d)
        remainder -= days * s_in_d
        let hours = Math.trunc(remainder / s_in_h)
        remainder -= hours * s_in_h
        let minutes = Math.trunc(remainder / s_in_m)

        let ret = ''
        if (days > 0) {
            ret += `${days} days, `
        }

        if (hours > 0) {
            ret += `${hours} hours, `
        }

        if (minutes > 0) {
            ret += `${minutes} minutes.`
        }

        if (days + hours + minutes == 0) {
            return "just started..."
        }

        return ret
    }

    invoke(ctx, markup) {
        const chatId = ctx.chat.id
        const client = ctx.telegram
        const uptime = os.uptime()

        ctx.reply(
            `\u23F3 ${this.secondsToHumanReadable(uptime)}`,
            { parse_mode: 'Markdown', reply_markup: markup }
        )
    }
}

module.exports = {
    commands: [UptimePlugin],
    UptimePlugin: UptimePlugin
}