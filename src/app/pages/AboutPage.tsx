import { motion } from 'motion/react';
import { portfolioImages } from '@/app/data/portfolioData';

export function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-16 items-center mb-32"
        >
          <div className="aspect-[3/4] overflow-hidden order-2 md:order-1">
            <img
              src={portfolioImages[5].url}
              alt="Photographer Portrait"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h1 className="text-6xl md:text-7xl mb-8">About Me</h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              I'm a visual storyteller based in Ghana-Kumasi, dedicated to capturing the beauty
              and emotion in every frame. With over a decade of experience, I've had the privilege
              of documenting countless stories across weddings, portraits, and editorial work.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              My approach combines technical precision with artistic vision, creating images
              that are both timeless and deeply personal.
            </p>
          </div>
        </motion.div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl mb-12">My Philosophy</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-2xl mb-4">Authenticity</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Capturing genuine moments and real emotions, not posed perfection.
                </p>
              </div>
              <div>
                <h3 className="text-2xl mb-4">Artistry</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Blending technical skill with creative vision to create unique imagery.
                </p>
              </div>
              <div>
                <h3 className="text-2xl mb-4">Timelessness</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Creating images that will remain meaningful for generations.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-32 bg-secondary p-12 md:p-16"
        >
          <h2 className="text-4xl mb-12">Experience & Recognition</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl mb-4 text-muted-foreground tracking-wider uppercase">
                Selected Clients
              </h3>
              <ul className="space-y-2 text-lg">
                <li>• Vogue Magazine</li>
                <li>• Harper's Bazaar</li>
                <li>• The New York Times</li>
                <li>• Various Private Clients</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-muted-foreground tracking-wider uppercase">
                Awards & Features
              </h3>
              <ul className="space-y-2 text-lg">
                <li>• WPJA Top 10 Photographer 2024</li>
                <li>• Featured in Rangefinder Magazine</li>
                <li>• PDN 30 Emerging Photographers</li>
                <li>• International Photography Awards</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center py-20"
        >
          <blockquote className="text-3xl md:text-4xl italic max-w-3xl mx-auto leading-relaxed">
            "Photography is the art of frozen time, the ability to store emotion and feelings
            within a single frame."
          </blockquote>
        </motion.div>
      </div>
    </div>
  );
}
