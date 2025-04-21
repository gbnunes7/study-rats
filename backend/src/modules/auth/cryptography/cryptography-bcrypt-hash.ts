import type { HashComparer } from './cryptograph-hash-comparer-contract';
import type { HashGenerator } from './cryptography-hash-generator-contract';

export class BcryptHasher implements HashGenerator, HashComparer {
  private readonly saltRounds = 10;

  async hash(plain: string): Promise<string> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(plain, hashed);
  }
}
