import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32, u64 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CC2OOKGO77PNP5SCGAC27IR3DRMQ32JT5KFGEWGNER7MGW6565MEJ3GA";
    };
};
export declare const Errors: {
    1: {
        message: string;
    };
    2: {
        message: string;
    };
    3: {
        message: string;
    };
    4: {
        message: string;
    };
};
export interface Report {
    created_at: u64;
    description: string;
    finder: string;
    id: u64;
    item_name: string;
    location: string;
    owner: string;
    status: u32;
}
export interface Client {
    /**
     * Construct and simulate a get_report transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_report: ({ report_id }: {
        report_id: u64;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Report>>;
    /**
     * Construct and simulate a mark_found transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    mark_found: ({ caller, report_id }: {
        caller: string;
        report_id: u64;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_reports transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_reports: (options?: MethodOptions) => Promise<AssembledTransaction<Array<Report>>>;
    /**
     * Construct and simulate a create_report transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    create_report: ({ owner, item_name, location, description }: {
        owner: string;
        item_name: string;
        location: string;
        description: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<u64>>;
    /**
     * Construct and simulate a confirm_recovery transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    confirm_recovery: ({ owner, report_id }: {
        owner: string;
        report_id: u64;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        get_report: (json: string) => AssembledTransaction<Report>;
        mark_found: (json: string) => AssembledTransaction<null>;
        get_reports: (json: string) => AssembledTransaction<Report[]>;
        create_report: (json: string) => AssembledTransaction<bigint>;
        confirm_recovery: (json: string) => AssembledTransaction<null>;
    };
}
