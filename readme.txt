
=== Custom Blocks Plugin ===
Contributors: GageW.Reed 
Tags: blocks, editor, customization  
Requires at least: 6.0  
Tested up to: 6.5  
Stable tag: 1.0.0  
License: GPLv2 or later  
License URI: https://www.gnu.org/licenses/gpl-2.0.html

== Description ==
These are my custom blocks for the Gutenberg editor. Includes a newsletter, interactive carosel, comparison blocks, and a testimonial slider for interesting quotes.

=== Blocks ===

- Interactive Gallery:  // Currently does not work
	- Insert the block, click “Add Images”, select multiple images from the Media Library.
	- Use the left/right buttons to preview; captions can be edited per image.
	- On the front-end, slides switch via arrows or dots; autoplay is configurable in block settings.

- Comparison Columns:   // Does not save content
	- Type the main heading and column titles; add bullet points in each column list.
	- Content saves when you update the page; ensure the block instance is reinserted after plugin updates.

- Newsletter Block:
	- Add title, image URL, source, and expanded text.
	- The “Show more” area toggles via the built-in script; button corners can be rounded by adding `border-radius` in the block’s CSS.

- Testimonial Slider:
	- Insert the block and add multiple testimonials with quote text and author.
	- Use the navigation controls in the editor to preview slides.
	- On the front-end, slides auto-rotate; users can navigate via arrows or dots.

== Installation ==
1. Upload the plugin folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Start using the new blocks in the editor

== Changelog ==
= 1.0.0 =
* Initial release with example block mostly polished
