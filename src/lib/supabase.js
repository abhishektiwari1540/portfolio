import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env?.VITE_SUPABASE_URL ||
  (typeof process !== "undefined" ? process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL : "") ||
  "https://placeholder-project.supabase.co";

const supabaseAnonKey =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  (typeof process !== "undefined" ? process.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY : "") ||
  "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch published posts from Supabase table 'posts' where status = 'published'.
 */
export async function getPublishedPosts() {
  if (!supabaseUrl || supabaseUrl.includes("placeholder-project")) {
    console.warn("Supabase credentials not set or using placeholder.");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("Error fetching published posts from Supabase:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Failed to query Supabase posts:", err);
    return [];
  }
}

/**
 * Fetch a single published post by slug.
 */
export async function getPostBySlug(slug) {
  if (!supabaseUrl || supabaseUrl.includes("placeholder-project")) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching post with slug "${slug}":`, error);
      return null;
    }
    return data;
  } catch (err) {
    console.error(`Failed to query post with slug "${slug}":`, err);
    return null;
  }
}
