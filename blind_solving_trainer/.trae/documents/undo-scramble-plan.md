# Plan: Refine Scramble Correction Logic

This plan details the steps to adjust the scramble correction logic in `TimerScreen.tsx`. The goal is to display only the inverse of the user's last incorrect move, providing a simpler "undo" hint instead of a full recovery algorithm.

### 1. Track Previous Cube State

To identify the last move made, I need to compare the current `userCubeState` with the state from the previous render.

-   **Action**: In `TimerScreen.tsx`, introduce a `useRef` called `prevUserCubeStateRef` to hold the previous `userCubeState`.
    ```typescript
    const prevUserCubeStateRef = useRef<CubeStateManager | null>(null);
    ```
-   **Action**: This ref will be updated at the end of the main move-processing `useEffect` hook.
    ```typescript
    useEffect(() => {
        // ... (move processing logic)
        prevUserCubeStateRef.current = userCubeState;
    }, [userCubeState, scramble]);
    ```

### 2. Update Error and Recovery Logic

The core logic inside the move-processing `useEffect` will be updated to implement the new "undo" behavior.

-   **On New Error**: When an incorrect move is first detected:
    -   Set `isErrorState` to `true`.
    -   Isolate the last move by comparing the moves strings from `prevUserCubeStateRef.current` and the current `userCubeState`.
    -   Calculate the inverse of this single move.
    -   Set `displayAlg` to the inverse move. The UI will now show just the move needed to undo the error (e.g., `R'`).

-   **During Error State**: If the user is already in an error state:
    -   If the user performs a move that returns them to the last correct state, set `isErrorState` back to `false` and restore the `displayAlg` to the main scramble.
    -   If the user performs another incorrect move, re-calculate the undo move based on this new last move and update `displayAlg` accordingly.

This approach will provide the more intuitive undo functionality you requested, making it easier for the user to correct mistakes one move at a time.
