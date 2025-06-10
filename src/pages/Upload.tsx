import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/FileUpload';
import SampleGallery from '@/components/SampleGallery';
import { detectNails, DetectionResponse } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, Target, BarChart3, Upload as UploadIcon, Image as ImageIcon } from 'lucide-react';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [useKmeans, setUseKmeans] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'sample'>('upload');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSampleSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image file to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 20, 90));
      }, 500);

      const result: DetectionResponse = await detectNails(selectedFile, useKmeans);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Store results in sessionStorage for the results page
      sessionStorage.setItem('nailedItResults', JSON.stringify({
        ...result,
        fileName: selectedFile.name,
        useKmeans
      }));

      toast({
        title: "Analysis complete!",
        description: `Detected ${result.metrics.nail_count} nails with ${result.metrics.match_count} matches`,
      });

      // Navigate to results page
      setTimeout(() => navigate('/results'), 500);

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 nailedit-gradient rounded-full mb-6">
            <Target className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to NailedIT
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced nail detection and analysis using computer vision. 
            Upload an image to detect nails, measure dimensions, and find matching pairs.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="nailedit-hover-lift">
            <CardContent className="p-6 text-center">
              <Target className="mx-auto mb-4 text-primary" size={40} />
              <h3 className="font-semibold mb-2">Precise Detection</h3>
              <p className="text-sm text-muted-foreground">
                Advanced computer vision algorithms for accurate nail identification
              </p>
            </CardContent>
          </Card>
          
          <Card className="nailedit-hover-lift">
            <CardContent className="p-6 text-center">
              <BarChart3 className="mx-auto mb-4 text-primary" size={40} />
              <h3 className="font-semibold mb-2">Detailed Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive measurements including dimensions and weight estimates
              </p>
            </CardContent>
          </Card>
          
          <Card className="nailedit-hover-lift">
            <CardContent className="p-6 text-center">
              <Zap className="mx-auto mb-4 text-primary" size={40} />
              <h3 className="font-semibold mb-2">Smart Matching</h3>
              <p className="text-sm text-muted-foreground">
                Intelligent algorithms to find and group similar nails together
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Select an Image for Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs 
              value={uploadMethod} 
              onValueChange={(value) => {
                setUploadMethod(value as 'upload' | 'sample');
                setSelectedFile(null);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upload" className="flex items-center space-x-2" disabled={isUploading}>
                  <UploadIcon size={16} />
                  <span>Upload Your Image</span>
                </TabsTrigger>
                <TabsTrigger value="sample" className="flex items-center space-x-2" disabled={isUploading}>
                  <ImageIcon size={16} />
                  <span>Sample Gallery</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  onRemoveFile={handleRemoveFile}
                  isUploading={isUploading}
                />
              </TabsContent>
              
              <TabsContent value="sample">
                <SampleGallery 
                  onSelectSample={handleSampleSelect}
                  isUploading={isUploading}
                />
              </TabsContent>
            </Tabs>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="kmeans"
                checked={useKmeans}
                onCheckedChange={(checked) => setUseKmeans(checked as boolean)}
                disabled={isUploading}
              />
              <label
                htmlFor="kmeans"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Use K-means clustering for improved matching
              </label>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing image...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full nailedit-gradient"
              size="lg"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Start Analysis'
              )}
            </Button>
          </CardContent>
        </Card>
        
        {/* Selected file preview */}
        {selectedFile && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Selected image: <span className="font-medium">{selectedFile.name}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
