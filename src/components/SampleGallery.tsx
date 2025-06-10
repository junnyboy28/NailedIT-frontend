import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SampleGalleryProps {
  onSelectSample: (file: File) => void;
  isUploading: boolean;
}

const SampleGallery: React.FC<SampleGalleryProps> = ({ onSelectSample, isUploading }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Featured samples to show first
  const featuredSamples = ['test.jpg', 'testing.png'];
  
  // Generate the other sample image filenames (192.jpg to 255.jpg)
  const generateSampleRange = () => {
    const samples = [];
    for (let i = 192; i <= 255; i++) {
      samples.push(`${i}.jpg`);
    }
    return samples;
  };

  const handleSelectSample = async (filename: string) => {
    setSelectedImage(filename);
    const imagePath = `/option-imgs/${filename}`;
    
    try {
      // Fetch the image and convert it to a File object
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type });
      
      onSelectSample(file);
    } catch (error) {
      console.error('Error loading sample image:', error);
    }
  };

  const sampleRange = generateSampleRange();

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="featured">Featured Samples</TabsTrigger>
            <TabsTrigger value="all">All Samples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured">
            <div className="grid grid-cols-2 gap-4">
              {featuredSamples.map((filename) => (
                <div 
                  key={filename}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === filename ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => !isUploading && handleSelectSample(filename)}
                >
                  <img 
                    src={`/option-imgs/${filename}`} 
                    alt={`Sample ${filename}`} 
                    className="w-full h-48 object-contain" // Increased from h-32 to h-48 and changed object-cover to object-contain
                  />
                  <div className="p-2 text-center text-sm">{filename}</div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto"> 
              {sampleRange.map((filename) => (
                <div 
                  key={filename}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === filename ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => !isUploading && handleSelectSample(filename)}
                >
                  <img 
                    src={`/option-imgs/${filename}`} 
                    alt={`Sample ${filename}`} 
                    className="w-full h-36 object-contain" // Increased from h-20 to h-36 and changed object-cover to object-contain
                  />
                  <div className="p-1 text-center text-xs">{filename}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SampleGallery;