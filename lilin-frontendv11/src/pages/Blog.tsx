import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@shared/schema";
import { sampleBlogPosts } from "@/data/sampleBlogData";

interface BlogPageProps {
  title?: string;
  subtitle?: string;
  defaultPosts?: BlogPost[];
}

export default function Blog({ 
  title = "Blog & Tips Aromaterapi",
  subtitle = "Artikel terbaru seputar aromaterapi, teknik candle making, tips bisnis, dan inspirasi untuk perjalanan aromaterapi Anda.",
  defaultPosts = sampleBlogPosts
}: BlogPageProps = {}) {
  useEffect(() => {
    document.title = "Blog Aromaterapi - Tips & Artikel WeisCandle";
  }, []);

  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    // Provide default posts if API fails
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use default posts if API fails or returns empty
  const displayPosts = posts || defaultPosts;

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-6">
            {title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Gagal Memuat Artikel</h3>
              <p className="text-red-600">Terjadi kesalahan saat memuat artikel blog. Silakan coba lagi nanti.</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {displayPosts && displayPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Artikel</h3>
              <p className="text-gray-600">Artikel blog akan segera hadir. Nantikan tips dan informasi menarik seputar aromaterapi!</p>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {displayPosts && displayPosts.length > 0 && (
          <>
            {/* Featured Posts */}
            <div className="mb-12">
              <h2 className="text-2xl font-display font-bold text-charcoal mb-6">Artikel Pilihan</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {displayPosts
                  .filter(post => post.featured)
                  .slice(0, 2)
                  .map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-scale cursor-pointer">
                        <div className="relative">
                          <img 
                            src={post.imageUrl} 
                            alt={post.title}
                            className="w-full h-64 object-cover" 
                          />
                          <Badge className="absolute top-4 left-4 bg-rose-gold text-white">
                            Pilihan Editor
                          </Badge>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-charcoal mb-3 hover:text-rose-gold transition-colors duration-300">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4">{post.excerpt}</p>
                          <span className="text-rose-gold font-medium hover:text-charcoal transition-colors duration-300">
                            Baca Selengkapnya 
                            <svg className="w-4 h-4 inline ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>

            {/* All Posts */}
            <div>
              <h2 className="text-2xl font-display font-bold text-charcoal mb-6">Semua Artikel</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-scale cursor-pointer">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-48 object-cover" 
                      />
                      <CardContent className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-charcoal mb-3 hover:text-rose-gold transition-colors duration-300">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        <span className="text-rose-gold font-medium hover:text-charcoal transition-colors duration-300">
                          Baca Selengkapnya 
                          <svg className="w-4 h-4 inline ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
