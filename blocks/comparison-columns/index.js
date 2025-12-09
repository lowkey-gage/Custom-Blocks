(function () {
  const { registerBlockType } = wp.blocks;
  const { __ } = wp.i18n;
  const be = wp.blockEditor || wp.editor;
  const { RichText, InspectorControls, useBlockProps } = be;
  const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;

  registerBlockType('custom-blocks-plugin/comparison-columns', {
    title: __('Comparison Columns', 'custom-blocks-plugin'),
    description: __('Compare two similar things side by side.', 'custom-blocks-plugin'),
    icon: 'columns',
    category: 'layout',
    attributes: {
      mainTitle: { type: 'string', source: 'html', selector: 'h2.comparison-heading' },
      leftTitle: { type: 'string', source: 'html', selector: '.comparison-col.left h3.comparison-title' },
      rightTitle: { type: 'string', source: 'html', selector: '.comparison-col.right h3.comparison-title' },
      leftItems: {
        type: 'array',
        source: 'children',
        selector: '.comparison-col.left ul.comparison-list li',
        default: []
      },
      rightItems: {
        type: 'array',
        source: 'children',
        selector: '.comparison-col.right ul.comparison-list li',
        default: []
      },
      highlight: { type: 'string', default: 'none' },
      showLabels: { type: 'boolean', default: false },
      leftLabel: { type: 'string', default: 'Option A' },
      rightLabel: { type: 'string', default: 'Option B' }
    },

    edit(props) {
      const {
        attributes: {
          mainTitle, leftTitle, rightTitle, leftItems, rightItems,
          highlight = 'none', showLabels = false, leftLabel = 'Option A', rightLabel = 'Option B'
        },
        setAttributes
      } = props;

      // Normalize legacy strings -> arrays for list items
      const safeLeftItems = Array.isArray(leftItems)
        ? leftItems
        : (typeof leftItems === 'string' ? stringToLiArray(leftItems) : []);
      const safeRightItems = Array.isArray(rightItems)
        ? rightItems
        : (typeof rightItems === 'string' ? stringToLiArray(rightItems) : []);

      const blockProps = (be && be.useBlockProps)
        ? be.useBlockProps({ className: `comparison-columns highlight-${highlight}` })
        : { className: `comparison-columns highlight-${highlight}` };

      return wp.element.createElement(
        wp.element.Fragment,
        null,
        wp.element.createElement(
          InspectorControls,
          null,
          wp.element.createElement(
            PanelBody,
            { title: __('Settings', 'custom-blocks-plugin'), initialOpen: true },
            wp.element.createElement(SelectControl, {
              label: __('Highlight', 'custom-blocks-plugin'),
              value: highlight,
              options: [
                { label: __('None', 'custom-blocks-plugin'), value: 'none' },
                { label: __('Left', 'custom-blocks-plugin'), value: 'left' },
                { label: __('Right', 'custom-blocks-plugin'), value: 'right' }
              ],
              onChange: (val) => setAttributes({ highlight: val })
            }),
            wp.element.createElement(ToggleControl, {
              label: __('Show labels above columns', 'custom-blocks-plugin'),
              checked: showLabels,
              onChange: (val) => setAttributes({ showLabels: val })
            }),
            showLabels && wp.element.createElement(TextControl, {
              label: __('Left label', 'custom-blocks-plugin'),
              value: leftLabel,
              onChange: (val) => setAttributes({ leftLabel: val })
            }),
            showLabels && wp.element.createElement(TextControl, {
              label: __('Right label', 'custom-blocks-plugin'),
              value: rightLabel,
              onChange: (val) => setAttributes({ rightLabel: val })
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
          showLabels &&
            wp.element.createElement(
              'div',
              { className: 'comparison-labels' },
              wp.element.createElement('div', { className: 'label left' }, leftLabel || __('Option A', 'custom-blocks-plugin')),
              wp.element.createElement('div', { className: 'label right' }, rightLabel || __('Option B', 'custom-blocks-plugin'))
            ),

          wp.element.createElement(
            'div',
            { className: 'comparison-grid' },

            wp.element.createElement(
              'div',
              { className: 'comparison-col left' },
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
                placeholder: __('Add points… Press Enter for new item', 'custom-blocks-plugin'),
                value: leftItems,
                onChange: (val) => setAttributes({ leftItems: val }),
                multiline: 'li'
              })
            ),

            wp.element.createElement(
              'div',
              { className: 'comparison-col right' },
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
                placeholder: __('Add points… Press Enter for new item', 'custom-blocks-plugin'),
                value: rightItems,
                onChange: (val) => setAttributes({ rightItems: val }),
                multiline: 'li'
              })
            )
          )
        )
      );
    },

    save(props) {
      const {
        mainTitle, leftTitle, rightTitle, leftItems, rightItems,
        highlight = 'none', showLabels = false, leftLabel = 'Option A', rightLabel = 'Option B'
      } = props.attributes;

      const blockProps = (wp.blockEditor && wp.blockEditor.useBlockProps && wp.blockEditor.useBlockProps.save)
        ? wp.blockEditor.useBlockProps.save({ className: `comparison-columns highlight-${highlight}` })
        : { className: `comparison-columns highlight-${highlight}` };

      const renderList = (items) =>
        wp.element.createElement(
          'ul',
          { className: 'comparison-list' },
          (Array.isArray(items) ? items : []).map((text, i) =>
            wp.element.createElement('li', { key: i }, text)
          )
        );

      return wp.element.createElement(
        'div',
        blockProps,

        // Render heading only when content exists to match legacy posts
        mainTitle
          ? wp.element.createElement(RichText.Content, {
              tagName: 'h2',
              className: 'comparison-heading',
              value: mainTitle
            })
          : null,
        showLabels &&
          wp.element.createElement(
            'div',
            { className: 'comparison-labels' },
            wp.element.createElement('div', { className: 'label left' }, leftLabel || 'Option A'),
            wp.element.createElement('div', { className: 'label right' }, rightLabel || 'Option B')
          ),
        wp.element.createElement(
          'div',
          { className: 'comparison-grid' },

          wp.element.createElement(
            'div',
            { className: 'comparison-col left' },
            wp.element.createElement(RichText.Content, {
              tagName: 'h3',
              className: 'comparison-title',
              value: leftTitle
            }),
            renderList(leftItems)
          ),

          wp.element.createElement(
            'div',
            { className: 'comparison-col right' },
            wp.element.createElement(RichText.Content, {
              tagName: 'h3',
              className: 'comparison-title',
              value: rightTitle
            }),
            renderList(rightItems)
          )
        )
      );
    },

    deprecated: [
      {
        // Legacy: lists saved as UL HTML strings
        attributes: {
          mainTitle: { type: 'string', source: 'html', selector: 'h2.comparison-heading' },
          leftTitle: { type: 'string', source: 'html', selector: '.comparison-col.left h3.comparison-title' },
          rightTitle: { type: 'string', source: 'html', selector: '.comparison-col.right h3.comparison-title' },
          leftItems: { type: 'string', source: 'html', selector: '.comparison-col.left ul.comparison-list' },
          rightItems: { type: 'string', source: 'html', selector: '.comparison-col.right ul.comparison-list' },
          highlight: { type: 'string', default: 'none' },
          showLabels: { type: 'boolean', default: false },
          leftLabel: { type: 'string', default: 'Option A' },
          rightLabel: { type: 'string', default: 'Option B' }
        },
        migrate(attrs) {
          const toArray = (html) => stringToLiArray(html);
          return {
            ...attrs,
            leftItems: toArray(attrs.leftItems),
            rightItems: toArray(attrs.rightItems)
          };
        },
        save(props) {
          const {
            mainTitle, leftTitle, rightTitle, leftItems = '', rightItems = '',
            highlight = 'none', showLabels = false, leftLabel = 'Option A', rightLabel = 'Option B'
          } = props.attributes;

          const blockProps = (wp.blockEditor && wp.blockEditor.useBlockProps && wp.blockEditor.useBlockProps.save)
            ? wp.blockEditor.useBlockProps.save({ className: `comparison-columns highlight-${highlight}` })
            : { className: `comparison-columns highlight-${highlight}` };

          return wp.element.createElement(
            'div',
            blockProps,
            wp.element.createElement(RichText.Content, {
              tagName: 'h2',
              className: 'comparison-heading',
              value: mainTitle
            }),
            showLabels &&
              wp.element.createElement(
                'div',
                { className: 'comparison-labels' },
                wp.element.createElement('div', { className: 'label left' }, leftLabel || 'Option A'),
                wp.element.createElement('div', { className: 'label right' }, rightLabel || 'Option B')
              ),
            wp.element.createElement(
              'div',
              { className: 'comparison-grid' },
              wp.element.createElement(
                'div',
                { className: 'comparison-col left' },
                wp.element.createElement(RichText.Content, {
                  tagName: 'h3',
                  className: 'comparison-title',
                  value: leftTitle
                }),
                wp.element.createElement(RichText.Content, {
                  tagName: 'ul',
                  className: 'comparison-list',
                  value: leftItems
                })
              ),
              wp.element.createElement(
                'div',
                { className: 'comparison-col right' },
                wp.element.createElement(RichText.Content, {
                  tagName: 'h3',
                  className: 'comparison-title',
                  value: rightTitle
                }),
                wp.element.createElement(RichText.Content, {
                  tagName: 'ul',
                  className: 'comparison-list',
                  value: rightItems
                })
              )
            )
          );
        }
      }
    ]
  });
})();
  // Helper to normalize legacy string lists
  function stringToLiArray(html) {
    if (!html || typeof html !== 'string') return [];
    const div = document.createElement('div');
    div.innerHTML = html;
    return Array.from(div.querySelectorAll('li')).map(li => li.textContent || '');
  }
