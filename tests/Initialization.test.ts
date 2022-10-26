import {SmartContract} from 'ton-contract-executor'
import {Address, CellMessage, CommonMessageInfo, InternalMessage} from 'ton'
import {
    create,
    defaultInitialDataConfig,
    getAddress,
    info,
    InfoResult,
    InitialDataConfig,
    terminate,
    initializationCell, Errors
} from '../utils/escrow'
import {ReserveCurrencyAction, SendMsgAction} from 'ton-contract-executor/dist/utils/parseActionList'

const timeout: number = 60000
afterAll(() => {
    terminate()
})

it('Initialization', async () => {
    const contract: SmartContract = await create({...defaultInitialDataConfig})
    const executionResult = await contract.sendInternalMessage(new InternalMessage({
        from: defaultInitialDataConfig.buyer,
        to: getAddress(contract),
        value: 20_000_000,
        bounce: false,
        body: new CommonMessageInfo({body: new CellMessage(initializationCell())})
    }))
    const reserveAction: ReserveCurrencyAction = executionResult.actionList[0] as ReserveCurrencyAction
    const sendMsgAction: SendMsgAction = executionResult.actionList[1] as SendMsgAction
    const sendMsgActionDestination: Address = sendMsgAction.message.info.dest as Address
    expect(reserveAction.type).toBe('reserve_currency')
    expect(sendMsgAction.type).toBe('send_msg')
    expect(sendMsgAction.mode).toBe(128)
    expect(sendMsgActionDestination.equals(defaultInitialDataConfig.buyer)).toBeTruthy()

    const infoResult: InfoResult = await info(contract)
    expect(infoResult.initialized.toNumber()).toBe(1)
}, timeout)

it('Initialization. Error: ValueIsNull', async () => {
    const config: InitialDataConfig = {...defaultInitialDataConfig}
    config.value = 0
    const contract: SmartContract = await create(config)
    const executionResult = await contract.sendInternalMessage(new InternalMessage({
        to: getAddress(contract),
        value: 20_000_000,
        bounce: false,
        body: new CommonMessageInfo({body: new CellMessage(initializationCell())})
    }))
    expect(executionResult.exit_code).toBe(Errors.ValueIsNull)
}, timeout)

it('Initialization. Error: RoyaltyIsTooBig', async () => {
    const config: InitialDataConfig = {...defaultInitialDataConfig}
    config.value = 10_00_000
    config.guarantors.royalty = 20_000_000
    const contract: SmartContract = await create(config)
    const executionResult = await contract.sendInternalMessage(new InternalMessage({
        to: getAddress(contract),
        value: 20_000_000,
        bounce: false,
        body: new CommonMessageInfo({body: new CellMessage(initializationCell())})
    }))
    expect(executionResult.exit_code).toBe(Errors.RoyaltyIsTooBig)
}, timeout)