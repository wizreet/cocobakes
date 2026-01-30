import { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { Icon } from '@iconify/react';
import { cx } from 'class-variance-authority';

// ============================================================================
// Types
// ============================================================================

interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
}

interface GalleryThumbnailProps {
  image: GalleryImage;
  index: number;
  onOpen: (index: number) => void;
}

interface CategoryButtonProps {
  category: string;
  isActive: boolean;
  onClick: () => void;
}

// ============================================================================
// CategoryButton Component (Memoized)
// ============================================================================

const CategoryButton = memo(function CategoryButton({
  category,
  isActive,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'font-medium rounded-full px-4 py-2 font-primary text-body-sm capitalize transition-all',
        isActive
          ? 'bg-fill-brand text-on-bg-fill-brand'
          : 'bg-surface text-secondary hover:bg-surface hover:text',
      )}
      aria-pressed={isActive}
    >
      {category}
    </button>
  );
});

// ============================================================================
// GalleryThumbnail Component (Memoized for performance)
// ============================================================================

const GalleryThumbnail = memo(function GalleryThumbnail({
  image,
  index,
  onOpen,
}: GalleryThumbnailProps) {
  const handleClick = useCallback(() => {
    onOpen(index);
  }, [index, onOpen]);

  return (
    <button
      onClick={handleClick}
      className="shadow-md hover:shadow-xl group relative aspect-square overflow-hidden rounded-lg bg-surface transition-all"
      aria-label={`View ${image.alt}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
        decoding="async"
      />
      <div className="bg-black/0 group-hover:bg-black/30 absolute inset-0 flex items-center justify-center transition-all">
        <Icon
          icon="heroicons:magnifying-glass-plus-solid"
          className="text-white h-10 w-10 opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
      {image.category && (
        <span className="bg-black/60 text-white absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-body-xs capitalize">
          {image.category}
        </span>
      )}
    </button>
  );
});

// ============================================================================
// LightboxThumbnail Component (Memoized)
// ============================================================================

interface LightboxThumbnailProps {
  image: GalleryImage;
  index: number;
  isActive: boolean;
  onClick: (e: React.MouseEvent, index: number) => void;
}

const LightboxThumbnail = memo(function LightboxThumbnail({
  image,
  index,
  isActive,
  onClick,
}: LightboxThumbnailProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onClick(e, index);
    },
    [index, onClick],
  );

  return (
    <button
      onClick={handleClick}
      className={cx(
        'h-12 w-12 flex-shrink-0 overflow-hidden rounded transition-all',
        isActive ? 'ring-white ring-2' : 'opacity-50 hover:opacity-100',
      )}
      aria-label={`Go to image ${index + 1}`}
      aria-current={isActive ? 'true' : undefined}
    >
      <img
        src={image.src}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </button>
  );
});

// ============================================================================
// ImageGallery Component
// ============================================================================

export const ImageGallery = memo(function ImageGallery({
  images,
  className,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Memoized categories
  const categories = useMemo(
    () =>
      [
        'all',
        ...new Set(images.map((img) => img.category).filter(Boolean)),
      ] as string[],
    [images],
  );

  // Memoized filtered images
  const filteredImages = useMemo(
    () =>
      filter === 'all'
        ? images
        : images.filter((img) => img.category === filter),
    [images, filter],
  );

  // Lightbox handlers
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
      setSelectedIndex(
        (selectedIndex - 1 + filteredImages.length) % filteredImages.length,
      );
    }
  }, [selectedIndex, filteredImages.length]);

  const handleThumbnailClick = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      setSelectedIndex(index);
    },
    [],
  );

  const handleFilterChange = useCallback((category: string) => {
    setFilter(category);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
        <nav
          className="mb-6 flex flex-wrap justify-center gap-2"
          aria-label="Gallery filters"
        >
          {categories.map((category) => (
            <CategoryButton
              key={category}
              category={category}
              isActive={filter === category}
              onClick={() => handleFilterChange(category)}
            />
          ))}
        </nav>
      )}

      {/* Image Grid */}
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4"
        role="list"
        aria-label="Gallery images"
      >
        {filteredImages.map((image, index) => (
          <GalleryThumbnail
            key={`${image.src}-${index}`}
            image={image}
            index={index}
            onOpen={openLightbox}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="bg-black/90 fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="bg-white/20 text-white hover:bg-white/30 absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            aria-label="Close lightbox"
          >
            <Icon icon="heroicons:x-mark-solid" className="h-6 w-6" />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            className="bg-white/20 text-white hover:bg-white/30 absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors"
            aria-label="Previous image"
          >
            <Icon icon="heroicons:chevron-left-solid" className="h-8 w-8" />
          </button>

          {/* Image */}
          <figure
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[selectedIndex].src}
              alt={filteredImages[selectedIndex].alt}
              className="shadow-2xl max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            />
            {/* Caption */}
            <figcaption className="from-black/70 to-transparent absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t p-4">
              <p className="text-white text-center font-secondary">
                {filteredImages[selectedIndex].alt}
              </p>
              <p className="text-white/70 text-center text-body-sm">
                {selectedIndex + 1} / {filteredImages.length}
              </p>
            </figcaption>
          </figure>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="bg-white/20 text-white hover:bg-white/30 absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors"
            aria-label="Next image"
          >
            <Icon icon="heroicons:chevron-right-solid" className="h-8 w-8" />
          </button>

          {/* Thumbnail strip */}
          <nav
            className="bg-black/50 absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 overflow-x-auto rounded-lg p-2"
            aria-label="Image thumbnails"
          >
            {filteredImages.map((img, index) => (
              <LightboxThumbnail
                key={`thumb-${img.src}-${index}`}
                image={img}
                index={index}
                isActive={index === selectedIndex}
                onClick={handleThumbnailClick}
              />
            ))}
          </nav>
        </div>
      )}
    </div>
  );
});

export default ImageGallery;
