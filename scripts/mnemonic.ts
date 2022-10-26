import {mnemonicNew} from 'ton-crypto'

/**
 * Output 24 words mnemonic for config
 */
mnemonicNew(24).then(result => console.log(result))
