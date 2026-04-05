/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://mmswaterdiviners.in",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "monthly",
  priority: 0.7,

  exclude: ["/admin", "/admin/*", "/api/*"],

  transform: async (config, path) => {
    if (path === "/")
      return {
        loc: path,
        changefreq: "weekly",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    if (["/services", "/about", "/contact"].includes(path))
      return {
        loc: path,
        changefreq: "monthly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },

  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] }],
  },
};
