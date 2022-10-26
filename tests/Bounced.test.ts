import {SmartContract} from 'ton-contract-executor'
import {CellMessage, CommonMessageInfo, InternalMessage} from 'ton'
import {
    acceptCell,
    create,
    defaultInitialDataConfig,
    getAddress,
    initializationCell,
    terminate
} from '../utils/escrow'

const timeout: number = 60000
afterAll(() => {
    terminate()
})

it('Message with bounced flag before initialization', async () => {
    const contract: SmartContract = await create({...defaultInitialDataConfig})
    const executionResult = await contract.sendInternalMessage(new InternalMessage({
        to: getAddress(contract),
        value: 20_000_000,
        bounce: false,
        bounced: true,
        body: new CommonMessageInfo({body: new CellMessage(initializationCell())})
    }))
    expect(executionResult.exit_code).toBe(0)
    expect(executionResult.actionList.length).toBe(0)
}, timeout)

it('Message with bounced flag after initialization', async () => {
    const contract: SmartContract = await create({...defaultInitialDataConfig})
    await contract.sendInternalMessage(new InternalMessage({
        to: getAddress(contract),
        value: 20_000_000,
        bounce: false,
        body: new CommonMessageInfo({body: new CellMessage(initializationCell())})
    }))
    const executionResult = await contract.sendInternalMessage(new InternalMessage({
        to: getAddress(contract),
        value: 20_000_000,
        bounce: false,
        bounced: true,
        body: new CommonMessageInfo({body: new CellMessage(acceptCell())})
    }))
    expect(executionResult.exit_code).toBe(0)
    expect(executionResult.actionList.length).toBe(0)
}, timeout)