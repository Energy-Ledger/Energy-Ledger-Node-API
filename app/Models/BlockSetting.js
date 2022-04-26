'use strict'

const Model = use('Model')

class BlockSetting extends Model {
    static get table()
    {
        return 'block_setting';
    }
}

module.exports = BlockSetting
