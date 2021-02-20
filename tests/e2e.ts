import { Selector } from "testcafe"

fixture("Svelte Undoable")
    .page("http://localhost:5000")

const title = Selector('h1'),
    input = Selector('#name-input'),
    nameUndo = Selector('#undo-btn'),
    nameRedo = Selector('#redo-btn'),
    nameReset = Selector('#reset-btn'),
    counterBtn = Selector('#counter-btn'),
    counterUndoBtn = Selector('#counter-undo-btn'),
    counterRedoBtn = Selector('#counter-redo-btn')

test("Initial state", async t => {
    await t
        .expect(title.innerText).eql("Hello John")
        .expect(input.value).eql("John")
        .expect(nameUndo.hasAttribute('disabled')).eql(true)
        .expect(nameRedo.hasAttribute('disabled')).eql(true)
        .expect(nameReset.hasAttribute('disabled')).eql(true)

        .expect(counterBtn.innerText).eql('Clicked 0 times')
        .expect(counterUndoBtn.hasAttribute('disabled')).eql(true)
        .expect(counterRedoBtn.hasAttribute('disabled')).eql(true)
})

test("Standard Undo/Redo", async t => {
    await t
        .selectText(input)
        .typeText(input, 'Paul')
        .expect(title.innerText).eql('Hello Paul')
        .expect(nameUndo.hasAttribute('disabled')).eql(false)
        .expect(nameRedo.hasAttribute('disabled')).eql(true)
        .expect(nameReset.hasAttribute('disabled')).eql(false)

        .click(nameUndo) // Pau
        .click(nameUndo) // Pa
        .click(nameUndo) // P
        .click(nameUndo) // John
        .expect(title.innerText).eql("Hello John")
        .expect(input.value).eql("John")
        .expect(nameUndo.hasAttribute('disabled')).eql(true)
        .expect(nameRedo.hasAttribute('disabled')).eql(false)
        .expect(nameReset.hasAttribute('disabled')).eql(true)

        .click(nameRedo) // P
        .click(nameRedo) // Pa
        .expect(title.innerText).eql("Hello Pa")
        .expect(input.value).eql("Pa")
        .expect(nameUndo.hasAttribute('disabled')).eql(false)
        .expect(nameRedo.hasAttribute('disabled')).eql(false)
        .expect(nameReset.hasAttribute('disabled')).eql(false)

        .click(nameReset)
        .expect(title.innerText).eql("Hello John")
        .expect(input.value).eql("John")
        .expect(nameUndo.hasAttribute('disabled')).eql(true)
        .expect(nameRedo.hasAttribute('disabled')).eql(false)
        .expect(nameReset.hasAttribute('disabled')).eql(true)
})

test('Custom rule', async t => {
    await t
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 1 time')
        .expect(counterUndoBtn.hasAttribute('disabled')).eql(true)
        .expect(counterRedoBtn.hasAttribute('disabled')).eql(true)

        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 2 times')
        .expect(counterUndoBtn.hasAttribute('disabled')).eql(false)
        .expect(counterRedoBtn.hasAttribute('disabled')).eql(true)

        .click(counterUndoBtn)
        .expect(counterBtn.innerText).eql('Clicked 0 times')
        .expect(counterUndoBtn.hasAttribute('disabled')).eql(true)
        .expect(counterRedoBtn.hasAttribute('disabled')).eql(false)

        .click(counterRedoBtn)
        .expect(counterBtn.innerText).eql('Clicked 2 times')
        .expect(counterUndoBtn.hasAttribute('disabled')).eql(false)
        .expect(counterRedoBtn.hasAttribute('disabled')).eql(true)

        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 3 times')
        .expect(counterUndoBtn.hasAttribute('disabled')).eql(false)
        .expect(counterRedoBtn.hasAttribute('disabled')).eql(true)

        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 4 times')
        .expect(counterUndoBtn.hasAttribute('disabled')).eql(false)
        .expect(counterRedoBtn.hasAttribute('disabled')).eql(true)

        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 5 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 6 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 7 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 8 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 9 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 10 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 11 times')
        .click(counterUndoBtn)
        .expect(counterBtn.innerText).eql('Clicked 8 times')
        .click(counterRedoBtn)
        .expect(counterBtn.innerText).eql('Clicked 10 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 11 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 12 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 13 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 14 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 15 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 16 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 17 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 18 times')
        .click(counterUndoBtn)
        .expect(counterBtn.innerText).eql('Clicked 16 times')
        .click(counterUndoBtn)
        .expect(counterBtn.innerText).eql('Clicked 14 times')
        .click(counterUndoBtn)
        .expect(counterBtn.innerText).eql('Clicked 12 times')
        .click(counterUndoBtn)
        .expect(counterBtn.innerText).eql('Clicked 10 times')
        .click(counterUndoBtn)
        .expect(counterBtn.innerText).eql('Clicked 8 times')
        .click(counterUndoBtn)
        .expect(counterBtn.innerText).eql('Clicked 6 times')
        .click(counterUndoBtn)
        .expect(counterBtn.innerText).eql('Clicked 4 times')
        .click(counterUndoBtn)
        .expect(counterBtn.innerText).eql('Clicked 2 times')
        .click(counterUndoBtn)
        .expect(counterBtn.innerText).eql('Clicked 0 times')
        .expect(counterUndoBtn.hasAttribute('disabled')).eql(true)
        .expect(counterRedoBtn.hasAttribute('disabled')).eql(false)
        .click(counterRedoBtn)
        .click(counterRedoBtn)
        .click(counterRedoBtn)
        .click(counterRedoBtn)
        .click(counterRedoBtn)
        .click(counterRedoBtn)
        .click(counterRedoBtn)
        .click(counterRedoBtn)
        .click(counterRedoBtn)
        .expect(counterBtn.innerText).eql('Clicked 18 times')
        .expect(counterRedoBtn.hasAttribute('disabled')).eql(true)
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 19 times')
        .click(counterBtn)
        .expect(counterBtn.innerText).eql('Clicked 20 times')
        .click(counterUndoBtn)
        .click(counterUndoBtn)
        .click(counterUndoBtn)
        .click(counterUndoBtn)
        .click(counterUndoBtn)
        .click(counterUndoBtn)
        .click(counterUndoBtn)
        .click(counterUndoBtn)
        .click(counterUndoBtn)
        .click(counterUndoBtn)
        .expect(counterBtn.innerText).eql('Clicked 2 times')
        .expect(counterUndoBtn.hasAttribute('disabled')).eql(true)
})