import { actionDescription } from './role-action-descriptions';

describe('actionDescription', () => {
  it('describes known actions', () => {
    expect(actionDescription('find-all')).toBe('View the list of items');
    expect(actionDescription('CREATE_CHANNEL')).toBe('Create WebSocket channels');
  });

  it('has no description for unknown actions', () => {
    expect(actionDescription('unknown_action')).toBeUndefined();
    expect(actionDescription('toString')).toBeUndefined();
  });
});
