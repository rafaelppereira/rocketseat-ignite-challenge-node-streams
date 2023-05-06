import http from "node:http";
import { routes } from "./routes/index.js";
import { json } from "./middlewares/json.js";

const app = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);
    req.params = { ...routeParams.groups };

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

app.listen(3000, () => console.log("✅ Api is running on port 3000"));
