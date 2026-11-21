// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Lets staff "Add to Home Screen" and open the dashboard like an app on their phone.
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShopAdmin Pro",
    short_name: "ShopAdmin",
    description: "E-commerce business dashboard",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f4f6fb",
    theme_color: "#1660f5",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
