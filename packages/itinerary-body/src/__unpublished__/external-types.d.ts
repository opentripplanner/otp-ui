// Type declarations for dependencies that don't export types.

// Package velocity-react does not export types
// and does not exist in the @types repository.
declare module "velocity-react" {
  // Important! imports must be within modules.
  import { ReactElement } from "react";

  interface TransitionInfo {
    animation: string;
  }

  export interface VelocityTransitionGroupProps {
    enter?: TransitionInfo;
    leave?: TransitionInfo;
    children?: ReactElement;
  }

  export declare function VelocityTransitionGroup(
    props: VelocityTransitionGroupProps
  ): ReactElement;
}
