'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, FileText, Upload, Loader2, Copy, Download, LogOut, Sparkles, BookOpen, MessageSquare, ListChecks, FileDown } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [usage, setUsage] = useState({ used: 0, limit: 3, remaining: 3 });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchUsage();
  }, [router]);

  const fetchUsage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/usage', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.pdf') && !selectedFile.name.endsWith('.docx') && !selectedFile.name.endsWith('.doc')) {
      toast.error('Please upload a PDF or DOCX file');
      return;
    }

    setFile(selectedFile);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file');
      }

      setInputText(data.text);
      toast.success('File uploaded and text extracted successfully!');
    } catch (error) {
      toast.error(error.message);
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (type) => {
    if (!inputText.trim()) {
      toast.error('Please enter some notes or upload a file');
      return;
    }

    if (usage.remaining === 0 && user?.plan !== 'pro') {
      toast.error('Daily limit reached! Upgrade to Pro for unlimited generations.');
      return;
    }

    setLoading(true);
    setGeneratedContent(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: inputText, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setGeneratedContent(data);
      await fetchUsage();
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.result);
      toast.success('Copied to clipboard!');
    }
  };

  const downloadAsPDF = () => {
    toast.info('PDF download feature coming soon in Pro plan!');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ExamReady AI</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Welcome, </span>
              <span className="font-semibold">{user.name}</span>
              {user.plan === 'pro' && (
                <span className="ml-2 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  Pro
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Usage Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Daily Usage</CardTitle>
            <CardDescription>
              {user.plan === 'pro' ? (
                'Unlimited generations available'
              ) : (
                `${usage.remaining} of ${usage.limit} generations remaining today`
              )}
            </CardDescription>
          </CardHeader>
          {user.plan !== 'pro' && (
            <CardContent>
              <Progress value={(usage.used / usage.limit) * 100} className="h-2" />
              {usage.remaining === 0 && (
                <div className="mt-4">
                  <Button className="w-full">Upgrade to Pro for Unlimited Access</Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Study Notes</CardTitle>
                <CardDescription>
                  Paste your notes or upload a PDF/DOCX file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your study notes here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
                
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="w-full" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload PDF/DOCX
                        </span>
                      </Button>
                    </label>
                  </div>
                  {file && (
                    <span className="text-sm text-muted-foreground">{file.name}</span>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  {inputText.length} characters
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Study Material</CardTitle>
                <CardDescription>
                  Choose what you want to create
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={() => handleGenerate('summary')}
                    disabled={loading}
                    className="justify-start h-auto py-4"
                  >
                    <FileText className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Smart Summary</div>
                      <div className="text-xs opacity-90">Key points and concepts</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleGenerate('questions')}
                    disabled={loading}
                    className="justify-start h-auto py-4"
                    variant="outline"
                  >
                    <MessageSquare className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Exam Questions</div>
                      <div className="text-xs opacity-90">Short & long answer questions</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleGenerate('mcqs')}
                    disabled={loading}
                    className="justify-start h-auto py-4"
                    variant="outline"
                  >
                    <ListChecks className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">MCQs with Answers</div>
                      <div className="text-xs opacity-90">Multiple choice questions</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleGenerate('flashcards')}
                    disabled={loading}
                    className="justify-start h-auto py-4"
                    variant="outline"
                  >
                    <Sparkles className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Flashcards</div>
                      <div className="text-xs opacity-90">Q&A format for quick revision</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleGenerate('revision')}
                    disabled={loading}
                    className="justify-start h-auto py-4"
                    variant="outline"
                  >
                    <FileDown className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Revision Sheet</div>
                      <div className="text-xs opacity-90">One-page study guide</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated Content</CardTitle>
                    <CardDescription>
                      {generatedContent ? `Type: ${generatedContent.type}` : 'Your results will appear here'}
                    </CardDescription>
                  </div>
                  {generatedContent && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      {user.plan === 'pro' && (
                        <Button variant="outline" size="sm" onClick={downloadAsPDF}>
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-sm text-muted-foreground">Generating your content...</p>
                  </div>
                ) : generatedContent ? (
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
                      {generatedContent.result}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Enter your notes and click a generation button to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
