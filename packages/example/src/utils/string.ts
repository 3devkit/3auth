class StringTool {
  public static stringToUint8Array(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }

  public static stringToArrayBuffer(str: string): ArrayBuffer {
    return this.stringToUint8Array(str).buffer;
  }

  public static arrayBufferTostring(array: ArrayBuffer): string {
    const uint8array = new Uint8Array(array);
    return this.uint8ArrayToString(uint8array);
  }

  public static uint8ArrayToString(array: Uint8Array): string {
    return new TextDecoder('utf-8').decode(array);
  }
}

export { StringTool };
