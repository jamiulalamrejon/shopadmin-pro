// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Keep the admin panel out of search engines.
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
