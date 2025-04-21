import type { HashComparer } from '../cryptography/cryptograph-hash-comparer-contract';
import type { Encrypter } from '../cryptography/cryptography-encrypter-contract';
import type { HashGenerator } from '../cryptography/cryptography-hash-generator-contract';

export class FakeHasher implements HashGenerator, HashComparer {
  async compare(value: string, hash: string): Promise<boolean> {
    return value.concat('-hashed') === hash;
  }

  async hash(value: string): Promise<string> {
    return value.concat('-hashed');
  }
}

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
