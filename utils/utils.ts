import {Address} from 'ton'
import crypto from 'crypto'
import BN from 'bn.js'

/**
 * Generate random address
 * @param [workchain=0] {number}
 * @return {Address}
 */
export function randomAddress(workchain: number = 0): Address {
    const buffer: Buffer = crypto.randomBytes(32)
    return new Address(workchain, buffer)
}

/**
 * Generate random uint256 number
 * @return {BN}
 */
export function randomNonce(): BN {
    return new BN(crypto.randomBytes(32))
}