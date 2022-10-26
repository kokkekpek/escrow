import {Address, Cell, contractAddress} from 'ton'
import escrow from './../build/escrow.base64'
import config from './../config/config'
import {initialData} from '../utils/escrow'

/**
 * Output contract address that deployed with initialData from config
 */
async function deploy() {
    const data: Cell = initialData(config.initialData)
    const code: Cell = Cell.fromBoc(escrow)[0]
    const address: Address = contractAddress({workchain: 0, initialData: data, initialCode: code})
    console.log(address)
}

deploy().then()