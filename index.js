import axios from "axios";

const TOKEN = "APP_USR-12345678-031820-X-12345678";
const URL = "https://api.mercadolibre.com/sites/MLA/search?seller_id=179571326";

const headers = {
  Accept: "application/json",
  Authentication: `Bearer ${TOKEN}`,
};

const getData = async () => {
  // Primer curl (pasado a axios) a los items publicados con el seller_id = 179571326 ​ del site_id = "MLA"
  const response = await axios.get(URL, { headers });
  const seller = await response.data.results;

  // Segundo curl (pasado a axios) y  Mapeamos la respuesta de seller y por cada item hacemos la consulta a la url con el item.id para obtener
  // los atributos category, title
  const result = Promise.all(
    seller.map(async (item) => {
      const response = await axios.get(
        `https://api.mercadolibre.com/items?ids=${item.id}&attributes=category_id,title`,
        headers
      );
      const product = await response.data[0].body;
      var res = {};

      res["Id"] = item.id;
      res["Title"] = item.title;
      res["Category"] = product.category_id;
      res["Name"] = product.title;

      return res;
    })
  );

  return result;
};

const name = await getData();
console.log(name);