# Git vs Git

Simple jquery *widget* that displays a stats table comparing multiple GitHub repositories.

## Example

![Git vs Git screenshot](/demo/example.gif "Example screenshot")

## Quick start

1. Create a `<div>` with class name of `gvg` and attribute `data-repos` containing *comma-delimited* repositories. (Note: full user and repo name required)

		<div class="gvg" data-repos="jquery/jquery,angular/angular.js"></div>

2. Include jquery + javascript files.

		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
		<script src="jquery.gvg.min.js"></script>

3. [ *optional* ] Default widget styling can be overwritten with CSS. Inspect generated table to style.

		<style>
			div.gvg{ width:900px; }
			table.gvg-ring{ font-size:16px; }
			.gvg-ring tfoot th{ text-align:left; }
		</style>

## Requires

* jQuery v1.6.0 and up
* Major browsers, but IE 9+

## License

The MIT License (MIT).
