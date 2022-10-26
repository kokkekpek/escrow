import {mnemonicToWalletKey, KeyPair} from 'ton-crypto'
import {WalletContract, TonClient} from 'ton'
import {WalletV4Source} from 'ton/dist/contracts/sources/WalletV4Source'
import config from './../config/config'
import BN from 'bn.js'
import colors from 'colors'

/**
 * Output address and balance of wallet contract that used for deployment
 */
async function main() {
    const key: KeyPair = await mnemonicToWalletKey(config.mnemonic)
    const client: TonClient = new TonClient({endpoint: config.endpoint, apiKey: config.apiKey })
    const wallet: WalletContract = WalletContract.create(client, WalletV4Source.create({ publicKey: key.publicKey, workchain: 0 }))
    const balance: BN = await client.getBalance(wallet.address)
    console.log(config.endpoint)
    console.log(wallet.address)
    console.log(`Balance: ${colors.green(parseInt(balance.toString()).toLocaleString())}`)
}
main().then()