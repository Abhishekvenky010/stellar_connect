import { checkConnection, retrievePublickey, userSignTransaction } from '../components/Freighter';

let xbullConnected = false;
let xbullPublicKey = '';

export const connectFreighter = async () => {
  const allowed = await checkConnection();
  if (!allowed) throw new Error('Freighter permission denied');
  const publicKey = await retrievePublickey();
  return { wallet: 'freighter', publicKey };
};

export const connectXbull = async () => {
  try {
    const xbullModule = await import('@creit.tech/xbull-wallet-connect');
    const xbull = xbullModule.xBullWalletConnect || xbullModule.default || xbullModule;
    
    if (!xbull.isConnected()) {
      await xbull.connect();
    }
    
    const publicKey = await xbull.getPublicKey();
    xbullConnected = true;
    xbullPublicKey = publicKey;
    return { wallet: 'xbull', publicKey };
  } catch (e) {
    xbullConnected = false;
    xbullPublicKey = '';
    throw new Error('Failed to connect xBull wallet: ' + (e.message || e));
  }
};

export const getPublicKey = async () => {
  if (xbullConnected && xbullPublicKey) return xbullPublicKey;
  return await retrievePublickey();
};

export const isConnected = async () => {
  if (xbullConnected) return true;
  try {
    return await checkConnection();
  } catch {
    return false;
  }
};

export const signTransaction = async (xdr, networkPassphrase, address) => {
  if (xbullConnected) {
    try {
      const xbullModule = await import('@creit.tech/xbull-wallet-connect');
      const xbull = xbullModule.xBullWalletConnect || xbullModule.default || xbullModule;
      const signed = await xbull.signTransaction(xdr);
      return signed;
    } catch (e) {
      throw new Error('xBull signing failed: ' + (e.message || e));
    }
  }
  return await userSignTransaction(xdr, networkPassphrase, address);
};

export const disconnectXbull = async () => {
  try {
    const xbullModule = await import('@creit.tech/xbull-wallet-connect');
    const xbull = xbullModule.xBullWalletConnect || xbullModule.default || xbullModule;
    if (xbull.isConnected()) {
      await xbull.disconnect();
    }
  } catch {}
  xbullConnected = false;
  xbullPublicKey = '';
};

export const disconnectAll = async () => {
  await disconnectXbull();
};
