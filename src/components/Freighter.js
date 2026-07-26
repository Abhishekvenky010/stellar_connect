import { signTransaction, setAllowed, getAddress }
from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

const STELLAR_ADDRESS_REGEX = /^G[a-zA-Z0-9]{55}$/;

const ensureAddress = async (source) => {
  const { address } = await source();
  if (!address || typeof address !== 'string' || !STELLAR_ADDRESS_REGEX.test(address)) {
    throw new Error('Wallet address is unavailable. Please reconnect Freighter.');
  }
  return address;
};

export const checkConnection = async () => {
  const result = await setAllowed();
  return result.isAllowed;
};

export const retrievePublickey = async () => {
  return ensureAddress(getAddress);
};

export const getBalance = async () => {
  try {
    const address = await ensureAddress(getAddress);
    const account = await server.loadAccount(address);
    const xlm = account.balances.find((b) => b.asset_type === "native");
    return xlm?.balance ?? "0";
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load balance: ${error.message}`);
    }
    throw error;
  }
};

export const sendXlm = async (destination, amount) => {
  const address = await ensureAddress(getAddress);
  const trimmedDestination = destination.trim();

  if (!trimmedDestination || !STELLAR_ADDRESS_REGEX.test(trimmedDestination)) {
    throw new Error('Invalid Stellar destination address');
  }

  try {
    const account = await server.loadAccount(address);
    const sourceBalance = Number(account.balances.find((b) => b.asset_type === 'native')?.balance ?? '0');
    const sendAmount = Number(amount);

    if (!Number.isFinite(sendAmount) || sendAmount <= 0) {
      throw new Error('Please enter a valid amount greater than 0');
    }

    if (sourceBalance < sendAmount) {
      throw new Error(`Insufficient balance. You have ${sourceBalance.toFixed(7)} XLM, but need ${sendAmount.toFixed(7)} XLM plus reserve.`);
    }

    const sendAmountStr = sendAmount.toFixed(7);

    let destinationExists = true;
    try {
      await server.loadAccount(trimmedDestination);
    } catch {
      destinationExists = false;
    }

    if (!destinationExists && sourceBalance < sendAmount + 1) {
      throw new Error(`Destination does not exist. You need at least ${(sendAmount + 1).toFixed(7)} XLM to fund it. Your balance is ${sourceBalance.toFixed(7)} XLM.`);
    }

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: trimmedDestination,
          asset: StellarSdk.Asset.native(),
          amount: sendAmountStr,
        })
      )
      .setTimeout(30)
      .build();

    const { signedTxXdr } = await signTransaction(transaction.toXDR(), {
      networkPassphrase: StellarSdk.Networks.TESTNET,
      address,
    });

    const signedTransaction = new StellarSdk.Transaction(signedTxXdr, StellarSdk.Networks.TESTNET);

    const result = await server.submitTransaction(signedTransaction);

    return result.hash;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('400') || message.includes('Bad Request') || message.includes('tx_bad_auth')) {
      throw new Error('Transaction was rejected. Check that your balance is sufficient and Freighter is signed into Testnet.');
    }
    throw new Error(`Transaction failed: ${message}`);
  }
};

export const userSignTransaction = async (xdr, networkPassphrase, address) => {
  return await signTransaction(xdr, {
    networkPassphrase,
    address,
  });
};
