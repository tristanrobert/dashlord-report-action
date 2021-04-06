const fs = require("fs");
const path = require("path");
const pick = require("lodash.pick");
const omit = require("lodash.omit");

const { getUrls, toHostname } = require("./utils");

const DASHLORD_REPO_PATH = process.env.DASHLORD_REPO_PATH || ".";

/**
 * Try to require some JSON
 *
 * @param {string} jsonPath The full path to file
 *
 * @returns {any} JSON content
 */
const requireJson = (jsonPath) => {
  try {
    return require(jsonPath);
  } catch (e) {
    console.error("e", e);
    return null;
  }
};

/**
 * Minify zap JSON data
 *
 * @param {ZapResult} result ZAP JSON content
 *
 * @returns {ZapResult} minified JSON content
 */
const zapCleanup = (result) =>
  result && {
    ...result,
    site:
      result &&
      result.site &&
      result.site.map((site) => {
        return {
          ...site,
          alerts: site.alerts.map((result) =>
            pick(result, ["name", "riskcode", "confidence", "riskdesc", "desc"])
          ),
        };
      }),
  };

/**
 * Minify nuclei JSON data
 *
 * @param {NucleiResult} result nuclei JSON content
 * @param {string} url extract only for this url
 *
 * @returns {NucleiResult} minified JSON content
 */
const nucleiCleanup = (result, url) =>
  result &&
  result
    .map((r) => omit(r, ["request", "response"]))
    .filter((entry) => entry.host === url);

/**
 * Minify Lighthouse JSON data
 *
 * @param {LighthouseResult} result Lighthouse JSON content
 *
 * @returns {LighthouseResult|null} minified JSON content
 */
const lhrCleanup = (result) => {
  if (!result) {
    return null;
  }
  const {
    requestedUrl,
    finalUrl,
    fetchTime,
    runWarnings,
    categories,
    audits,
  } = result;

  /** @type {LighthouseResultCategories} */
  // @ts-ignore
  const newCategories = Object.keys(categories).reduce(
    (
      a,
      /** @type {LighthouseResultCategoryKey} */
      key
    ) => ({
      ...a,

      [key]: omit(categories[key], "auditRefs"),
    }),
    {}
  );
  return {
    requestedUrl,
    finalUrl,
    fetchTime,
    runWarnings,
    categories: newCategories,
    audits: pick(audits, ["metrics", "diagnostics"]),
  };
};

const cleanups = {
  nuclei: nucleiCleanup,
  zap: zapCleanup,
  lhr: lhrCleanup,
};

const generateReport = () => {
  const urls = getUrls()
    .map((url) => {
      const urlb64 = Buffer.from(url.url).toString("base64");
      const urlPath = path.join(DASHLORD_REPO_PATH, "results", urlb64);
      if (fs.existsSync(urlPath)) {
        // use filesystem to determine latest scan report
        const scans = fs.readdirSync(urlPath);
        scans.sort().reverse();
        const lastScan = scans.length && scans[0];
        if (!lastScan) {
          return null;
        }
        const latestFilesPath = path.join(urlPath, lastScan);
        const latestFiles = fs.readdirSync(latestFilesPath);
        const urlData = {
          ...url,
          http: requireJson(path.join(latestFilesPath, "http.json")),
          updownio: requireJson(path.join(latestFilesPath, "updownio.json")),
          testssl: requireJson(path.join(latestFilesPath, "testssl.json")),
          thirdparties: requireJson(
            path.join(latestFilesPath, "thirdparties.json")
          ),
          wappalyzer: requireJson(
            path.join(latestFilesPath, "wappalyzer.json")
          ),
          zap: cleanups.zap(
            requireJson(path.join(latestFilesPath, "zap.json"))
          ),
          nuclei: cleanups.nuclei(
            requireJson(path.join(latestFilesPath, "nuclei.json")),
            url.url
          ),
          lhr: cleanups.lhr(
            requireJson(path.join(latestFilesPath, "lhr.json"))
          ),
        };

        // copy lhr, zap and testssl.sh static reports
        const publicReportsUrlPath = path.join(
          "www",
          "public",
          "report",
          urlb64
        );

        fs.mkdirSync(publicReportsUrlPath, { recursive: true });

        /**
         *
         * @param {string} name file name to export to public website
         *
         * @returns {void}
         */
        const copyForWebsite = (name) => {
          if (fs.existsSync(path.join(latestFilesPath, name))) {
            fs.createReadStream(path.join(latestFilesPath, name)).pipe(
              fs.createWriteStream(path.join(publicReportsUrlPath, name))
            );
          }
        };

        copyForWebsite("lhr.html");
        copyForWebsite("testssl.html");
        copyForWebsite("zap.html");

        return urlData;
      } else {
        console.error(`Cannot find folder for ${url.url}`);
        return null;
      }
    })
    .filter(Boolean);
  return urls;
};

if (require.main === module) {
  const report = generateReport();
  console.log(JSON.stringify(report, null, 2));
}
