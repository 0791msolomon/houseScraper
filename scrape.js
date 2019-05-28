const request = require("request");
const cheerio = require("cheerio");
const axios = require("axios");
request(
  "https://www.nvdreamhomes.com/search?page=1&pageSize=30&listingSort=PRICE_DESC&layoutType=grid&key=Henderson%2C+NV&keywordType=city&gclid=Cj0KCQjwuLPnBRDjARIsACDzGL1irO9RaPE_ijLlovufoIa65BfZKUfvszgJ2o5A_YMgeZREq-U07xgaAlIqEALw_wcB",
  (error, response, html) => {
    if (!error && response.statusCode === 200) {
      let arr = [];
      const $ = cheerio.load(html);
      $(".house-list")
        .find("li > a > div > img")
        .each((i, elem) => {
          arr.push({ image: elem.attribs["data-src"] });
        });
      $(".house-list")
        .find("li > a > .mask > .house-detail > .house-address")
        .each((i, elem) => {
          arr[i].address = $(elem).text();
        });
      let promiseArr = arr.map(item => {
        axios
          .post("http://localhost:5000/api/realty", {
            image: item.image,
            address: item.address
          })
          .then(res => console.log(res));
      });
      Promise.all(promiseArr)
        .then(() => console.log("done"))
        .catch(err => console.log("error"));
    }
  }
);
