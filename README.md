# Crosspuzzle

crosspuzzle is a Javascript library that can create interactive crossword/crossnumber website widgets.
It is used to create interactive puzzle for [Chalkdust Magazine](https://chalkdustmagazine.com/regulars/crossnumber/prize-crossnumber-issue-21/) and [mscroggs.co.uk](https://mscroggs.co.uk/blog/116)

## Usage

crosspuzzle can be used by uploading crosspuzzle.js and crosspuzzle.css to your server and including them in the `<head>` part of a HTML file:

```html
<script type='text/javascript' src='crosspuzzle.js'></script>
<link type='text/css' rel='stylesheet' src='crosspuzzle.css' />
```

Alternatively, you can load the latest version of these files directly from GitHub pages:

```html
<script type='text/javascript' src='https://mscroggs.github.io/crosspuzzle/crosspuzzle.js'></script>
<link type='text/css' rel='stylesheet' src='https://mscroggs.github.io/crosspuzzle/crosspuzzle.css' />
```

Or you can load the latest release of crosspuzzle directly from GitHub pages:

```html
<script type='text/javascript' src='https://mscroggs.github.io/crosspuzzle/v0.4.0/crosspuzzle.js'></script>
<link type='text/css' rel='stylesheet' src='https://mscroggs.github.io/crosspuzzle/v0.4.0/crosspuzzle.css' />
```

Details of how to include any release of crosspuzzle can be found at [mscroggs.github.io/crosspuzzle/releases](https://mscroggs.github.io/crosspuzzle/releases)

Puzzles can then be created by making an empty div, then running the `crosspuzzle` function,
for example:

```html
<div id='crossword1'></div>
<script type='text/javascript'>
crosspuzzle({
    "id": "crossword1",
    "grid": ["*SUM*", "SENOR", "IV*DG", "NEPAL", "*NIL*"],
    "clues": {"across": ["Add up.", "Spanish mister.", "Roman four.", "Non-continuous finite element.", "Country with non-rectangular flag.", "Footballer's zero."],
              "down": ["English sept.", "French one.", "Most common.", "opp &div; hyp.", "Rugeley Trent Valley.", "Greek p."]}
})
</script>
```

Detailed examples and usage instructions can be found in [examples.html](examples.html). This can be
viewed online at [mscroggs.github.io/crosspuzzle](https://mscroggs.github.io/crosspuzzle)

## License

crosspuzzle is available under an [MIT license](LICENSE.md).
