/*
 * Browser-ready build for the Newsletter Block.
 * This file uses the global `wp` object (wp.blocks, wp.element, wp.blockEditor, wp.components)
 * so it can be loaded directly by WordPress without a bundler.
 */
(function (wp) {
  if (!wp || !wp.blocks) {
    return;
  }

  var registerBlockType = wp.blocks.registerBlockType;
  var el = wp.element.createElement;
  var RichText = wp.blockEditor && wp.blockEditor.RichText ? wp.blockEditor.RichText : (wp.richText || {});
  var useBlockProps = (wp.blockEditor && wp.blockEditor.useBlockProps) || function () { return {}; };
  var InspectorControls = (wp.blockEditor && wp.blockEditor.InspectorControls) || function () { return null; };
  var PanelBody = (wp.components && wp.components.PanelBody) || function (props) { return el('div', null, props.children); };
  var TextControl = (wp.components && wp.components.TextControl) || function (props) {
    return el('input', {
      type: 'text',
      value: props.value || '',
      placeholder: props.placeholder || '',
      onChange: function (e) { props.onChange && props.onChange(e.target.value); }
    });
  };
  var Button = (wp.components && wp.components.Button) || function (props) { return el('button', props, props.children); };
  var MediaUpload = (wp.blockEditor && wp.blockEditor.MediaUpload) || (wp.editor && wp.editor.MediaUpload) || null;

  registerBlockType('custom-blocks-plugin/newsletter-block', {
    edit: function (props) {
      var attributes = props.attributes || {};
      var setAttributes = props.setAttributes || function () {};
      var heading = attributes.heading || '';
      var imageUrl = attributes.imageUrl || '';
      var imageDesc = attributes.imageDesc || '';
      var mainText = attributes.mainText || '';
      var expandedText = attributes.expandedText || '';
      var isExpanded = attributes.isExpanded || false;

      function toggleExpanded() {
        setAttributes({ isExpanded: !isExpanded });
      }

      return el(
        'div',
        useBlockProps(),
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: 'Newsletter Settings' },
            el(TextControl, {
              label: 'Source Description',
              value: imageDesc,
              onChange: function (value) { setAttributes({ imageDesc: value }); }
            })
          )
        ),
        el(RichText, {
          tagName: 'h2',
          placeholder: 'Enter heading...',
          value: heading,
          onChange: function (value) { setAttributes({ heading: value }); }
        }),
        // MediaUpload button (if available) and a URL input so users can paste a direct URL.
        el('div', null,
          MediaUpload ? el(MediaUpload, {
            onSelect: function (media) {
              var url = '';
              if (media) {
                url = media.url || media.source_url || (media.sizes && media.sizes.full && media.sizes.full.url) || '';
              }
              if (url) {
                setAttributes({ imageUrl: url });
              }
            },
            allowedTypes: ['image'],
            render: function (obj) { return el(Button, { onClick: obj.open, variant: 'primary' }, imageUrl ? 'Change Image' : 'Upload Image'); }
          }) : null,
          el('div', null, el('input', {
            type: 'text',
            placeholder: 'Image URL',
            value: imageUrl,
            onChange: function (e) { setAttributes({ imageUrl: e.target.value }); }
          }))
        ),
+        // Preview in editor
  imageUrl && el('img', { src: imageUrl, alt: imageDesc, style: { maxWidth: '100%', height: 'auto', marginBottom: '8px', display: 'block' } }),
        imageDesc && el('p', { className: 'source' }, imageDesc),
        el(RichText, {
          tagName: 'p',
          placeholder: 'Enter newsletter text...',
          value: mainText,
          onChange: function (value) { setAttributes({ mainText: value }); }
        }),
        isExpanded && el(RichText, {
          tagName: 'p',
          placeholder: 'Enter expanded text...',
          value: expandedText,
          onChange: function (value) { setAttributes({ expandedText: value }); }
        }),
        el(Button, { onClick: toggleExpanded, variant: 'secondary' }, isExpanded ? 'Read Less ▲' : 'Read More ▼')
      );
    },

    save: function (props) {
      var attributes = props.attributes || {};
      var heading = attributes.heading || '';
      var imageUrl = attributes.imageUrl || '';
      var imageDesc = attributes.imageDesc || '';
      var mainText = attributes.mainText || '';
      var expandedText = attributes.expandedText || '';
      var isExpanded = attributes.isExpanded || false;

      return el(
  'div',
  (useBlockProps.save && useBlockProps.save()) || { className: 'newsletter-block' },
        heading && el(RichText.Content, { tagName: 'h2', value: heading }),
        imageUrl && el('img', { src: imageUrl, alt: imageDesc }),
        imageDesc && el('p', { className: 'source' }, imageDesc),
        mainText && el(RichText.Content, { tagName: 'p', value: mainText }),
        expandedText && el('div', { className: 'expanded-text', hidden: !isExpanded },
          el(RichText.Content, { tagName: 'p', value: expandedText })
        ),
        el('button', { className: 'toggle-button', type: 'button', 'aria-expanded': isExpanded ? 'true' : 'false' }, isExpanded ? 'Read Less ▲' : 'Read More ▼')
      );
    }
  });
})(window.wp);
