import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
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
};
export const Errors = {
    1: { message: "ReportNotFound" },
    2: { message: "Unauthorized" },
    3: { message: "InvalidStatus" },
    4: { message: "InvalidInput" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABAAAAAAAAAAOUmVwb3J0Tm90Rm91bmQAAAAAAAEAAAAAAAAADFVuYXV0aG9yaXplZAAAAAIAAAAAAAAADUludmFsaWRTdGF0dXMAAAAAAAADAAAAAAAAAAxJbnZhbGlkSW5wdXQAAAAE",
            "AAAAAQAAAAAAAAAAAAAABlJlcG9ydAAAAAAACAAAAAAAAAAKY3JlYXRlZF9hdAAAAAAABgAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAAGZmluZGVyAAAAAAATAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAJaXRlbV9uYW1lAAAAAAAAEAAAAAAAAAAIbG9jYXRpb24AAAAQAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAABnN0YXR1cwAAAAAABA==",
            "AAAAAAAAAAAAAAAKZ2V0X3JlcG9ydAAAAAAAAQAAAAAAAAAJcmVwb3J0X2lkAAAAAAAABgAAAAEAAAfQAAAABlJlcG9ydAAA",
            "AAAAAAAAAAAAAAAKbWFya19mb3VuZAAAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAlyZXBvcnRfaWQAAAAAAAAGAAAAAA==",
            "AAAAAAAAAAAAAAALZ2V0X3JlcG9ydHMAAAAAAAAAAAEAAAPqAAAH0AAAAAZSZXBvcnQAAA==",
            "AAAAAAAAAAAAAAANY3JlYXRlX3JlcG9ydAAAAAAAAAQAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAJaXRlbV9uYW1lAAAAAAAAEAAAAAAAAAAIbG9jYXRpb24AAAAQAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAQAAAAY=",
            "AAAAAAAAAAAAAAAQY29uZmlybV9yZWNvdmVyeQAAAAIAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAJcmVwb3J0X2lkAAAAAAAABgAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        get_report: (this.txFromJSON),
        mark_found: (this.txFromJSON),
        get_reports: (this.txFromJSON),
        create_report: (this.txFromJSON),
        confirm_recovery: (this.txFromJSON)
    };
}
