/*
 * Copyright MacFJA
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {Writable, writable} from "svelte/store"

/**
 * Undoable store.
 *
 * A writable store with history.
 */
export interface UndoableStore<T> extends Writable<T> {
    /**
     * Change the value to the previous saved state
     */
    undo(): void,

    /**
     * Change the value to the next saved state
     */
    redo(): void,

    /**
     * Indicate if the store value can be revert to a previous state
     */
    canUndo(): boolean,

    /**
     * Indicate if the store value can be change to a next state
     */
    canRedo(): boolean,
    /**
     * Revert the value of the store to the oldest state.
     * If the parameter is `true`, then the store state history is cleared
     * @param {boolean?} clear If `true` the history is cleared
     */
    reset(clear?: boolean): void,
    length(): number
}

/**
 * Create a store with undo/redo feature
 * @param {*} initial The initial value of the store
 * @param {number?} capacity The maximum number of entry to remember (any number lower than 2 is considered as infinite size)
 * @param {function(*: newValue): boolean} accept The validation function to accept a value to be save in memory.<br/>
 *                                                  Take the new store value as parameter, should return a boolean (`true` to save the value, `false` to dismiss it).<br/>
 *                                                  If ignore, it will accept all value
 * @return {UndoableStore<*>}
 */
export function undoable<T>(initial: T, capacity?: number, accept?: (newValue: T) => boolean): UndoableStore<T> {
    let states = [initial]
    let inAction = true
    let index = 0
    const store: Writable<T> = writable(initial)
    if (typeof accept !== "function") {
        accept = () => true
    }

    store.subscribe((newValue) => {
        if (!inAction && accept(newValue)) {
            if (states.length > index + 1) {
                states = states.slice(0, index + 1)
            }
            states.push(newValue)
            index++

            if (capacity > 1 && states.length > capacity) {
                states.shift()
                index = states.length
            }
        }
    })

    inAction = false

    /**
     * @internal
     * Change the value to the previous saved state
     */
    const undo = () => {
        inAction = true
        if (index > 0) {
            index--
        }
        store.set(states[index])
        inAction = false
    }

    /**
     * @internal
     * Change the value to the next saved state
     */
    const redo = () => {
        inAction = true
        if (index < states.length - 1) {
            index++
        }
        store.set(states[index])
        inAction = false
    }

    /**
     * @internal
     * Indicate if the store value can be revert to a previous state
     * @return {boolean}
     */
    const canUndo = () => {
        return index > 0
    }

    /**
     * @internal
     * Indicate if the store value can be change to a next state
     * @return {boolean}
     */
    const canRedo = () => {
        return index < states.length - 1
    }

    /**
     * @internal
     * Revert the value of the store to the oldest state.
     * If the parameter is `true`, then the store state history is cleared
     * @param {boolean?} clear If `true` the history is cleared
     */
    const reset = (clear?: boolean) => {
        inAction = true
        index = 0
        store.set(states[index])
        if (clear) {
            states = states.slice(0, 1)
        }
        inAction = false
    }

    /**
     * @internal
     * Get the number of saved states
     * @return {number}
     */
    const length = () => {
        return states.length
    }

    return {
        subscribe: store.subscribe,
        set: store.set,
        update: store.update,
        undo,
        redo,
        canUndo,
        canRedo,
        reset,
        length,
    }
}

/**
 * Change the value to the previous saved state
 * @param {UndoableStore<*>} undoableStore The store to use
 */
export function undo<T> (undoableStore: UndoableStore<T>): void {
    undoableStore.undo()
}

/**
 * Change the value to the next saved state
 * @param {UndoableStore<*>} undoableStore The store to use
 */
export function redo<T> (undoableStore: UndoableStore<T>): void {
    undoableStore.redo()
}

/**
 * Indicate if the store value can be revert to a previous state
 * @param {UndoableStore<*>} undoableStore The store to use
 * @return {boolean}
 */
export function canUndo<T> (undoableStore: UndoableStore<T>): boolean {
    return undoableStore.canUndo()
}

/**
 * Indicate if the store value can be change to a next state
 * @param {UndoableStore<*>} undoableStore The store to use
 * @return {boolean}
 */
export function canRedo<T> (undoableStore: UndoableStore<T>): boolean {
    return undoableStore.canRedo()
}

/**
 * Revert the value of the store to the oldest state.
 * If the second parameter is `true`, then the store state history is cleared
 * @param {UndoableStore<*>} undoableStore The store to use
 * @param {boolean} clear If `true` the history is cleared
 */
export function reset<T> (undoableStore: UndoableStore<T>, clear?: boolean): void {
    undoableStore.reset(clear)
}
