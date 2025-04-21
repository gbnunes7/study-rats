export class GroupHasReachedTheLimitError extends Error {
  constructor() {
    super('Group has reached the limit of users');
  }
}
