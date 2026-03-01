# Plan: Implement Smart Scramble Display

This plan outlines the steps to change the scramble display logic in `TimerScreen.tsx` to be more intuitive for the user. Instead of showing a disruptive error message upon a wrong move, the UI will display the necessary moves to get back on track.

Here are the implementation steps:

1.  **State Management Changes**:
    *   Introduce a new state variable `displayAlg` to hold the algorithm that will be shown to the user. This will be of type `Alg | null`.
    *   Remove the existing `error` state variable, as it will no longer be needed.

2.  **Update Move-Checking Logic**:
    *   The core logic is in the `useEffect` hook that depends on `userCubeState`. This will be significantly updated.
    *   **On a Correct Move**: When the user performs a correct move, the `displayAlg` will be set to the original `scramble`.
    *   **On an Incorrect Move**: If the user deviates from the scramble, the following will happen:
        *   The `isErrorState` flag will be set to `true`.
        *   I will use `kpuzzle.solve(expectedState, currentState)` to calculate the recovery algorithm.
        *   `displayAlg` will be updated with this new recovery algorithm.
    *   **During Error State**: While `isErrorState` is true:
        *   If the user gets back to the `expectedCubeState`, `isErrorState` is set to `false`, and `displayAlg` is reset to the original `scramble`.
        *   If the user makes further incorrect moves, the recovery algorithm will be recalculated and `displayAlg` updated in real-time.

3.  **UI Modifications**:
    *   The JSX element that displays the scramble will be updated to render the `displayAlg` state variable.
    *   The red error text paragraph will be removed from the JSX.

This approach will provide a more seamless and helpful user experience, guiding them back to the correct scramble path without explicit error messages.
