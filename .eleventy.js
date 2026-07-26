export default function(eleventyConfig) {
  // Static assets copied through to the build output. _headers and _redirects
  // must land inside _site — Cloudflare only reads them from the assets dir.
  eleventyConfig.addPassthroughCopy({ "_headers": "_headers" });
  eleventyConfig.addPassthroughCopy({ "_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "media": "media" });
  // Eleventy does not copy CSS out of the input dir on its own.
  eleventyConfig.addPassthroughCopy("src/style.css");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes",
      output: "_site"
    }
  };
}
