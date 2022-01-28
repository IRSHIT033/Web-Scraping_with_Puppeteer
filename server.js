const puppeteer = require("puppeteer");
const CronJob = require("cron").CronJob;

const name = "solana";
const url = `https://coinmarketcap.com/currencies/${name}/`;
const config_browser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  return page;
};
async function price(page) {
  await page.reload();
  const dollarprice = await page.$eval(".priceValue", (el) => el.textContent);
  const price = await page.$eval(
    ".priceTitle",
    (el) => el.childNodes[0].textContent
  );
  const inc = await page.$eval(
    ".priceTitle",
    (el) => el.childNodes[1].textContent
  );
  const nc = await page.$eval(
    ".priceTitle",
    (el) => el.childNodes[1].childNodes[0].className
  );
  console.log("current price is " + price + " and rate is " + inc + " , " + nc);
}

async function startTracking() {
  const page = await config_browser();
  let job = new CronJob(
    "*/10 * * * * *",
    function () {
      price(page);
    },
    null,
    true,
    null,
    null,
    true
  );
  job.start();
}

startTracking();
