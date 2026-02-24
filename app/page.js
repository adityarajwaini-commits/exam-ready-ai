'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Sparkles, FileText, Brain, Zap, CheckCircle, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ExamReady AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Start Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Study Assistant
          </div>
          
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
            Turn Your Notes Into{' '}
            <span className="text-primary">Exam-Ready Material</span>{' '}
            in Seconds
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            Summaries, Questions, Flashcards & Revision Sheets — Powered by AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg h-12 px-8">
                Start Free <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg h-12 px-8">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              3 free generations daily
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24 bg-muted/50">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything You Need to Ace Your Exams
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your study notes into comprehensive exam materials with AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Smart Summaries</CardTitle>
              <CardDescription>
                Get clean, structured summaries with key points highlighted
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Exam Questions</CardTitle>
              <CardDescription>
                Generate short and long-answer questions based on your notes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader>
              <Sparkles className="h-10 w-10 text-primary mb-2" />
              <CardTitle>MCQs with Answers</CardTitle>
              <CardDescription>
                Practice with AI-generated multiple-choice questions and explanations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader>
              <Brain className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Flashcards</CardTitle>
              <CardDescription>
                Create Q&A flashcards for quick revision and memorization
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Revision Sheets</CardTitle>
              <CardDescription>
                One-page revision sheets with key concepts and formulas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>PDF & DOCX Support</CardTitle>
              <CardDescription>
                Upload your study materials directly as PDF or Word documents
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Free Plan</CardTitle>
              <CardDescription className="text-lg">Perfect for trying out</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">₹0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>3 generations per day</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>All generation types</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>PDF & DOCX upload</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Copy to clipboard</span>
                </li>
              </ul>
              <Link href="/signup">
                <Button className="w-full" variant="outline">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary shadow-lg">
            <CardHeader>
              <div className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground w-fit mb-2">
                Most Popular
              </div>
              <CardTitle className="text-2xl">Pro Plan</CardTitle>
              <CardDescription className="text-lg">For serious students</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">₹99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Unlimited generations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>All generation types</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>PDF & DOCX upload</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Download as PDF</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full">Upgrade to Pro</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-24 bg-muted/50">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Loved by Students
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <CardTitle>Saved me hours!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                "ExamReady AI helped me prepare for my finals in half the time. The summaries are spot-on!"
              </p>
              <p className="mt-4 font-semibold">- Priya S., Engineering Student</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <CardTitle>Game changer!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                "The MCQ generation is incredible. It's like having a personal tutor who knows exactly what to ask."
              </p>
              <p className="mt-4 font-semibold">- Rahul M., Medical Student</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <CardTitle>Best study tool ever</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                "I use the flashcards feature daily. It's made memorization so much easier and faster."
              </p>
              <p className="mt-4 font-semibold">- Sneha K., Law Student</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">How does ExamReady AI work?</AccordionTrigger>
            <AccordionContent>
              Simply paste your study notes or upload a PDF/DOCX file. Our AI analyzes your content and generates summaries, questions, MCQs, flashcards, and revision sheets tailored to your material.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">Is my data secure?</AccordionTrigger>
            <AccordionContent>
              Yes! We take data security seriously. Your notes are processed securely and are not stored permanently. We only keep generation metadata for usage tracking.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">What's the difference between Free and Pro?</AccordionTrigger>
            <AccordionContent>
              Free users get 3 generations per day with all features. Pro users get unlimited generations and can download results as PDF files.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">Can I cancel my Pro subscription anytime?</AccordionTrigger>
            <AccordionContent>
              Yes! You can cancel your Pro subscription at any time. You'll continue to have Pro access until the end of your billing period.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">What file formats are supported?</AccordionTrigger>
            <AccordionContent>
              We support PDF and DOCX (Microsoft Word) files. You can also paste text directly into the dashboard.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">ExamReady AI</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your AI-powered study companion for exam success.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/signup" className="hover:text-foreground">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 ExamReady AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}