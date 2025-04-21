export class UserAlreadyInGroupError extends Error {
  constructor() {
    super('User is already in the group');
  }
}
