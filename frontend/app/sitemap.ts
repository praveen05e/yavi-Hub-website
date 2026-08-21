import { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.yavi.studio"; // update to the real production domain
  const staticRoutes = ["", "/about", "/services", "/projects", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
  const projectRoutes = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...projectRoutes];
}
