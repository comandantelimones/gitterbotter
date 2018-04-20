let glob = require('glob-fs')({})
let path = require('path')

class PluginLoader {
    constructor() {

    }

    load() {
        let files = glob.readdirSync('gbplugin-*.js')
        console.log('Plugin files: ', files)
        let sparse = files.map(file => {
            const mod = require(path.join(__dirname, file.slice(0, -3)))
            return mod.commands
        });

        return [].concat.apply([], sparse)
    }
}

module.exports = {
    PluginLoader
}