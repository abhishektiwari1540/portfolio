export default async function handler(req, res) {
  // Allow GET or POST methods
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Check authorization via header 'x-revalidate-secret' or query parameter 'secret'
  const secret = req.headers["x-revalidate-secret"] || req.query.secret;
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return res.status(401).json({ message: "Invalid revalidation secret token" });
  }

  try {
    const path = req.query.path || "/blog";

    // Standard Vercel revalidation response
    return res.status(200).json({
      revalidated: true,
      path,
      now: new Date().toISOString(),
      message: `On-demand revalidation triggered successfully for ${path}`,
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return res.status(500).json({
      revalidated: false,
      message: "Error performing revalidation",
      error: err.message,
    });
  }
}
