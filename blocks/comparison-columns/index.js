(function () {
  const { registerBlockType } = wp.blocks;
  const { __ } = wp.i18n;
  const be = wp.blockEditor || wp.editor;
  const { RichText, MediaUpload, MediaUploadCheck, InspectorControls, useBlockProps } = be;
  const { PanelBody, TextControl, Button } = wp.components;

  registerBlockType('custom-blocks-plugin/comparison-columns', {
    title: __('Comparison Columns', 'custom-blocks-plugin'),
    description: __('Two columns with a small image and bullet points.', 'custom-blocks-plugin'),
    icon: 'columns',
    category: 'layout',
    attributes: {
      // Align selectors with block.json
      mainTitle: { type: 'string', source: 'html', selector: '.comparison-heading' },
      leftTitle: { type: 'string', source: 'html', selector: '.comparison-col.left .comparison-title' },
      rightTitle: { type: 'string', source: 'html', selector: '.comparison-col.right .comparison-title' },
      leftImageUrl: { type: 'string', default: '' },
      leftImageAlt: { type: 'string', default: '' },
      rightImageUrl: { type: 'string', default: '' },
      rightImageAlt: { type: 'string', default: '' },
      // Children should be read from the list container per block.json
      leftItems: { type: 'array', source: 'children', selector: '.comparison-col.left .comparison-list', default: [] },
      rightItems: { type: 'array', source: 'children', selector: '.comparison-col.right .comparison-list', default: [] }
    },

    edit(props) {
      const { attributes, setAttributes } = props;
      const { mainTitle, leftTitle, rightTitle, leftImageUrl, leftImageAlt, rightImageUrl, rightImageAlt, leftItems, rightItems } = attributes;

      const blockProps = (be && be.useBlockProps)
        ? be.useBlockProps({ className: 'comparison-columns' })
        : { className: 'comparison-columns' };

      const renderImageControl = (position) => {
        const urlKey = position === 'left' ? 'leftImageUrl' : 'rightImageUrl';
        const altKey = position === 'left' ? 'leftImageAlt' : 'rightImageAlt';
        const url = attributes[urlKey];
        const alt = attributes[altKey];
        return wp.element.createElement(
          'div',
          { className: 'comparison-image' },
          url
            ? wp.element.createElement('img', { src: url, alt: alt || '' })
            : null,
          wp.element.createElement(MediaUploadCheck, null,
            wp.element.createElement(MediaUpload, {
              onSelect: (media) => setAttributes({ [urlKey]: media?.url || '', [altKey]: media?.alt || '' }),
              allowedTypes: ['image'],
              render: ({ open }) => wp.element.createElement(Button, { onClick: open, isSecondary: true }, url ? __('Replace image', 'custom-blocks-plugin') : __('Add image', 'custom-blocks-plugin'))
            })
          ),
          wp.element.createElement(TextControl, {
            label: __('Alt text', 'custom-blocks-plugin'),
            value: alt,
            onChange: (val) => setAttributes({ [altKey]: val })
          })
        );
      };

      return wp.element.createElement(
        wp.element.Fragment,
        null,
        wp.element.createElement(
          InspectorControls,
          null,
          wp.element.createElement(
            PanelBody,
            { title: __('Block Settings', 'custom-blocks-plugin'), initialOpen: true },
            wp.element.createElement(TextControl, {
              label: __('Main title', 'custom-blocks-plugin'),
              value: mainTitle || '',
              onChange: (val) => setAttributes({ mainTitle: val })
            })
          )
        ),

        wp.element.createElement(
          'div',
          blockProps,

          wp.element.createElement(RichText, {
            tagName: 'h2',
            className: 'comparison-heading',
            placeholder: __('Add a title…', 'custom-blocks-plugin'),
            value: mainTitle,
            onChange: (val) => setAttributes({ mainTitle: val })
          }),

          wp.element.createElement(
            'div',
            { className: 'comparison-grid' },

            wp.element.createElement(
              'div',
              { className: 'comparison-col left' },
              renderImageControl('left'),
              wp.element.createElement(RichText, {
                tagName: 'h3',
                className: 'comparison-title',
                placeholder: __('Left title…', 'custom-blocks-plugin'),
                value: leftTitle,
                onChange: (val) => setAttributes({ leftTitle: val })
              }),
              wp.element.createElement(RichText, {
                tagName: 'ul',
                className: 'comparison-list',
                placeholder: __('Add bullet points… Press Enter', 'custom-blocks-plugin'),
                value: Array.isArray(leftItems) ? leftItems : [],
                onChange: (val) => setAttributes({ leftItems: val }),
                multiline: 'li'
              })
            ),

            wp.element.createElement(
              'div',
              { className: 'comparison-col right' },
              renderImageControl('right'),
              wp.element.createElement(RichText, {
                tagName: 'h3',
                className: 'comparison-title',
                placeholder: __('Right title…', 'custom-blocks-plugin'),
                value: rightTitle,
                onChange: (val) => setAttributes({ rightTitle: val })
              }),
              wp.element.createElement(RichText, {
                tagName: 'ul',
                className: 'comparison-list',
                placeholder: __('Add bullet points… Press Enter', 'custom-blocks-plugin'),
                value: Array.isArray(rightItems) ? rightItems : [],
                onChange: (val) => setAttributes({ rightItems: val }),
                multiline: 'li'
              })
            )
          )
        )
      );
    },

    save(props) {
      const { attributes } = props;
      const { mainTitle, leftTitle, rightTitle, leftItems, rightItems } = attributes;

      const blockProps = (wp.blockEditor && wp.blockEditor.useBlockProps && wp.blockEditor.useBlockProps.save)
        ? wp.blockEditor.useBlockProps.save({ className: 'comparison-columns' })
        : { className: 'comparison-columns' };

      // Use RichText.Content to output saved attributes so user input persists
      return wp.element.createElement(
        'div',
        blockProps,

        wp.element.createElement(wp.blockEditor.RichText.Content || be.RichText.Content, {
          tagName: 'h2',
          className: 'comparison-heading',
          value: mainTitle || ''
        }),

        wp.element.createElement(
          'div',
          { className: 'comparison-grid' },

          wp.element.createElement(
            'div',
            { className: 'comparison-col left' },
            wp.element.createElement(wp.blockEditor.RichText.Content || be.RichText.Content, {
              tagName: 'h3',
              className: 'comparison-title',
              value: leftTitle || ''
            }),
            wp.element.createElement(wp.blockEditor.RichText.Content || be.RichText.Content, {
              tagName: 'ul',
              className: 'comparison-list',
              value: Array.isArray(leftItems) ? leftItems : []
            })
          ),

          wp.element.createElement(
            'div',
            { className: 'comparison-col right' },
            wp.element.createElement(wp.blockEditor.RichText.Content || be.RichText.Content, {
              tagName: 'h3',
              className: 'comparison-title',
              value: rightTitle || ''
            }),
            wp.element.createElement(wp.blockEditor.RichText.Content || be.RichText.Content, {
              tagName: 'ul',
              className: 'comparison-list',
              value: Array.isArray(rightItems) ? rightItems : []
            })
          )
        )
      );
    }
  });
})();
