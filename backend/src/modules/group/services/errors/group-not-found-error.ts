export class GroupNotFoundError extends Error {
  constructor() {
    super('Group not found');
  }
}
