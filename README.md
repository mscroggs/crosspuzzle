# Crosspuzzle

crosspuzzle is a Javascript library that can create interactive crossword/crossnumber website widgets.

## Usage

crosspuzzle can be used by including crosspuzzle.js in the `<head>` part of a HTML file:

```html
<script type='text/javascript' src='crosspuzzle.js'></script> 
```

Puzzles can then be created by making an empty div, then running the `crosspuzzle` function,
for example:

```html
<div id='crossword1'></div>
<script type='text/javascript'>
crosspuzzle("crossword1", {
    "grid": ["*SUM*", "SENOR", "IV*DG", "NEPAL", "*NIL*"],
    "clues": {"across": ["Add up.", "Spanish mister.", "Roman four.", "Non-continuous finite element.", "Country with non-rectangular flag.", "Footballer's zero."],
              "down": ["English sept.", "French one.", "Most common.", "opp &div; hyp.", "Rugeley Trent Valley.", "Greek p."]}
})
</script>
```

Detailed examples and usage instructions can be found in [example.html](example.html). This can be
viewed online at [mscroggs.github.io/crosspuzzle](https://mscroggs.github.io/crosspuzzle)

## License

crosspuzzle is available under an [MIT license](LICENSE.md).
