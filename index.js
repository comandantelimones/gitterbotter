
const PluginLoader = require('./gbp-loader')
const Bot = require('./gbp-bot').Bot

const tokenfile = __dirname + '/tokenfile'

let loader = new PluginLoader()
let classes = loader.load()
let plugins = classes.map(cls => new cls())

const bot = new Bot(tokenfile, plugins)

bot.start()
