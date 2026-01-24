import { motion } from 'motion/react';
import { useParams } from 'react-router-dom';
import { portfolioImages } from '@/app/data/portfolioData';

export function AlbumDetailPage() {
  const { id } = useParams();
  const albumImages = portfolioImages.filter((img) => img.category === 'Weddings');

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center"
        >
          <h1 className="text-6xl md:text-7xl mb-6">Wedding Album</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A beautiful celebration of love, captured in timeless moments.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span>Location: California</span>
            <span>•</span>
            <span>Date: June 2025</span>
            <span>•</span>
            <span>Category: Wedding</span>
          </div>
        </motion.div>

        {/* Story-driven layout */}
        <div className="space-y-32">
          {albumImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={index % 2 === 0 ? '' : 'md:ml-32'}
            >
              <div className="aspect-[3/2] overflow-hidden mb-8">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {image.description && (
                <div className="max-w-xl mx-auto text-center">
                  <h3 className="text-2xl mb-4">{image.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {image.description}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Cinematic Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-32 py-20 text-center"
        >
          <blockquote className="text-3xl md:text-4xl italic max-w-3xl mx-auto leading-relaxed">
            "In every wedding, there's a story waiting to be told through light and shadow."
          </blockquote>
        </motion.div>
      </div>
    </div>
  );
}
