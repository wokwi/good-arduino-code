import { headingToId } from './heading-to-id';

describe('headingToId', () => {
  it('should convert to given text to lower case, remove punctuation, and replace spaces with dashes', () => {
    expect(headingToId('Hello, World!')).toEqual('hello-world');
  });
});
