const child_process = require('child_process')
import CommandPlugin from 'gbp-common'

class VNStatImagePlugin extends CommandPlugin {
    constructor() {
        super('vnstat-hourly', '\uD83D\uDCCA')
    }

    invoke(ctx, markup) {
        const chatId = ctx.chat.id
        const client = ctx.telegram
        child_process.exec('vnstati -h -o /tmp/summary.png', () => {
            console.log('[INFO] Done creating graphical summary! Sending over.')

            client.sendChatAction('upload_photo')
            client.sendPhoto(
                chatId,
                { source: '/tmp/summary.png' },
                { reply_markup: markup }
            )
        })
    }
}

export default {
    commands: [VNStatImagePlugin],
    VNStatImagePlugin: VNStatImagePlugin
}