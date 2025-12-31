import { useState, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { cx } from 'class-variance-authority';

interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...new Set(images.map(img => img.category).filter(Boolean))];

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter);

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = '';
  }, []);

  const goToNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % filteredImages.length);
    }
  }, [selectedIndex, filteredImages.length]);

  const goToPrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  }, [selectedIndex, filteredImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'ArrowLeft':
          goToPrev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeLightbox, goToNext, goToPrev]);

  return (
    <div className={className}>
      {/* Category Filters */}
      {categories.length > 1 && (
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={cx(
                'rounded-full px-4 py-2 font-primary text-body-sm font-medium capitalize transition-all',
                filter === category
                  ? 'bg-fill-brand text-on-bg-fill-brand'
                  : 'bg-surface text-secondary hover:bg-surface hover:text'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {filteredImages.map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-surface shadow-md transition-all hover:shadow-xl"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30">
              <Icon
                icon="heroicons:magnifying-glass-plus-solid"
                className="h-10 w-10 text-white opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
            {image.category && (
              <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-body-xs text-white capitalize">
                {image.category}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
            aria-label="Close"
          >
            <Icon icon="heroicons:x-mark-solid" className="h-6 w-6" />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
            aria-label="Previous image"
          >
            <Icon icon="heroicons:chevron-left-solid" className="h-8 w-8" />
          </button>

          {/* Image */}
          <div 
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[selectedIndex].src}
              alt={filteredImages[selectedIndex].alt}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-center font-secondary text-white">
                {filteredImages[selectedIndex].alt}
              </p>
              <p className="text-center text-body-sm text-white/70">
                {selectedIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
            aria-label="Next image"
          >
            <Icon icon="heroicons:chevron-right-solid" className="h-8 w-8" />
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 overflow-x-auto rounded-lg bg-black/50 p-2">
            {filteredImages.map((img, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                className={cx(
                  'h-12 w-12 flex-shrink-0 overflow-hidden rounded transition-all',
                  index === selectedIndex ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-100'
                )}
              >
                <img
                  src={img.src}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
