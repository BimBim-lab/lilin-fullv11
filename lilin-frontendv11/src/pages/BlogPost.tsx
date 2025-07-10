import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@shared/schema";
import { sampleBlogPosts } from "@/data/sampleBlogData";

interface BlogPostPageProps {
  defaultPost?: BlogPost;
  defaultPosts?: BlogPost[];
  authorInfo?: {
    name: string;
    role: string;
    description: string;
    imageUrl: string;
  };
}

export default function BlogPostPage({ 
  defaultPost,
  defaultPosts = sampleBlogPosts,
  authorInfo = {
    name: "Tim WeisCandle",
    role: "Expert Aromaterapi",
    description: "Tim ahli aromaterapi WeisCandle berbagi pengetahuan dan pengalaman untuk membantu Anda memahami dunia aromaterapi dengan lebih baik.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  }
}: BlogPostPageProps = {}) {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: allPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Use default data if API fails
  const displayPost = post || defaultPost || (slug ? defaultPosts.find(p => p.slug === slug) : undefined);
  const displayAllPosts = allPosts || defaultPosts;

  useEffect(() => {
    if (displayPost) {
      document.title = `${displayPost.title} - Blog WeisCandle`;
    }
  }, [displayPost]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const relatedPosts = displayAllPosts?.filter(p => p.id !== displayPost?.id).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !displayPost) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h1 className="text-2xl font-bold text-red-800 mb-2">Artikel Tidak Ditemukan</h1>
              <p className="text-red-600 mb-6">Artikel yang Anda cari tidak dapat ditemukan atau telah dipindahkan.</p>
              <Link href="/blog">
                <Button className="bg-rose-gold text-white hover:bg-charcoal">
                  Kembali ke Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/">
              <span className="hover:text-rose-gold transition-colors duration-300 cursor-pointer">Beranda</span>
            </Link>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <Link href="/blog">
              <span className="hover:text-rose-gold transition-colors duration-300 cursor-pointer">Blog</span>
            </Link>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-400">{displayPost.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Featured Image */}
              <img 
                src={displayPost.imageUrl} 
                alt={displayPost.title}
                className="w-full h-64 md:h-80 object-cover" 
              />

              <div className="p-8">
                {/* Meta Info */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{formatDate(displayPost.publishedAt)}</span>
                  </div>
                  {displayPost.featured && (
                    <Badge className="bg-rose-gold text-white">
                      Artikel Pilihan
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-6 leading-tight">
                  {displayPost.title}
                </h1>

                {/* Excerpt */}
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {displayPost.excerpt}
                </p>

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-charcoal prose-headings:font-display prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-rose-gold prose-a:no-underline hover:prose-a:text-charcoal prose-strong:text-charcoal prose-ul:text-gray-700 prose-ol:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: displayPost.content }}
                />

                {/* Share Buttons */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-charcoal mb-4">Bagikan Artikel Ini</h3>
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => {
                        const url = encodeURIComponent(window.location.href);
                        const text = encodeURIComponent(displayPost.title);
                        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300"
                    >
                      <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"/>
                      </svg>
                      WhatsApp
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link artikel berhasil disalin!');
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors duration-300"
                    >
                      <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Salin Link
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Author Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-charcoal mb-4">Tentang Penulis</h3>
                <div className="flex items-center space-x-4">
                  <img 
                    src={authorInfo.imageUrl} 
                    alt={authorInfo.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-charcoal">{authorInfo.name}</h4>
                    <p className="text-sm text-gray-600">{authorInfo.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mt-4 text-sm">
                  {authorInfo.description}
                </p>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-charcoal mb-4">Artikel Terkait</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                        <div className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-300 cursor-pointer">
                          <img 
                            src={relatedPost.imageUrl} 
                            alt={relatedPost.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0" 
                          />
                          <div>
                            <h4 className="font-medium text-charcoal text-sm leading-snug hover:text-rose-gold transition-colors duration-300">
                              {relatedPost.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(relatedPost.publishedAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA Widget */}
            <Card className="bg-gradient-to-br from-soft-pink to-rose-gold">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-charcoal mb-3">
                  Tertarik Belajar Lebih Lanjut?
                </h3>
                <p className="text-charcoal text-sm mb-4 opacity-90">
                  Bergabunglah dengan workshop lilin aromaterapi kami dan praktikkan 
                  langsung apa yang Anda baca!
                </p>
                <Link href="/workshop">
                  <Button className="bg-charcoal text-white hover:bg-opacity-90 w-full">
                    Lihat Workshop
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
