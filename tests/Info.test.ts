import {SmartContract} from 'ton-contract-executor'
import {create, defaultInitialDataConfig, info, InfoResult, InitialDataConfig, terminate} from '../utils/escrow'

afterAll(() => {
    terminate()
})

it('info()', async () => {
    const config: InitialDataConfig = {...defaultInitialDataConfig}
    const contract: SmartContract = await create(config)
    const infoResult: InfoResult = await info(contract)
    expect(infoResult.initialized.toString()).toBe(config.initialized.toString())
    expect(infoResult.nonce.toString()).toBe(config.nonce.toString())
    expect(infoResult.value.toString()).toBe(config.value.toString())
    expect(infoResult.seller.toString()).toBe(config.seller.toString())
    expect(infoResult.buyer.toString()).toBe(config.buyer.toString())
    expect(infoResult.guarantor.toString()).toBe(config.guarantors.guarantor.toString())
    expect(infoResult.deadline.toString()).toBe(config.guarantors.deadline.toString())
    expect(infoResult.guarantorFallback.toString()).toBe(config.guarantors.guarantorFallback.toString())
    expect(infoResult.deadlineFallback.toString()).toBe(config.guarantors.deadlineFallback.toString())
    expect(infoResult.royalty.toString()).toBe(config.guarantors.royalty.toString())
})