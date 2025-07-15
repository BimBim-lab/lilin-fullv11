import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { sampleBlogPosts } from "@/data/sampleBlogData";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    
    try {
      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      // Fallback to sample data for blog endpoints
      console.warn(`API call failed for ${url}, using fallback data:`, error);
      
      if (url === "/api/blog") {
        return sampleBlogPosts as any;
      }
      
      if (url.startsWith("/api/blog/")) {
        const slug = url.replace("/api/blog/", "");
        const post = sampleBlogPosts.find(p => p.slug === slug);
        if (post) {
          return post as any;
        }
      }
      
      // Re-throw error for non-blog endpoints
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true, // Enable refetch on window focus
      refetchOnMount: true, // Always refetch on component mount
      staleTime: 30 * 1000, // 30 seconds - shorter for faster updates
      retry: 1, // Allow one retry before fallback
    },
    mutations: {
      retry: false,
    },
  },
});
