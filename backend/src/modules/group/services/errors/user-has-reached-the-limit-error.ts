export class UserHasReachedTheLimitError extends Error {
  constructor() {
    super('User has reached the limit of groups created');
  }
}
