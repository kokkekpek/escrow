import {Address} from 'ton'

export default {
    /**
     * Mnemonic example
     * Change mnemonic to your own test wallet mnemonic
     */
    mnemonic: [
        'corn',    'tilt',    'cousin',
        'sphere',  'pumpkin', 'knock',
        'short',   'credit',  'walk',
        'fruit',   'nose',    'audit',
        'cotton',  'become',  'rude',
        'other',   'trouble', 'love',
        'prefer',  'enrich',  'rescue',
        'tobacco', 'into',    'inside'
    ],

    /**
     * Endpoint to jsonRPC. Examples:
     *     'https://toncenter.com/api/v2/jsonRPC'
     *     'https://testnet.toncenter.com/api/v2/jsonRPC'
     */
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',

    /**
     * API key
     * @see https://t.me/tonapibot
     */
    apiKey: 'e78c012c52652b2437fc804f12a10cf1258d122b0439928534005a45dad1df78',

    /**
     * Deploy value in grams
     */
    deployValue: 20_000_000,

    /**
     * 1 + 256 + 128 + 267 + 267 = 917 bits in root cell
     * 267 + 64 + 267 + 64 + 128 = 790 bits in guarantors cell
     */
    initialData: {
        /**
         * boolean
         * Deploy contract only with initialized = 0
         * Guarantors and sellers must ignore contract deployed with initialized = 1
         */
        initialized: 0,

        /**
         * uint256
         * Use random number to avoid addresses conflicts
         */
        nonce: 0,

        /**
         * uint128
         * Grams
         */
        value: 10_000_000,

        /**
         * slice
         */
        seller: Address.parseRaw('0:0000000000000000000000000000000000000000000000000000000000000000'),

        /**
         * slice
         */
        buyer: Address.parseRaw('0:0000000000000000000000000000000000000000000000000000000000000000'),

        guarantors: {
            /**
             * slice
             */
            guarantor: Address.parseRaw('0:0000000000000000000000000000000000000000000000000000000000000000'),

            /**
             * uint64
             * Timestamp in seconds
             */
            deadline: 1640984400 + 3600, // 2023-01-01 00:00:00 + 01:00:00

            /**
             * slice
             */
            guarantorFallback: Address.parseRaw('0:0000000000000000000000000000000000000000000000000000000000000000'),

            /**
             * uint64
             * Timestamp in seconds
             */
            deadlineFallback: 1640984400 + 7200, // 2023-01-01 00:00:00 + 02:00:00

            /**
             * uint64
             * Grams
             */
            royalty: 1_000_000
        }
    }
}