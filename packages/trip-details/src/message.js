import PropTypes from "prop-types";
import React from "react";
import { FormattedMessage } from "react-intl";

/**
 * Format text bold (used with FormattedMessage).
 */
function BoldText(chunks) {
  return <b>{chunks}</b>;
}

/**
 * Renders a message depending on parameters.
 */
export default function Message({
  defaultContent,
  localized,
  messageId,
  values
}) {
  return (
    (localized && (
      <FormattedMessage id={messageId} values={{ b: BoldText, ...values }} />
    )) ||
    messageId ||
    defaultContent
  );
}

Message.propTypes = {
  /** Contents shown if no messageId is provided */
  defaultContent: PropTypes.elementType,
  /** Determines whether to use FromattedMessage with the given messageId. */
  localized: PropTypes.bool,
  /** The message, or localized message of specified messageId to render. */
  messageId: PropTypes.string,
  /** Values to be inserted, depending on the message. */
  values: PropTypes.shape({})
};

Message.defaultProps = {
  defaultContent: null,
  localized: false,
  messageId: null,
  values: null
};
