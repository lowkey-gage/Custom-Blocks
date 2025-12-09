import { useBlockProps, RichText, MediaUpload, InspectorControls } from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { heading, imageUrl, imageDesc, mainText, expandedText, isExpanded } = attributes;

    const toggleExpanded = () => setAttributes({ isExpanded: !isExpanded });

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                {/* Title and source desc */}
                <PanelBody title="Newsletter Settings">
                    <TextControl
                        label="Source Description"
                        value={imageDesc}
                        onChange={(value) => setAttributes({ imageDesc: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <RichText
                tagName="h2"
                placeholder="Enter heading..."
                value={heading}
                onChange={(value) => setAttributes({ heading: value })}
            />

            {/* Media upload button (opens media library) */}
            <MediaUpload
                onSelect={(media) => {
                    // Some WP versions return `url`, others `source_url` — try both.
                    const url = media && (media.url || media.source_url || (media.sizes && media.sizes.full && media.sizes.full.url));
                    if (url) {
                        setAttributes({ imageUrl: url });
                    }
                }}
                allowedTypes={['image']}
                render={({ open }) => (
                    <Button onClick={open} variant="primary">
                        {imageUrl ? 'Change Image' : 'Upload Image'}
                    </Button>
                )}
            />

            {/* Also allow pasting an image URL (useful in environments without media library) */}
            <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                <TextControl
                    label="Image URL (paste or enter a direct URL)"
                    value={imageUrl}
                    onChange={(value) => setAttributes({ imageUrl: value })}
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            {/* Preview immediately in the editor so the user can confirm the image */}
            {imageUrl ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img src={imageUrl} alt={imageDesc || 'Newsletter image'} style={{ maxWidth: '100%', height: 'auto', marginBottom: '8px' }} />
            ) : null}

            {imageDesc && <p className="source">{imageDesc}</p>}

            <RichText
                /* main and expanded text */
                tagName="p"
                placeholder="Enter newsletter text..."
                value={mainText}
                onChange={(value) => setAttributes({ mainText: value })}
            />

            {isExpanded && (
                <RichText
                    tagName="p"
                    placeholder="Enter expanded text..."
                    value={expandedText}
                    onChange={(value) => setAttributes({ expandedText: value })}
                />
            )}

            <Button onClick={toggleExpanded} variant="secondary">
                {isExpanded ? 'Read Less \u25b2' : 'Read More \u25bc'}
            </Button>
        </div>
    );
}
