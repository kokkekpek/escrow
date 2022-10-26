import {WalletV4Source} from 'ton/dist/contracts/sources/WalletV4Source'
import {
    Address,
    Cell,
    CellMessage,
    CommonMessageInfo,
    contractAddress,
    InternalMessage,
    SendMode,
    StateInit,
    TonClient,
    WalletContract
} from 'ton'
import {KeyPair, mnemonicToWalletKey} from 'ton-crypto'
import config from './../config/config'
import {initialData, initializationCell} from '../utils/escrow'
import escrow from '../build/escrow.base64'

/**
 * Deploy contract with initialData from config and output contract address
 */
async function deploy() {
    const data: Cell = initialData(config.initialData)
    const code: Cell = Cell.fromBoc(escrow)[0]
    const address: Address = contractAddress({workchain: 0, initialData: data, initialCode: code})
    const key: KeyPair = await mnemonicToWalletKey(config.mnemonic)
    const client: TonClient = new TonClient({endpoint: config.endpoint, apiKey: config.apiKey})
    const wallet: WalletContract = WalletContract.create(client, WalletV4Source.create({
        publicKey: key.publicKey,
        workchain: 0
    }))
    const seqno: number = await wallet.getSeqNo()
    const transfer: Cell = wallet.createTransfer({
        secretKey: key.secretKey,
        seqno: seqno,
        sendMode: SendMode.PAY_GAS_SEPARATLY,
        order: new InternalMessage({
            to: address,
            value: config.deployValue,
            bounce: false,
            body: new CommonMessageInfo({
                stateInit: new StateInit({data: data, code: code}),
                body: new CellMessage(initializationCell())
            })
        })
    })
    await client.sendExternalMessage(wallet, transfer)
    console.log(config.endpoint)
    console.log(address)
}

deploy().then()