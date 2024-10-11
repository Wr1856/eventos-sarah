export interface Hasher {
  hash: (plaintext: string) => Promise<string>
}

export interface HashComparer {
  compare: (plaintext: string, digest: string) => Promise<boolean>
}
