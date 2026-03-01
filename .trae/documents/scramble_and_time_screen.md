# Plan: Implement Scramble and Time Screen

This plan outlines the steps to create a new "Scramble and Time" screen with a focus on the scrambling phase first, as requested.

## Phase 1: Scrambling Feature

### 1. Codebase Analysis

* **Goal**: Understand the existing structure to best place the new feature.

* **Actions**:

  * Review `src/routes` to determine where the new screen's route should be created. This is most likely another button in the ControlPanel which should be enabled/disabled depending on if there is a bluetooth cube connected.

  * Analyze `src/lib/CubeState.ts` to understand how to use the existing cube state representation and move tracking.

  * Examine `package.json` to check if `cubing.js` is already a dependency.

  <br />

### 2. New Screen and Scramble Logic

* **Goal**: Create the new screen and implement the core scramble generation and tracking.

* **Actions**:

  * Create a new Svelte component for the timer screen at `src/routes/timer/+page.svelte`.

  * Add `cubing` as a project dependency if it is not already present.

  * In the new component, use `randomScrambleForEvent('333')` from `cubing.js` to generate a scramble.

  * Manage two cube state patterns:

    1. `userPattern`: The existing pattern from `CubeState.ts` that reflects the user's physical cube.
    2. `expectedPattern`: A new pattern instance that will be advanced one move at a time according to the generated scramble, representing the state the user *should* be in.

### 3. Scrambling User Interface

* **Goal**: Display the scramble and provide real-time feedback to the user.

* **Actions**:

  * Display the full scramble algorithm at the bottom of the screen.

  * As the user performs moves, highlight the current move the system expects them to perform based on the `expectedPattern`.

  * Visually differentiate between successfully executed moves and the current move to be executed.

### 4. Handling Incorrect Scramble Moves

* **Goal**: Provide clear and helpful feedback when the user makes a wrong move.

* **Initial Ideas for Discussion**:

  * **Visual Feedback (MVP)**: If the `userPattern` deviates from the `expectedPattern`, highlight the incorrect move in the scramble display (e.g., in red) and show a message like, "Incorrect move. Expected X, but got Y." The user would then need to manually undo their move to proceed. This is the recommended starting point due to its simplicity.

  * **Guided Correction**: Display a 3D rendering of the cube in both the user's actual state and the expected state, making it easy for them to see the difference and correct their mistake.

  * **Forgiving Mode**: The application could calculate the moves needed to get from the user's incorrect state to the correct one. This is likely too complex for the initial implementation but could be a future enhancement.

## Phase 2: Timers and Solve Tracking (Future Work)

* Implement the 15-second inspection timer.

* Implement the main stopwatch that starts after inspection or on the first move.

* Detect the solved state to stop the timer automatically.

* Create the UI for the list of solve times and the detail view showing the scramble.

This phased approach allows us to focus on delivering a robust scrambling experience first, which is the most critical part of the new feature.
