/**
 * Takes component's default props messages and its instance props messages and
 * returns the merged messages. The returned object will ensure that the default
 * messages are substituted for any translation strings that were missing in the
 * props. Note: this does not account for messages in nested objects (e.g.,
 * messages.header.description).
 */
/* eslint-disable import/prefer-default-export */
export function mergeMessages(defaultPropsMessages, propsMessages) {
  const defaultMessages = defaultPropsMessages || {};
  const instanceMessages = propsMessages || {};
  return {
    ...defaultMessages,
    ...instanceMessages
  };
}
