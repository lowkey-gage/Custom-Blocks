import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { heading, imageUrl, imageDesc, mainText, expandedText, isExpanded } = attributes;

    return (
        <div {...useBlockProps.save()} className="newsletter-block">
            {heading && <RichText.Content tagName="h2" value={heading} />}
            {imageUrl && <img src={imageUrl} alt={imageDesc} />}
            {imageDesc && <p className="source">{imageDesc}</p>}
            {mainText && <RichText.Content tagName="p" value={mainText} />}
            {expandedText && (
                <div className="expanded-text" hidden={!isExpanded}>
                    <RichText.Content tagName="p" value={expandedText} />
                </div>
            )}
            <button className="toggle-button" type="button" aria-expanded={isExpanded ? 'true' : 'false'}>
                {isExpanded ? 'Read Less \u25b2' : 'Read More \u25bc'}
            </button>
        </div>
    );
}
