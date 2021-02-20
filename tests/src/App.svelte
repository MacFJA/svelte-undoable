<script>
    import { undoable, undo, redo, reset, canUndo, canRedo } from "../../src/index"
    import { derived } from "svelte/store"

    let name = undoable("John")
    let canUndoName = derived([name], () => canUndo(name))
    let canRedoName = derived([name], () => canRedo(name))

    let counter = undoable(0, 10, value => value%2 === 0)
    let canUndoCounter = derived([counter], () => counter.canUndo())
    let canRedoCounter = derived([counter], () => counter.canRedo())
</script>

<h1>Hello {$name}</h1>

<input id="name-input" bind:value={$name} />
<button id="undo-btn" disabled={!$canUndoName} on:click={() => undo(name)}>Undo</button>
<button id="redo-btn" disabled={!$canRedoName} on:click={() => redo(name)}>Redo</button>
<button id="reset-btn" disabled={!$canUndoName} on:click={() => reset(name)}>Reset</button>

<hr />
Only even number as saved in the store history. The maximum number of remembered value is 10.
(If you go to <code>20</code>, you can only go back to <code>2</code>)

<button id="counter-btn" on:click={() => $counter++}>
    Clicked {$counter} {$counter === 1 ? 'time' : 'times'}
</button>
<button id="counter-undo-btn" disabled={!$canUndoCounter} on:click={() => undo(counter)}>Undo</button>
<button id="counter-redo-btn" disabled={!$canRedoCounter} on:click={() => redo(counter)}>Redo</button>