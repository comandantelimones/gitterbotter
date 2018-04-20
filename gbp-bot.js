const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const fs = require('fs')
const child_process = require('child_process')
const request = require('request')
const Markdown = require('./gbp-common').Markdown

class Bot {
    constructor(tokenfile, plugins) {
        this.token = Bot.readToken(tokenfile)
        this.bot = new Telegraf(this.token)

        this.fillKeyboard(plugins)
        this.registerPlugins(plugins)

        this.bot.start(ctx => ctx.reply('Ahoy there matey! I\'m alive! It is version two!', this.markup))
        this.bot.on('document', ctx => this.downloadDocument(ctx))
    }

    registerPlugins(plugins) {
        this.plugins = new Map()
        plugins.forEach(plugin => {
            console.log(`[INFO] Adding command ${plugin.command}`)
            if (this.plugins.has(plugin.command)) {
                console.log(`[WARNING] Command already registered: ${plugin.command}`)
            }
            this.plugins.set(plugin.command, plugin)
            this.bot.command('/' + plugin.command, ctx => plugin.invoke(ctx, this.markup))
        })
    }

    fillKeyboard(plugins) {
        let keyboard = []

        plugins.forEach(plugin => {
            if (plugin.simple) {
                keyboard.push(plugin.commandText)
                this.bot.hears(plugin.commandText, ctx => plugin.invoke(ctx, this.markup))
            }
            
        })

        let current = []
        this.keyboard = []
        let idx = 0
        keyboard.forEach((cmd, idx) => {
            current.push(cmd)
            idx++
            if (idx % 3 == 0) {
                this.keyboard.push(current)
                current = []
            }
        });

        if (current.length > 0) {
            this.keyboard.push(current)
        }
        console.log('[INFO] Keyboard formed:', this.keyboard)
        this.markup = Markup.keyboard(this.keyboard).resize().extra()
    }

    downloadDocument(ctx) {
        let fileId = ctx.message.document.file_id
        let fileName = ctx.message.document.file_name

        ctx.reply('Gotcher file, fetching!', this.markup)

        try {
            fs.mkdirSync('/tmp/botcache')
        } catch(e) {
        }

        ctx.telegram.getFileLink(fileId).then(result => {
            const target = `/tmp/botcache/${fileName}`
            request(result)
                .pipe(fs.createWriteStream(target))
                .on('finish', () => {
                    ctx.reply('Upload completed! \uD83D\uDC4D', this.markup)

                    if (fileName == 'bottorio-update.zip') {
                        this.update(ctx, target)
                    }
                })
        })
        console.log('[INFO] Document!', ctx.message)
    }

    update(ctx, source) {
        ctx.reply('Detected an update, applying...', this.markup);
        const target = __dirname
        const source = `/tmp/botcache/${fileName}`
        const commandLine = `unzip -o ${source} -d ${target}/../`
        console.log('[DEBUG] Command line for update is: ', commandLine)
        child_process.exec(commandLine, (err) => {
            ctx.reply('Restarting...', this.markup);
            process.exit(0)
        })
    }

    start() {
        this.bot.startPolling()
    }

    static readToken(tokenfile) {
        const token = fs.readFileSync(tokenfile, { encoding: 'utf8' })
        return token
    }
}

module.exports = {
    Bot: Bot
}
