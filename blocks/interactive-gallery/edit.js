import { useBlockProps, MediaUpload, MediaUploadCheck, RichText, InspectorControls } from '@wordpress/block-editor';
import { Button, ButtonGroup, Placeholder, PanelBody, ToggleControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
    const { images, currentImageIndex, autoplay, autoplaySpeed } = attributes;
    const blockProps = useBlockProps();

    const onSelectImages = (newImages) => {
        setAttributes({
            images: newImages.map(image => ({
                url: image.url || image.sizes?.full?.url || '',
                alt: image.alt || '',
                id: image.id,
                caption: image.caption || ''
            })),
            currentImageIndex: 0
        });
    };

    const navigateImage = (direction) => {
        const newIndex = currentImageIndex + direction;
        if (newIndex >= 0 && newIndex < images.length) {
            setAttributes({ currentImageIndex: newIndex });
        }
    };

    if (!images.length) {
        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Carousel Settings', 'custom-blocks-plugin')}>
                        <ToggleControl
                            label={__('Autoplay', 'custom-blocks-plugin')}
                            checked={autoplay}
                            onChange={(value) => setAttributes({ autoplay: value })}
                            help={__('Automatically rotate through images', 'custom-blocks-plugin')}
                        />
                        {autoplay && (
                            <RangeControl
                                label={__('Autoplay Speed (ms)', 'custom-blocks-plugin')}
                                value={autoplaySpeed}
                                onChange={(value) => setAttributes({ autoplaySpeed: value })}
                                min={1000}
                                max={10000}
                                step={500}
                                help={__('Time between slide transitions', 'custom-blocks-plugin')}
                            />
                        )}
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <Placeholder
                        icon="format-gallery"
                        label={__('Interactive Carousel', 'custom-blocks-plugin')}
                        instructions={__('Create your carousel by adding images from your media library or uploading new ones.', 'custom-blocks-plugin')}
                        className="interactive-gallery-placeholder"
                    >
                    <div className="gallery-upload-instructions">
                        <p>{__('You can:', 'custom-blocks-plugin')}</p>
                        <ul>
                            <li>{__('Upload new images from your computer', 'custom-blocks-plugin')}</li>
                            <li>{__('Select existing images from your Media Library', 'custom-blocks-plugin')}</li>
                            <li>{__('Add multiple images at once', 'custom-blocks-plugin')}</li>
                        </ul>
                    </div>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImages}
                            allowedTypes={['image']}
                            multiple
                            value={images.map(img => img.id)}
                            render={({ open }) => (
                                <div className="gallery-upload-buttons">
                                    <Button
                                        onClick={open}
                                        variant="primary"
                                        icon="upload"
                                        className="gallery-upload-button"
                                    >
                                        {__('Add Images', 'custom-blocks-plugin')}
                                    </Button>
                                    <p className="gallery-upload-hint">
                                        {__('Tip: Select multiple images by holding Ctrl/Cmd while clicking', 'custom-blocks-plugin')}
                                    </p>
                                </div>
                            )}
                        />
                    </MediaUploadCheck>
                </Placeholder>
            </div>
            </>
        );
    }

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Carousel Settings', 'custom-blocks-plugin')}>
                    <ToggleControl
                        label={__('Autoplay', 'custom-blocks-plugin')}
                        checked={autoplay}
                        onChange={(value) => setAttributes({ autoplay: value })}
                        help={__('Automatically rotate through images', 'custom-blocks-plugin')}
                    />
                    {autoplay && (
                        <RangeControl
                            label={__('Autoplay Speed (ms)', 'custom-blocks-plugin')}
                            value={autoplaySpeed}
                            onChange={(value) => setAttributes({ autoplaySpeed: value })}
                            min={1000}
                            max={10000}
                            step={500}
                            help={__('Time between slide transitions', 'custom-blocks-plugin')}
                        />
                    )}
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <div className="interactive-gallery">
                    <button 
                        type="button"
                        className="nav-button prev"
                        onClick={() => navigateImage(-1)}
                        aria-label={__('Previous image', 'custom-blocks-plugin')}
                    >
                        ❮
                    </button>
                    
                    <div className="gallery-image-container">
                        <div className="gallery-image-wrapper">
                            <img
                                src={images[currentImageIndex].url}
                                alt={images[currentImageIndex].alt}
                                className="gallery-image"
                            />
                        </div>
                        <RichText
                            tagName="figcaption"
                            className="gallery-caption"
                            value={images[currentImageIndex].caption}
                            onChange={(caption) => {
                                const newImages = [...images];
                                newImages[currentImageIndex] = {
                                    ...newImages[currentImageIndex],
                                    caption
                                };
                                setAttributes({ images: newImages });
                            }}
                            placeholder={__('Write caption…', 'custom-blocks-plugin')}
                        />
                        
                        <div className="carousel-indicators">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => setAttributes({ currentImageIndex: index })}
                                    aria-label={__(`Go to slide ${index + 1}`, 'custom-blocks-plugin')}
                                />
                            ))}
                        </div>
                    </div>

                    <button 
                        type="button"
                        className="nav-button next"
                        onClick={() => navigateImage(1)}
                        aria-label={__('Next image', 'custom-blocks-plugin')}
                    >
                        ❯
                    </button>

                    <div className="gallery-controls">
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImages}
                                allowedTypes={['image']}
                                multiple
                                value={images.map(img => img.id)}
                                render={({ open }) => (
                                    <Button
                                        onClick={open}
                                        variant="secondary"
                                    >
                                        {__('Edit Gallery', 'custom-blocks-plugin')}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                    </div>
                </div>
            </div>
        </>
    );
}