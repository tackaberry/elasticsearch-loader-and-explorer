const { default: axios } = require("axios");
const elasticsearch = require("elasticsearch");

const {
  ELASTICSEARCH_SERVER: elasticsearchServer,
  SOURCE_URL: sourceUrl,
  ELASTICSEARCH_INDEX: elasticsearchIndex,
} = process.env;

exports.handler = async (event, context) => {
  const url = (page) =>
    `${sourceUrl}/query?offset=${page * 1000}&offset_edge=left`;

  for (let page = 300; page < 400; page++) {
    const pageUrl = url(page);
    console.log(`Get ${pageUrl}`);
    const results = await axios.get(pageUrl);
    const data = results.data.data;
    await putBatch(data);
  }

  return "ok";
};

var client = new elasticsearch.Client({
  host: elasticsearchServer,
});

const putBatch = (data) => {
  console.log("[elasticsearch.putBatch] batch");

  return new Promise(function (resolve, reject) {
    if (data.length === 0) {
      return resolve("Nothing to do");
    }
    const body = [];
    data.forEach((record) => {
      body.push({
        index: { _index: elasticsearchIndex },
      });
      body.push(record);
    });
    client.bulk({ body: body }, function (error, res) {
      if (error) {
        reject(error);
      } else {
        //console.log(res);
        res.itemsNumber = res.items.length;

        if (res.errors) {
          console.log("[elasticsearch.putBatch] errors: %j", res.errors);
          var errors = res.items.map((item) => {
            if (!item.index.result) {
              console.log(item.index.error);
            }
          });
        }
        delete res.items;
        resolve(res);
      }
    });
  });
};
