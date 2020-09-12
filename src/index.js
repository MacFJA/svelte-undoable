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

import { writable } from "svelte/store"

/**
 * Create a store with undo/redo feature
 * @param {*} initial The initial value of the store
 * @param {number} [capacity=0] The maximum number of entry to remember (any number lower than 2 is considered as infinite size)
 * @param {function(*: newValue): boolean} [accept] The validation function to accept a value to be save in memory.<br/>
 *                                                  Take the new store value as parameter, should return a boolean (`true` to save the value, `false` to dismiss it).<br/>
 *                                                  If ignore, it will accept all value
 * @return {Writable<*>}
 */
export const undoable = (initial, capacity, accept) => {
    let states = [initial]
    let inAction = true
    let index = 0
    let store = writable(initial)
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
    store.undo = () => {
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
    store.redo = () => {
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
    store.canUndo = () => {
        return index > 0
    }

    /**
     * @internal
     * Indicate if the store value can be change to a next state
     * @return {boolean}
     */
    store.canRedo = () => {
        return index < states.length - 1
    }

    /**
     * @internal
     * Revert the value of the store to the oldest state.
     * If the parameter is `true`, then the store state history is cleared
     * @param {boolean} [clear] If `true` the history is cleared
     */
    store.reset = (clear) => {
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
    store.length = () => {
        return states.length
    }

    return store
}

/**
 * Check is an object have a function
 *
 * @internal
 * @private
 * @param {Object|*} anObject The object to test
 * @param {string} name The name of the function to test
 * @return {boolean}
 */
const functionSupported = (anObject, name) => {
    if (typeof anObject !== "object") {
        return false
    }
    if (!Object.keys(anObject).includes(name)) {
        return false
    }
    return typeof anObject[name] === "function"

}

/**
 * Change the value to the previous saved state
 * @param {Readable<*>} undoableStore The store to use
 */
export const undo = (undoableStore) => {
    if (functionSupported(undoableStore, "undo")) {
        undoableStore.undo()
    }
}

/**
 * Change the value to the next saved state
 * @param {Readable<*>} undoableStore The store to use
 */
export const redo = (undoableStore) => {
    if (functionSupported(undoableStore, "redo")) {
        undoableStore.redo()
    }
}

/**
 * Indicate if the store value can be revert to a previous state
 * @param {Readable<*>} undoableStore The store to use
 * @return {boolean}
 */
export const canUndo = (undoableStore) => {
    if (functionSupported(undoableStore, "canUndo")) {
        return undoableStore.canUndo()
    }
    return false
}

/**
 * Indicate if the store value can be change to a next state
 * @param {Readable<*>} undoableStore The store to use
 * @return {boolean}
 */
export const canRedo = (undoableStore) => {
    if (functionSupported(undoableStore, "canRedo")) {
        return undoableStore.canRedo()
    }
    return false
}

/**
 * Revert the value of the store to the oldest state.
 * If the second parameter is `true`, then the store state history is cleared
 * @param {Readable<*>} undoableStore The store to use
 * @param {boolean} [clear] If `true` the history is cleared
 */
export const reset = (undoableStore, clear) => {
    if (functionSupported(undoableStore, "reset")) {
        undoableStore.reset(clear)
    }
}
