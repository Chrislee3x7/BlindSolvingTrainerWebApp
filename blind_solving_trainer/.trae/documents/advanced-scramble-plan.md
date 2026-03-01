# Plan: Advanced Scramble Correction Logic

This plan outlines the implementation of a more sophisticated scramble correction system in `TimerScreen.tsx`. This system will guide the user back to the correct scramble path with a cumulative recovery algorithm and will reset after 20 consecutive incorrect moves.

### 1. New State Variables

To manage the new logic, the following state variables will be introduced in `TimerScreen.tsx`:

-   `recoveryAlg`: `Alg | null` - To store the cumulative sequence of moves required to get back to the correct path.
-   `incorrectMoveCount`: `number` - To count consecutive incorrect moves.

### 2. Core Logic in `useEffect`

The main `useEffect` hook that processes user moves will be restructured into a state machine with two primary modes: "On-Track" and "Error/Recovery."

#### On-Track Mode (`isErrorState` is `false`)

-   The existing logic for tracking correct progress through the scramble will be maintained.
-   When a genuine error is detected:
    -   Set `isErrorState` to `true`.
    -   Set `incorrectMoveCount` to `1`.
    -   Calculate the single inverse move to undo the error.
    -   Initialize `recoveryAlg` with this single inverse move.
    -   Set `displayAlg` to show this initial recovery move.

#### Error/Recovery Mode (`isErrorState` is `true`)

-   **Check for Recovery**: If the user's cube state matches the last correct state (`expectedCubeState`):
    -   The user is back on track. Reset all error states: `isErrorState` to `false`, `recoveryAlg` to `null`, and `incorrectMoveCount` to `0`.
    -   Set `displayAlg` back to the main scramble.

-   **Check 20-Move Limit**: If `incorrectMoveCount` reaches `20`:
    -   A new scramble will be generated, and the component state will be fully reset. **Assumption**: Generating a new scramble from the *current* cube state is complex. The plan is to generate a standard new scramble, which effectively serves as a full reset. This is a more robust and user-friendly approach.

-   **Process New Move in Error State**:
    -   Increment `incorrectMoveCount`.
    -   Determine the last move the user made.
    -   Instead of replacing the recovery algorithm, **append** the inverse of the new incorrect move to the existing `recoveryAlg`.
    -   Update `displayAlg` with the new, longer `recoveryAlg`.

### 3. UI Changes

-   The UI is already set up to display the `displayAlg` state. No significant changes are needed, but I will ensure the styling continues to correctly indicate the error state (e.g., red text for the recovery algorithm).

This new logic will create a more powerful and forgiving training experience, allowing users to make multiple mistakes and still receive guidance on how to return to the scramble path, with a built-in reset for when they get too far off track.
