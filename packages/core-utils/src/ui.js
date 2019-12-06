import bowser from "bowser";

export function isMobile() {
  // TODO: consider using 3rd-party library?
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Returns true if the user is using a [redacted] browser
 */
export function isIE() {
  return bowser.name === "Internet Explorer";
}

/**
 * Enables scrolling for a specified selector, while disabling scrolling for all
 * other targets. This is adapted from https://stackoverflow.com/a/41601290/915811
 * and intended to fix issues with iOS elastic scrolling, e.g.,
 * https://github.com/conveyal/trimet-mod-otp/issues/92.
 */
export function enableScrollForSelector(selector) {
  const overlay = document.querySelector(selector);
  let clientY = null; // remember Y position on touch start

  function isOverlayTotallyScrolled() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
    return overlay.scrollHeight - overlay.scrollTop <= overlay.clientHeight;
  }

  function disableRubberBand(event) {
    const clientYDelta = event.targetTouches[0].clientY - clientY;

    if (overlay.scrollTop === 0 && clientYDelta > 0) {
      // element is at the top of its scroll
      event.preventDefault();
    }

    if (isOverlayTotallyScrolled() && clientYDelta < 0) {
      // element is at the top of its scroll
      event.preventDefault();
    }
  }

  overlay.addEventListener(
    "touchstart",
    function(event) {
      if (event.targetTouches.length === 1) {
        // detect single touch
        clientY = event.targetTouches[0].clientY;
      }
    },
    false
  );

  overlay.addEventListener(
    "touchmove",
    function(event) {
      if (event.targetTouches.length === 1) {
        // detect single touch
        disableRubberBand(event);
      }
    },
    false
  );
}
