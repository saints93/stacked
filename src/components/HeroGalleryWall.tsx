"use client";

interface HeroGalleryWallProps {
  images: string[];
}

// Simple seeded random for consistent server/client results
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const shuffleWithSeed = (array: string[], seed: number): string[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export default function HeroGalleryWall({ images }: HeroGalleryWallProps) {
  // Grid configuration: 45 rows x 25 columns = 1125 unique cards
  // Tripled for infinite scroll = ensures full coverage at all animation positions
  // Very many rows to cover all viewport corners when rotated at -25deg
  const rowCount = 45;
  const colCount = 25;
  const needed = rowCount * colCount;

  // Create a stable grid of images using deterministic shuffle
  const gridImages = (() => {
    const result: string[] = [];
    
    // Use stable seed based on image count for consistent SSR/client rendering
    const shuffled = shuffleWithSeed(images, images.length * 42);
    
    while (result.length < needed) {
      result.push(...shuffled);
    }
    
    return result.slice(0, needed);
  })();

  // Create rows for the isometric grid
  const rows = (() => {
    const result: string[][] = [];
    
    for (let i = 0; i < rowCount; i++) {
      result.push(gridImages.slice(i * colCount, (i + 1) * colCount));
    }
    
    return result;
  })();

  return (
    <div className="hero-gallery-wall loaded">
      <div className="gallery-wall-inner">
        <div className="gallery-wall-grid">
          {rows.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              className={`gallery-wall-row ${rowIndex % 2 === 0 ? 'row-even' : 'row-odd'}`}
            >
              {/* Quadruple the row content for seamless infinite scroll with full coverage at all angles */}
              {[...row, ...row, ...row, ...row].map((src, colIndex) => (
                <div 
                  key={`${rowIndex}-${colIndex}`}
                  className="gallery-wall-card"
                >
                  <img src={src} alt="" loading="eager" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="gallery-wall-overlay" />
    </div>
  );
}
