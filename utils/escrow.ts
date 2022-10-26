import {Address, beginCell, Cell, contractAddress, Slice} from 'ton'
import {SmartContract} from 'ton-contract-executor'
import escrowBase64 from '../build/escrow.base64'
import BN from 'bn.js'
import {TvmRunnerAsynchronous} from 'ton-contract-executor/dist/executor/TvmRunner';
import {randomAddress, randomNonce} from './utils'

export enum Operations {
    Transfer = 0,
    Initialization = 1,
    Accept = 2,
    Reject = 3
}

export enum Errors {
    ValueIsNull = 101,
    RoyaltyIsTooBig = 102,
    UnknownOperation = 103,
    InvalidSender = 104
}

export type InitialDataConfig = {
    guarantors: {
        guarantor: Address,
        deadline: BN | number,
        guarantorFallback: Address,
        deadlineFallback: BN | number,
        royalty: BN |number,
    },
    initialized: BN |number,
    nonce: BN | number,
    value: BN |number,
    seller: Address,
    buyer: Address,

}

/**
 * Create initial data Cell from contract
 * @param config {InitialDataConfig}
 * @return Promise<SmartContract>
 */
export function initialData(config: InitialDataConfig): Cell {
    const guarantors: Cell = beginCell()
        .storeAddress(config.guarantors.guarantor)
        .storeUint(config.guarantors.deadline, 64)
        .storeAddress(config.guarantors.guarantorFallback)
        .storeUint(config.guarantors.deadlineFallback, 64)
        .storeUint(config.guarantors.royalty, 128)
        .endCell()
    return beginCell()
        .storeRef(guarantors)
        .storeUint(config.initialized, 1)
        .storeUint(config.nonce, 256)
        .storeUint(config.value, 128)
        .storeAddress(config.seller)
        .storeAddress(config.buyer)
        .endCell()
}

export const defaultInitialDataConfig: InitialDataConfig = {
    initialized: 0,
    nonce: randomNonce(),
    value: 10_000_000,
    seller: randomAddress(),
    buyer: randomAddress(),
    guarantors: {
        guarantor: randomAddress(),
        deadline: Date.now() + 3600,
        guarantorFallback: randomAddress(),
        deadlineFallback: Date.now() + 7200,
        royalty: 1_000_000
    }
}

/**
 * Create smart contract from config and predefined code
 * @param config {InitialDataConfig}
 * @return Promise<SmartContract>
 */
export async function create(config: InitialDataConfig): Promise<SmartContract> {
    const data: Cell = initialData(config)
    const code: Cell = Cell.fromBoc(escrowBase64)[0]
    return await SmartContract.fromCell(code, data)
}

/**
 * Return address of smart contract
 * @param contract {SmartContract}
 * @return {Address}
 */
export function getAddress(contract: SmartContract): Address {
    return contractAddress({ workchain: 0, initialData: contract.dataCell, initialCode: contract.codeCell })
}

/**
 * Generate Cell for operation
 * @return {Cell}
 */
export function transferCell(): Cell {
    return beginCell().storeUint(Operations.Transfer, 32).endCell()
}

/**
 * Generate Cell for operation
 * @return {Cell}
 */
export function initializationCell(): Cell {
    return beginCell().storeUint(Operations.Initialization, 32).endCell()
}

/**
 * Generate Cell for operation
 * @return {Cell}
 */
export function acceptCell(): Cell {
    return beginCell().storeUint(Operations.Accept, 32).endCell()
}

/**
 * Generate Cell for operation
 * @return {Cell}
 */
export function rejectCell(): Cell {
    return beginCell().storeUint(Operations.Reject, 32).endCell()
}

/**
 * Hack
 * Terminate all contract workers that weren't stopped in tests.
 * SmartContract api does not provide method to stop workers
 */
export function terminate(): void {
    // @ts-ignore
    TvmRunnerAsynchronous.getShared().pool.workers.map(worker => worker.terminate())
}

export type InfoResult = {
    initialized: BN,
    nonce: BN,
    value: BN,
    seller: Address,
    buyer: Address,
    guarantor: Address,
    deadline: BN,
    guarantorFallback: Address,
    deadlineFallback: BN,
    royalty: BN,
}

/**
 * Getter
 * @param contract {SmartContract}
 * @return {InfoResult}
 */
export async function info(contract: SmartContract): Promise<InfoResult> {
    const call = await contract.invokeGetMethod('info', [])
    return {
        initialized: call.result[0] as BN,
        nonce: call.result[1] as BN,
        value: call.result[2] as BN,
        seller: (call.result[3] as Slice).readAddress() as Address,
        buyer: (call.result[4] as Slice).readAddress() as Address,
        guarantor: (call.result[5] as Slice).readAddress() as Address,
        deadline: call.result[6] as BN,
        guarantorFallback: (call.result[7] as Slice).readAddress() as Address,
        deadlineFallback: call.result[8] as BN,
        royalty: call.result[9] as BN
    }
}

