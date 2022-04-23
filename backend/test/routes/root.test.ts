import { test } from "tap";
import { build } from "../helper";

test("default root route", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/",
  });
  t.same(JSON.parse(res.payload), { root: true });
});

test("description", async (t) => {
  const app = await build(t);

  await app.inject({
    url: "/portfolio",
    method: "POST",
    payload: {
      account: "account",
      portfolioName: "portfolioName",
      description: "description",
    },
  });

  const res = await app.inject({
    url: "/portfolio/account/portfolioName",
  });
  t.same(
    res.payload,
    JSON.stringify({ account: "account", description: "description" })
  );
});
