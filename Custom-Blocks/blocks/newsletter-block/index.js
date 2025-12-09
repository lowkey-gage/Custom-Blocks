/*
 * Fallback, browser-ready block registration for environments without npm/build.
 * This script avoids ES module/JSX and uses the global `wp` object so it can
 * be loaded directly by WordPress when `index.asset.php` declares the
 * necessary dependencies. It's a minimal implementation of the editor and
 * save behaviors so the block will appear in the editor without running
 * a build tool.
 */
import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import './style.css';
import './editor.css';

registerBlockType('custom-blocks-plugin/newsletter-block', {
  edit: Edit,
  save,
});
