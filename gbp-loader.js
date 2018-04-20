let glob = require('glob-fs')({})

class PluginLoader {
    constructor() {

    }

    load() {
        let files = glob.readdirSync('./gbplugin-*.js')
        console.log('Plugin files: ', files.map(f => f.relative))
        let sparse = files.map(file => {
            const mod = require(file.relative)
            return mod.commands
        });

        return [].concat.apply([], sparse)
    }
}

module.exports = {
    PluginLoader
}