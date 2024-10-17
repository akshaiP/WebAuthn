export function base64urlToUint8array(base64Bytes: string): Uint8Array {
    const padding = '='.repeat((4 - (base64Bytes.length % 4)) % 4);
    const base64 = (base64Bytes + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  export function uint8arrayToBase64url(bytes: Uint8Array): string {
    const charArray = [...bytes];
    const base64 = window.btoa(String.fromCharCode(...charArray));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  