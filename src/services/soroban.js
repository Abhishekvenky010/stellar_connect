import { Client, Networks } from '../bindings';
import { signTransaction as walletSignTransaction, getPublicKey } from './wallet';

const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = Networks.TESTNET;
const DEFAULT_PUBLIC_KEY = 'GAY3G6VTLIHK5C4NLAJOG65YVYQAXG7LKFHTQPTQKCTX4TZACJAMJWCN';

export const CONTRACT_ID = 'CAIFCSOJYGP6I7U2GDZ646C4P5HMXCA4M2376J25S2F6ULDYNJHAXU7K';

let clientCache = null;
let cachedPublicKey = '';

export const getClient = async (publicKey) => {
  if (clientCache && cachedPublicKey === publicKey) return clientCache;

  clientCache = await Client.from({
    rpcUrl: SOROBAN_RPC_URL,
    contractId: CONTRACT_ID,
    networkPassphrase: NETWORK_PASSPHRASE,
    publicKey: publicKey || DEFAULT_PUBLIC_KEY,
    signTransaction: async (xdr, options = {}) => {
      const userPublicKey = await getPublicKey();
      return walletSignTransaction(xdr, NETWORK_PASSPHRASE, userPublicKey);
    },
  });

  cachedPublicKey = publicKey || DEFAULT_PUBLIC_KEY;
  return clientCache;
};

export const createReport = async (publicKey, itemName, location, description) => {
  if (!publicKey) throw new Error('Wallet not connected');
  if (!itemName || !location || !description) {
    throw new Error('InvalidInput: All fields are required');
  }

  try {
    const client = await getClient(publicKey);
    const assembled = await client.create_report({
      owner: publicKey,
      item_name: itemName,
      location,
      description,
    });
    const sent = await assembled.signAndSend();
    return sent;
  } catch (e) {
    if (e.message && e.message.includes('rejected')) {
      throw new Error('Transaction rejected by user');
    }
    throw new Error('Contract execution failed: ' + (e.message || e));
  }
};

export const markFound = async (publicKey, reportId) => {
  if (!publicKey) throw new Error('Wallet not connected');

  try {
    const client = await getClient(publicKey);
    const assembled = await client.mark_found({
      caller: publicKey,
      report_id: reportId,
    });
    const sent = await assembled.signAndSend();
    return sent;
  } catch (e) {
    if (e.message && e.message.includes('rejected')) {
      throw new Error('Transaction rejected by user');
    }
    throw new Error('Contract execution failed: ' + (e.message || e));
  }
};

export const confirmRecovery = async (publicKey, reportId) => {
  if (!publicKey) throw new Error('Wallet not connected');

  try {
    const client = await getClient(publicKey);
    const assembled = await client.confirm_recovery({
      owner: publicKey,
      report_id: reportId,
    });
    const sent = await assembled.signAndSend();
    return sent;
  } catch (e) {
    if (e.message && e.message.includes('rejected')) {
      throw new Error('Transaction rejected by user');
    }
    throw new Error('Contract execution failed: ' + (e.message || e));
  }
};

export const getReport = async (reportId, publicKey) => {
  try {
    const client = await getClient(publicKey);
    const result = await client.get_report({ report_id: reportId });
    const raw = result.result;
    if (raw && typeof raw.isErr === 'function' && raw.isErr()) {
      throw new Error(raw.unwrapErr().error?.message || 'Report not found');
    }
    return raw;
  } catch (e) {
    if (e.message && e.message.includes('ReportNotFound')) {
      throw new Error('Report not found');
    }
    throw new Error('Contract execution failed: ' + (e.message || e));
  }
};

export const getReports = async (publicKey) => {
  try {
    const client = await getClient(publicKey);
    const result = await client.get_reports();
    return result.result || [];
  } catch (e) {
    throw new Error('Contract execution failed: ' + (e.message || e));
  }
};

export const getTransactionStatus = async (txHash) => {
  try {
    const { Server } = await import('@stellar/stellar-sdk/rpc');
    const server = new Server(SOROBAN_RPC_URL);
    const tx = await server.transactions().transaction(txHash);
    return {
      status: tx.successful ? 'Confirmed' : 'Failed',
      hash: tx.hash,
      ledger: tx.ledger,
    };
  } catch (e) {
    return { status: 'Pending', hash: txHash };
  }
};

export const getExplorerUrl = (txHash) => {
  return `https://stellar.expert/explorer/testnet/tx/${txHash}`;
};
