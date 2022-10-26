# Escrow
## Installation
```shell
yarn install && yarn copy
```

Check and `config/config.ts`. It used for `wallet`, `compile` and `address` scripts

## Commands
* Generate new 24 words mnemonic and output
  ```shell
  yarn mnemonic
  ```
  
* View contract address without deploying
    ```shell
  yarn address
  ```
  
* View deploy wallet address and balance
  ```shell
  yarn wallet
  ```
  
* Compile
  ```shell
  yarn compile
  ```
  
* Test
  ```shell
  yarn test
  ```

## Workflow
1. The **Buyer** or any user generates a deployment message with the following parameters:
   * `bool` `initialized` - contract initialized or not. Always is `0`
   * `uint256` `nonce` - random number to avoid contract addresses conflicts
   * `uint128` `value` - balance that remains after the deployment. 
                         Balance above this value is back to the sender.
   * `MsgAddressInt` `seller` - **seller** address
   * `MsgAddressInt` `buyer` - **buyer** address
   * `MsgAddressInt` `guarantor` - **guarantor** address
   * `uint64` `deadline` - deadline for guarantor. Timestamp
   * `MsgAddressInt` `guarantor_fallback` - **fallback guarantor** address. Can be zero
   * `uint64` `deadline_fallback` - deadline for fallback guarantor. Timestamp. Can be zero
   * `uint128` `royalty` - royalty in absolute value.
                           Value in `%` is not used, because you still have to use the absolute value to transfer money
2. The **Buyer** or any user send a deployment message with grams
   If the contract balance `> value` the balance above `value` is back to the sender and `initialized` = `1`
3. The **Guarantor** calculates contract address locally with `initialized` == `0` and check that all is OK
4. If all is OK the **Guarantor** calls the `accept()` operation or the `reject()` operation
   * `accept()`. `value - royalty` to **Seller**. `royalty - storage fee - other fees` to operation caller
   * `reject()`. `value - royalty` to **Buyer**. `royalty - storage fee - other fees` to operation caller
5. If the **Guarantor** doesn't call methods before `deadline` same do **Fallback guarantor**
6. If **Fallback guarantor** doesn't call methods before `deadline_fallback` same do **Seller**

## Notes about external vs internal messages
Only internal messages are used to access the contract.
External messages should only be used for the user's personal wallets.
Interaction through internal messages gives more flexibility.
For example, several people can make decisions from one contract.
This often happens in real business, when several people work in one company.
With a key or password, this creates security issues.