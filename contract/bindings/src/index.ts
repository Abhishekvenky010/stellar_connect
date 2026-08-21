import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CAIFCSOJYGP6I7U2GDZ646C4P5HMXCA4M2376J25S2F6ULDYNJHAXU7K",
  }
} as const

export const Errors = {
  1: {message:"ReportNotFound"},
  2: {message:"Unauthorized"},
  3: {message:"InvalidStatus"},
  4: {message:"InvalidInput"}
}


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
  get_report: ({report_id}: {report_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Report>>

  /**
   * Construct and simulate a mark_found transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mark_found: ({caller, report_id}: {caller: string, report_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_reports transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_reports: (options?: MethodOptions) => Promise<AssembledTransaction<Array<Report>>>

  /**
   * Construct and simulate a create_report transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_report: ({owner, item_name, location, description}: {owner: string, item_name: string, location: string, description: string}, options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a confirm_recovery transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  confirm_recovery: ({owner, report_id}: {owner: string, report_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABAAAAAAAAAAOUmVwb3J0Tm90Rm91bmQAAAAAAAEAAAAAAAAADFVuYXV0aG9yaXplZAAAAAIAAAAAAAAADUludmFsaWRTdGF0dXMAAAAAAAADAAAAAAAAAAxJbnZhbGlkSW5wdXQAAAAE",
        "AAAAAQAAAAAAAAAAAAAABlJlcG9ydAAAAAAACAAAAAAAAAAKY3JlYXRlZF9hdAAAAAAABgAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAAGZmluZGVyAAAAAAATAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAJaXRlbV9uYW1lAAAAAAAAEAAAAAAAAAAIbG9jYXRpb24AAAAQAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAABnN0YXR1cwAAAAAABA==",
        "AAAAAAAAAAAAAAAKZ2V0X3JlcG9ydAAAAAAAAQAAAAAAAAAJcmVwb3J0X2lkAAAAAAAABgAAAAEAAAfQAAAABlJlcG9ydAAA",
        "AAAAAAAAAAAAAAAKbWFya19mb3VuZAAAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAlyZXBvcnRfaWQAAAAAAAAGAAAAAA==",
        "AAAAAAAAAAAAAAALZ2V0X3JlcG9ydHMAAAAAAAAAAAEAAAPqAAAH0AAAAAZSZXBvcnQAAA==",
        "AAAAAAAAAAAAAAANY3JlYXRlX3JlcG9ydAAAAAAAAAQAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAJaXRlbV9uYW1lAAAAAAAAEAAAAAAAAAAIbG9jYXRpb24AAAAQAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAQAAAAY=",
        "AAAAAAAAAAAAAAAQY29uZmlybV9yZWNvdmVyeQAAAAIAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAJcmVwb3J0X2lkAAAAAAAABgAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_report: this.txFromJSON<Report>,
        mark_found: this.txFromJSON<null>,
        get_reports: this.txFromJSON<Array<Report>>,
        create_report: this.txFromJSON<u64>,
        confirm_recovery: this.txFromJSON<null>
  }
}