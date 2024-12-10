const { DateTime } = require("luxon");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
    eleventyConfig.addGlobalData("metadata", require("./src/_data/metadata.js"));

    eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

    eleventyConfig.addCollection("blog", function(collectionApi) {
        return collectionApi.getFilteredByTag("blog").sort((a, b) => b.date - a.date);
      });

    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addFilter("postDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toFormat('dd.LL.yyyy');
    });
    eleventyConfig.addPlugin(require("@11ty/eleventy-navigation"));
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/robots.txt");

    return {
        dir: {
            input: "src",
            output: "public",
            includes: "_includes"
        },
        passthroughFileCopy: true,
        markdownTemplateEngine: "njk",
        templateFormats: ["html", "njk", "md"]
    };
};
