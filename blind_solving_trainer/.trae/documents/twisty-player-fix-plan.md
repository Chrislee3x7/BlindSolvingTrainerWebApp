# Plan: Fix User Cube State Display

The user has reported that the cube state display in the bottom right corner of the `TimerScreen` is not working. The goal is to fix this by adopting the logic from the `BluetoothScreen`.

Here's the plan:

1.  **Modify `TimerScreen.tsx`**: All changes will be made in this file.

2.  **Update the User Cube Player Logic**: The `useEffect` hook that updates the user's cube display will be changed. Instead of setting the `experimentalSetup.pattern`, I will set the `.alg` property of the `twisty-player` with the moves from the `userCubeState`.

    ```typescript
    useEffect(() => {
        if (userPlayerRef.current && kpuzzle && userCubeState) {
            userPlayerRef.current.puzzle = kpuzzle;
            userPlayerRef.current.alg = userCubeState.getMovesString();
        }
    }, [userCubeState, kpuzzle]);
    ```

3.  **Correct the Player's Position**: The user mentioned the player should be in the bottom **right** corner. I will update the CSS styles to move the container from `left: '1rem'` to `right: '1rem'`.

4.  **Remove Redundant Code**: The `useEffect` hook that sets the `experimentalSetup.pattern` for the user's cube player will be removed as it is being replaced.

This approach aligns with the working implementation in the `BluetoothScreen` and should resolve the issue with the user's cube display.
