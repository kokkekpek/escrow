import {SmartContract} from 'ton-contract-executor'
import {Address, CellMessage, CommonMessageInfo, InternalMessage} from 'ton'
import {
    acceptCell,
    create,
    defaultInitialDataConfig, Errors,
    getAddress, InitialDataConfig,
    initializationCell,
    rejectCell,
    terminate,
} from '../utils/escrow'
import {SendMsgAction} from 'ton-contract-executor/dist/utils/parseActionList'

const timeout: number = 60000
afterAll(() => {
    terminate()
})

it('Guarantor accept operation', async () => {
    const contract: SmartContract = await create({...defaultInitialDataConfig})
    await contract.sendInternalMessage(new InternalMessage({
        to: getAddress(contract),
        value: 20_000_000,
        bounce: false,
        body: new CommonMessageInfo({body: new CellMessage(initializationCell())})
    }))
    const executionResult = await contract.sendInternalMessage(new InternalMessage({
        to: getAddress(contract),
        from: defaultInitialDataConfig.guarantors.guarantor,
        value: 20_000_000,
        bounce: false,
        body: new CommonMessageInfo({body: new CellMessage(acceptCell())})
    }))
    const sendMsgAction1: SendMsgAction = executionResult.actionList[0] as SendMsgAction
    const sendMsgAction2: SendMsgAction = executionResult.actionList[1] as SendMsgAction
    const sendMsgAction1Destination: Address = sendMsgAction1.message.info.dest as Address
    const sendMsgAction2Destination: Address = sendMsgAction2.message.info.dest as Address
    expect(sendMsgAction1.mode).toBe(1)
    expect(sendMsgAction2.mode).toBe(160)
    expect(sendMsgAction1Destination.equals(defaultInitialDataConfig.seller)).toBeTruthy()
    expect(sendMsgAction2Destination.equals(defaultInitialDataConfig.guarantors.guarantor)).toBeTruthy()
}, timeout)

it('Guarantor reject operation', async () => {
    const contract: SmartContract = await create({...defaultInitialDataConfig})
    await contract.sendInternalMessage(new InternalMessage({
        to: getAddress(contract),
        value: 20_000_000,
        bounce: false,
        body: new CommonMessageInfo({body: new CellMessage(initializationCell())})
    }))
    const executionResult = await contract.sendInternalMessage(new InternalMessage({
        to: getAddress(contract),
        from: defaultInitialDataConfig.guarantors.guarantor,
        value: 20_000_000,
        bounce: false,
        body: new CommonMessageInfo({body: new CellMessage(rejectCell())})
    }))
    const sendMsgAction1: SendMsgAction = executionResult.actionList[0] as SendMsgAction
    const sendMsgAction2: SendMsgAction = executionResult.actionList[1] as SendMsgAction
    const sendMsgAction1Destination: Address = sendMsgAction1.message.info.dest as Address
    const sendMsgAction2Destination: Address = sendMsgAction2.message.info.dest as Address
    expect(sendMsgAction1.mode).toBe(1)
    expect(sendMsgAction2.mode).toBe(160)
    expect(sendMsgAction1Destination.equals(defaultInitialDataConfig.buyer)).toBeTruthy()
    expect(sendMsgAction2Destination.equals(defaultInitialDataConfig.guarantors.guarantor)).toBeTruthy()
}, timeout)

it('Guarantor invalid operation - initialization. Error: UnknownOperation', async () => {
    const contract: SmartContract = await create({...defaultInitialDataConfig})
    await contract.sendInternalMessage(new InternalMessage({
        to: getAddress(contract),
        value: 20_000_000,
        bounce: false,
        body: new CommonMessageInfo({body: new CellMessage(initializationCell())})
    }))
    const executionResult = await contract.sendInternalMessage(new InternalMessage({
        to: getAddress(contract),
        from: defaultInitialDataConfig.guarantors.guarantor,
        value: 20_000_000,
        bounce: false,
        body: new CommonMessageInfo({body: new CellMessage(initializationCell())})
    }))
    expect(executionResult.exit_code).toBe(Errors.UnknownOperation)
}, timeout)

it('Guarantor operation after deadline. Error: InvalidSender', async () => {
    const config: InitialDataConfig = {...defaultInitialDataConfig}
    config.guarantors.deadline = 0
    const contract: SmartContract = await create(config)
    await contract.sendInternalMessage(new InternalMessage({
        to: getAddress(contract),
        value: 20_000_000,
        bounce: false,
        body: new CommonMessageInfo({body: new CellMessage(initializationCell())})
    }))
    const executionResult = await contract.sendInternalMessage(new InternalMessage({
        to: getAddress(contract),
        from: defaultInitialDataConfig.guarantors.guarantor,
        value: 20_000_000,
        bounce: false,
        body: new CommonMessageInfo({body: new CellMessage(acceptCell())})
    }))
    expect(executionResult.exit_code).toBe(Errors.InvalidSender)
}, timeout)