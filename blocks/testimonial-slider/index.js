(function () {
  const { registerBlockType } = wp.blocks;
  const { __ } = wp.i18n;
  const be = wp.blockEditor || wp.editor;
  const { InspectorControls, useBlockProps, RichText, MediaUpload } = be;
  const { PanelBody, ToggleControl, RangeControl, Button, TextControl, TextareaControl, SelectControl } = wp.components;

  function TestimonialCard({ item, index, onChange, onRemove }) {
    return wp.element.createElement(
      'div',
      { className: 'tsl-item-card' },
      wp.element.createElement(TextareaControl, {
        label: __('Quote', 'custom-blocks-plugin'),
        help: __('The testimonial text.', 'custom-blocks-plugin'),
        value: item.quote || '',
        onChange: (v) => onChange(index, 'quote', v)
      }),
      wp.element.createElement(TextControl, {
        label: __('Author', 'custom-blocks-plugin'),
        value: item.author || '',
        onChange: (v) => onChange(index, 'author', v)
      }),
      wp.element.createElement(TextControl, {
        label: __('Role/Company', 'custom-blocks-plugin'),
        value: item.role || '',
        onChange: (v) => onChange(index, 'role', v)
      }),
      wp.element.createElement(TextControl, {
        label: __('Avatar URL', 'custom-blocks-plugin'),
        value: item.avatarUrl || '',
        onChange: (v) => onChange(index, 'avatarUrl', v)
      }),
      wp.element.createElement(RangeControl, {
        label: __('Rating', 'custom-blocks-plugin'),
        value: typeof item.rating === 'number' ? item.rating : 5,
        onChange: (v) => onChange(index, 'rating', v),
        min: 0,
        max: 5,
        step: 1
      }),
      wp.element.createElement(Button, {
        isDestructive: true,
        variant: 'secondary',
        onClick: () => onRemove(index)
      }, __('Remove', 'custom-blocks-plugin'))
    );
  }

  registerBlockType('custom-blocks-plugin/testimonial-slider', {
    title: __('Testimonial Slider', 'custom-blocks-plugin'),
    description: __('Rotating customer testimonials with avatars and ratings.', 'custom-blocks-plugin'),
    icon: 'format-quote',
    category: 'widgets',

    edit(props) {
      const { attributes, setAttributes } = props;
      const {
        testimonials = [], autoplay = true, autoplaySpeed = 4000,
        showDots = true, showArrows = true, transition = 'fade', pauseOnHover = true
      } = attributes;

      const blockProps = useBlockProps({ className: `testimonial-slider-editor` });

      function addItem() {
        const next = [...testimonials, { quote: '', author: '', role: '', avatarUrl: '', rating: 5 }];
        setAttributes({ testimonials: next });
      }
      function updateItem(i, key, value) {
        const next = testimonials.map((t, idx) => idx === i ? { ...t, [key]: value } : t);
        setAttributes({ testimonials: next });
      }
      function removeItem(i) {
        const next = testimonials.filter((_, idx) => idx !== i);
        setAttributes({ testimonials: next });
      }

      return wp.element.createElement(
        wp.element.Fragment,
        null,
        wp.element.createElement(
          InspectorControls,
          null,
          wp.element.createElement(
            PanelBody,
            { title: __('Slider Settings', 'custom-blocks-plugin'), initialOpen: true },
            wp.element.createElement(ToggleControl, {
              label: __('Autoplay', 'custom-blocks-plugin'),
              checked: autoplay,
              onChange: (v) => setAttributes({ autoplay: v })
            }),
            wp.element.createElement(RangeControl, {
              label: __('Autoplay speed (ms)', 'custom-blocks-plugin'),
              value: autoplaySpeed,
              min: 1000,
              max: 10000,
              step: 500,
              onChange: (v) => setAttributes({ autoplaySpeed: v })
            }),
            wp.element.createElement(ToggleControl, {
              label: __('Pause on hover', 'custom-blocks-plugin'),
              checked: pauseOnHover,
              onChange: (v) => setAttributes({ pauseOnHover: v })
            }),
            wp.element.createElement(ToggleControl, {
              label: __('Show dots', 'custom-blocks-plugin'),
              checked: showDots,
              onChange: (v) => setAttributes({ showDots: v })
            }),
            wp.element.createElement(ToggleControl, {
              label: __('Show arrows', 'custom-blocks-plugin'),
              checked: showArrows,
              onChange: (v) => setAttributes({ showArrows: v })
            }),
            wp.element.createElement(SelectControl, {
              label: __('Transition', 'custom-blocks-plugin'),
              value: transition,
              options: [
                { label: __('Fade', 'custom-blocks-plugin'), value: 'fade' },
                { label: __('Slide', 'custom-blocks-plugin'), value: 'slide' }
              ],
              onChange: (v) => setAttributes({ transition: v })
            })
          )
        ),
        wp.element.createElement(
          'div',
          blockProps,
          wp.element.createElement('div', { className: 'tsl-items' },
            (testimonials.length === 0)
              ? wp.element.createElement('p', { className: 'description' }, __('No testimonials yet. Add one below.', 'custom-blocks-plugin'))
              : testimonials.map((item, i) => wp.element.createElement(TestimonialCard, {
                  key: i,
                  item,
                  index: i,
                  onChange: updateItem,
                  onRemove: removeItem
                }))
          ),
          wp.element.createElement(Button, { variant: 'primary', onClick: addItem }, __('Add Testimonial', 'custom-blocks-plugin'))
        )
      );
    },

    save(props) {
      const { attributes } = props;
      const {
        testimonials = [], autoplay = true, autoplaySpeed = 4000,
        showDots = true, showArrows = true, transition = 'fade', pauseOnHover = true
      } = attributes;

      const blockProps = (wp.blockEditor && wp.blockEditor.useBlockProps && wp.blockEditor.useBlockProps.save)
        ? wp.blockEditor.useBlockProps.save({ className: `testimonial-slider transition-${transition}` })
        : { className: `testimonial-slider transition-${transition}` };

      function renderStars(n) {
        const count = Math.max(0, Math.min(5, Number(n || 0)));
        const stars = Array.from({ length: 5 }).map((_, i) => (i < count ? '★' : '☆')).join('');
        return stars;
      }

      return wp.element.createElement(
        'div',
        { ...blockProps,
          'data-autoplay': String(autoplay),
          'data-autoplay-speed': String(autoplaySpeed),
          'data-show-dots': String(showDots),
          'data-show-arrows': String(showArrows),
          'data-pause-on-hover': String(pauseOnHover)
        },
        wp.element.createElement(
          'div',
          { className: 'tsl-slides' },
          testimonials.map(function (t, idx) {
            return wp.element.createElement(
              'div',
              { className: 'tsl-slide' + (idx === 0 ? ' active' : '') },
              t.quote && wp.element.createElement('blockquote', { className: 'tsl-quote' }, t.quote),
              wp.element.createElement('div', { className: 'tsl-meta' },
                t.avatarUrl && wp.element.createElement('img', { className: 'tsl-avatar', src: t.avatarUrl, alt: t.author || '' }),
                wp.element.createElement('div', { className: 'tsl-text' },
                  t.author && wp.element.createElement('div', { className: 'tsl-author' }, t.author),
                  t.role && wp.element.createElement('div', { className: 'tsl-role' }, t.role),
                  (typeof t.rating !== 'undefined') && wp.element.createElement('div', { className: 'tsl-rating', 'data-rating': String(t.rating) }, renderStars(t.rating))
                )
              )
            );
          })
        ),
        showArrows && wp.element.createElement('button', { className: 'tsl-nav prev', type: 'button', 'aria-label': __('Previous', 'custom-blocks-plugin') }, '‹'),
        showArrows && wp.element.createElement('button', { className: 'tsl-nav next', type: 'button', 'aria-label': __('Next', 'custom-blocks-plugin') }, '›'),
        showDots && wp.element.createElement('div', { className: 'tsl-dots' })
      );
    }
  });
})();
