import React, { ReactElement, ReactNode, Suspense } from "react";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
};

const SafeSuspense = ({ children, fallback }: Props): ReactElement => {
  const IS_TEST_RUNNER = window.navigator.userAgent.match(
    /StorybookTestRunner/
  );
  return IS_TEST_RUNNER ? (
    <>{fallback}</>
  ) : (
    <Suspense fallback={fallback}>{children}</Suspense>
  );
};

export default SafeSuspense;
