# Svelte Undoable store

Memento design pattern in Svelte

## Installation

```
npm install @macfja/svelte-undoable
```

## Usage

```javascript
import { undoable } from "@macfja/svelte-undoable"

let name = undoable("John")

$name = "Jeanne"
$name = "Doe"

name.undo()
// Now the value of $name is "Jeanne"

name.undo()
// Now $name is "John"

name.redo()
// Now $name is "Jeanne" again
```

## Example

```html
<script>
import { undoable, undo, redo, reset, canUndo, canRedo } from "@macfja/svelte-undoable"
import { derived } from "svelte/store"

let name = undoable("John")
let canUndoName = derived([name], () => canUndo(name))
let canRedoName = derived([name], () => canRedo(name))

let counter = undoable(0, 10, value => value%2 === 0)
let canUndoCounter = derived([counter], () => counter.canUndo())
let canRedoCounter = derived([counter], () => counter.canRedo())
</script>

<h1>Hello {$name}</h1>

<input bind:value={$name} />
<button disabled={!$canUndoName} on:click={() => undo(name)}>Undo</button>
<button disabled={!$canRedoName} on:click={() => redo(name)}>Redo</button>
<button disabled={!$canUndoName} on:click={() => reset(name)}>Reset</button>

<hr />
Only even number as saved in the store history. The maximum number of remembered value is 10.
(If you go to <code>20</code>, you can only go back to <code>2</code>)

<button on:click={() => $counter++}>
  Clicked {$counter} {$counter === 1 ? 'time' : 'times'}
</button>
<button disabled={!$canUndoCounter} on:click={() => undo(counter)}>Undo</button>
<button disabled={!$canRedoCounter} on:click={() => redo(counter)}>Redo</button>
```
([REPL](https://svelte.dev/repl/9412d77adca64a668055027e84619090?version=3.25.0))

## Contributing

Contributions are welcome. Please open up an issue or create PR if you would like to help out.

Read more in the [Contributing file](CONTRIBUTING.md)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.