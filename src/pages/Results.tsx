import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getImageUrl, downloadCsv } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Download, RefreshCw, Target, Users, TrendingUp, Percent } from 'lucide-react';

interface ResultsData {
  metrics: {
    detection_score: number;
    nail_count: number;
    match_count: number;
    match_precision: number;
    match_recall: number;
  };
  output_image: string;
  analysis_image: string;
  results_csv: string;
  fileName: string;
  useKmeans: boolean;
  nail_details?: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    confidence: number;
    height_mm: number;
    weight_g: number;
  }>;
}

const Results = () => {
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedData = sessionStorage.getItem('nailedItResults');
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("Stored results data:", parsedData);
      
      // Check if metrics exist and have the expected properties
      if (parsedData.metrics) {
        console.log("Metrics in results:", parsedData.metrics);
        console.log("Nail count:", parsedData.metrics.nail_count);
        console.log("Match count:", parsedData.metrics.match_count);
      }
      
      setResultsData(parsedData);
    } else {
      toast({
        title: "No results found",
        description: "Please upload an image first",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [navigate, toast]);

  const handleDownloadCsv = async () => {
    if (!resultsData) return;

    setIsDownloading(true);
    try {
      await downloadCsv(resultsData.results_csv);
      toast({
        title: "Download started",
        description: "CSV file is being downloaded"
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to download the CSV file",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNewAnalysis = () => {
    sessionStorage.removeItem('nailedItResults');
    navigate('/');
  };

  if (!resultsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin text-primary" size={48} />
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  const { metrics } = resultsData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Back to Upload</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analysis Results</h1>
              <p className="text-muted-foreground">
                Results for: {resultsData.fileName}
                {resultsData.useKmeans && (
                  <Badge variant="secondary" className="ml-2">K-means enabled</Badge>
                )}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleDownloadCsv}
              disabled={isDownloading}
              variant="outline"
              size="sm"
            >
              <Download size={16} className="mr-2" />
              {isDownloading ? 'Downloading...' : 'Download CSV'}
            </Button>
            <Button
              onClick={handleNewAnalysis}
              className="nailedit-gradient"
              size="sm"
            >
              <RefreshCw size={16} className="mr-2" />
              New Analysis
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="nailedit-hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nails Detected</p>
                  <p className="text-3xl font-bold text-foreground">{metrics.nail_count}</p>
                </div>
                <Target className="text-primary" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="nailedit-hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Matches Found</p>
                  <p className="text-3xl font-bold text-foreground">{metrics.match_count}</p>
                </div>
                <Users className="text-primary" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="nailedit-hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Detection Score</p>
                  <p className="text-3xl font-bold text-foreground">
                    {Math.round(metrics.detection_score * 100)}%
                  </p>
                  <Progress value={metrics.detection_score * 100} className="mt-2" />
                </div>
                <Percent className="text-primary" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="nailedit-hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Match Precision</p>
                  <p className="text-3xl font-bold text-foreground">
                    {Math.round(metrics.match_precision * 100)}%
                  </p>
                  <Progress value={metrics.match_precision * 100} className="mt-2" />
                </div>
                <TrendingUp className="text-primary" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Detected Nails</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={getImageUrl(resultsData.output_image)}
                alt="Detected nails"
                className="w-full h-auto rounded-lg border"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={getImageUrl(resultsData.analysis_image)}
                alt="Analysis visualization"
                className="w-full h-auto rounded-lg border"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Detection Score</span>
                    <span className="text-sm text-muted-foreground">
                      {(metrics.detection_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={metrics.detection_score * 100} />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Match Precision</span>
                    <span className="text-sm text-muted-foreground">
                      {(metrics.match_precision * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={metrics.match_precision * 100} />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Match Recall</span>
                    <span className="text-sm text-muted-foreground">
                      {(metrics.match_recall * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={metrics.match_recall * 100} />
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    Successfully detected <strong>{metrics.nail_count}</strong> nails 
                    and found <strong>{metrics.match_count}</strong> matching pairs with 
                    high precision and recall scores.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nail Details - New Section */}
        {resultsData.nail_details && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Individual Nail Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <NailDetails details={resultsData.nail_details} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Add this component after the Results interface
const NailDetails: React.FC<{ details: ResultsData['nail_details'] }> = ({ details }) => {
  if (!details || details.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No detailed measurements available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">#</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Height (mm)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Weight (g)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Confidence</th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {details.map((nail, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
              <td className="px-4 py-2 whitespace-nowrap text-sm">{index + 1}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">{nail.height_mm.toFixed(2)}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">{nail.weight_g.toFixed(2)}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">{(nail.confidence * 100).toFixed(0)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Results;
