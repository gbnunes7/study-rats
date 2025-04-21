export interface HashComparer {
    compare(plain: string, hashed: string): Promise<boolean>;
  }
  