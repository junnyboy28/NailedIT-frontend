
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Github, Target, Brain, Zap, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 nailedit-gradient rounded-full mb-6">
            <Target className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">About NailedIT</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced computer vision technology for precise nail detection, 
            measurement, and matching in construction and manufacturing applications.
          </p>
        </div>

        {/* Technology Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="text-primary" size={24} />
              <span>Technology Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              NailedIT leverages state-of-the-art computer vision algorithms to automatically 
              detect and analyze nails in images. Our system combines deep learning models 
              with traditional computer vision techniques to provide accurate measurements 
              and intelligent matching capabilities.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Core Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <Target className="text-primary" size={16} />
                    <span className="text-sm">Automatic nail detection and localization</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Zap className="text-primary" size={16} />
                    <span className="text-sm">Precise dimension measurements</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Brain className="text-primary" size={16} />
                    <span className="text-sm">Intelligent similarity matching</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Shield className="text-primary" size={16} />
                    <span className="text-sm">Weight estimation algorithms</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Technical Stack</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Computer Vision</Badge>
                  <Badge variant="secondary">Deep Learning</Badge>
                  <Badge variant="secondary">Image Processing</Badge>
                  <Badge variant="secondary">K-means Clustering</Badge>
                  <Badge variant="secondary">Feature Extraction</Badge>
                  <Badge variant="secondary">Pattern Recognition</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 nailedit-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Image Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload an image containing nails for analysis
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 nailedit-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced algorithms detect and measure each nail
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 nailedit-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Results & Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Get detailed measurements and matching nail pairs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Construction Industry</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Quality control and inventory management</li>
                  <li>• Automated sorting and categorization</li>
                  <li>• Compliance verification and documentation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Manufacturing</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Production line quality assurance</li>
                  <li>• Defect detection and analysis</li>
                  <li>• Batch processing and tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Have questions or need support? Get in touch with our development team.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="flex items-center space-x-2"
              >
                <a href="mailto:jimilmandani28@gmail.com">
                  <Mail size={20} />
                  <span>jimilmandani28@gmail.com</span>
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                asChild
                className="flex items-center space-x-2"
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Github size={20} />
                  <span>View on GitHub</span>
                </a>
              </Button>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Development Notes</h4>
              <p className="text-sm text-muted-foreground">
                NailedIT is built with React and integrates with a FastAPI backend 
                for real-time image processing and analysis. The system is designed 
                for scalability and can be deployed in various environments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
