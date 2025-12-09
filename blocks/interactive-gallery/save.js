import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const imgs = attributes && Array.isArray(attributes.images) ? attributes.images : [];
    const currentImageIndex = attributes && typeof attributes.currentImageIndex === 'number' ? attributes.currentImageIndex : 0;
    const autoplay = attributes && typeof attributes.autoplay === 'boolean' ? attributes.autoplay : false;
    const autoplaySpeed = attributes && typeof attributes.autoplaySpeed === 'number' ? attributes.autoplaySpeed : 3000;
    const blockProps = (useBlockProps && useBlockProps.save) ? useBlockProps.save() : {};

    if (!imgs.length) {
        return null;
    }

    return (
        <div {...blockProps}>
            <div 
                className="interactive-gallery" 
                data-total-images={imgs.length}
                data-autoplay={autoplay}
                data-autoplay-speed={autoplaySpeed}
            >
                <button 
                    type="button"
                    className="nav-button prev"
                    aria-label="Previous image"
                >
                    ❮
                </button>

                <div className="gallery-image-container">
                    {imgs.map(function(image, index) {
                        return (
                        <div 
                            key={(image && image.id) ? image.id : index} 
                            className="gallery-slide"
                            data-index={index}
                            style={{
                                opacity: index === currentImageIndex ? 1 : 0,
                                visibility: index === currentImageIndex ? 'visible' : 'hidden'
                            }}
                        >
                            <div className="gallery-image-wrapper">
                                <img
                                    src={(image && image.url) ? image.url : ''}
                                    alt={(image && image.alt) ? image.alt : ''}
                                    className="gallery-image"
                                />
                            </div>
                            {(image && image.caption) ? (
                                <figcaption className="gallery-caption">{image.caption}</figcaption>
                            ) : null}
                        </div>
                        );
                    })}
                    
                    <div className="carousel-indicators">
                        {imgs.map(function(_, index){
                            return (
                            <button
                                key={index}
                                type="button"
                                className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                                data-index={index}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                            );
                        })}
                    </div>
                </div>

                <button 
                    type="button"
                    className="nav-button next"
                    aria-label="Next image"
                >
                    ❯
                </button>
            </div>
        </div>
    );
}