const fs = require('fs')
const child_process = require('child_process')
const CommandPlugin = require('./gbp-common').CommandPlugin
const Markdown = require('./gbp-common').Markdown

class VNStatPlugin extends CommandPlugin {
    constructor() {
        super('vnstat', '\ud83d\udcca', true)
    }

    invoke(ctx, markup) {
        const chatId = ctx.chat.id
        const client = ctx.telegram
        child_process.exec('vnstat --json m', (err, stdout) => {
            console.log(`[INFO] Got result: ${stdout}`)
            const result = JSON.parse(stdout)
            client.sendMessage(
                chatId,
                this.formatResult(result),
                { parse_mode: 'Markdown', reply_markup: markup }
            )
        })
        // TODO: Implement ACL
    }

    formatResult(result) {
        const md = Markdown
        let message = `\uD83D\uDCCB ${md.bl("Server traffic stats")}\n`
        result.interfaces.forEach(iface => {
            message += `  Interface: ${md.bl(iface.id)}\n`
            const total = iface.traffic.total
            message += `  Total (Mb): ${this.trafficMessage(total.rx, total.tx)}\n`
            const months = iface.traffic.months
            months.forEach(month => {
                message += `  ${month.date.year}-${month.date.month}: ${this.trafficMessage(month.rx, month.tx)}\n`
            })
        })

        return message
    }

    trafficMessage(rx, tx) {
        const md = Markdown
        const arx = rx / 1024
        const atx = tx / 1024
        const atrx = arx + atx
        const tarx = arx.toFixed(1)
        const tatx = atx.toFixed(1)
        const tatrx = atrx.toFixed(1)
        return `\u23EC ${md.bl(tarx)} | \u23EB ${md.bl(tatx)} | \u2195 ${md.bl(tatrx)}`
    }
}

module.exports = {
    commands: [VNStatPlugin],
    VNStatPlugin: VNStatPlugin
}