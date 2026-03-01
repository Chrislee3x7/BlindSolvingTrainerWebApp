# Plan: Refactor Bluetooth and State Management

This plan outlines the steps to refactor the Bluetooth functionality and cube state management of the Blind Solving Trainer Web App.

## 1. Rename "Gen2"/"Gen4" to "icarry4"

The current codebase uses "Gen2" and "Gen4" as names for GAN cube related logic. This will be updated to "icarry4" to reflect the name of the cube being used.

- **File:** `src/lib/gan-bluetooth.ts`
    - Rename `GanGen2CubeEncrypter` to `GanCubeEncrypter`.
    - Rename `GanGen4CubeEncrypter` to `iCarry4CubeEncrypter`.
    - Rename `GanGen4ProtocolDriver` to `iCarry4ProtocolDriver`.
    - Add a comment to `GAN_ENCRYPTION_KEYS` to clarify its usage for iCarry4.

- **File:** `src/bluetooth/BluetoothContext.tsx`
    - Update imports from `gan-bluetooth.ts` to use the new names (`iCarry4CubeEncrypter`, `iCarry4ProtocolDriver`).
    - Update the instantiation of `GanGen4CubeEncrypter` and `GanGen4ProtocolDriver` to the new names.

## 2. Refactor State Management with `kpuzzle`

A new state management system will be implemented using the `cubing.js` library's `kpuzzle` and `KPattern` for more robust cube state tracking.

- **Create new file:** `src/lib/CubeState.ts`
    - This file will contain the `CubeStateManager` class.

- **`CubeStateManager` class:**
    - It will initialize a `kpuzzle` instance for a 3x3x3 cube.
    - It will manage a `KPattern` object representing the cube's state.
    - It will have an `applyMove(move: string)` method to update the `KPattern`.
    - It will have a `getPattern()` method to retrieve the current `KPattern`.
    - It will have a `reset()` method to return the `KPattern` to the solved state.

- **File:** `src/bluetooth/BluetoothContext.tsx`
    - The `moves` and `lastMove` state variables will be removed.
    - An instance of `CubeStateManager` will be created and managed within the context.
    - The `driver.events$.subscribe` callback will be updated to call `cubeStateManager.applyMove(event.move)`.
    - The `useBluetooth` hook will be updated to expose the `cubeStateManager` instance and a `reset` function instead of the old `moves`, `lastMove` and `clearMoves`.

## 3. Update UI to use `CubeStateManager`

The user interface will be updated to use the new `CubeStateManager` for displaying the cube.

- **File:** `src/BluetoothScreen.tsx`
    - The "Move History" and "Last Move" display sections will be removed from the UI.
    - The `twisty-player` component will be updated to use the `kpattern` property.
    - A `useEffect` hook will listen for changes in the `cubeStateManager` and update the `twisty-player`'s `kpattern` property with the latest pattern from `cubeStateManager.getPattern()`.
    - The "Reset Cube" button's functionality will be updated to call the new `reset` function from the `useBluetooth` hook.

This refactoring will result in a cleaner, more maintainable, and more accurate cube state representation, and it will simplify the UI by removing the now-redundant move list.
