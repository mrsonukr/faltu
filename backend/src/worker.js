export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // GET /color → random color
    if (url.pathname === "/color" && request.method === "GET") {
      try {
        const color = await env.DB
          .prepare("SELECT id, name FROM colors ORDER BY RANDOM() LIMIT 1")
          .first();

        if (!color) {
          return json(
            { success: false, message: "No colors found" },
            404
          );
        }

        return json({
          success: true,
          id: color.id,
          color: color.name
        });
      } catch (err) {
        return json({ success: false, error: err.message }, 500);
      }
    }

    // GET /allcolors → all colors
    if (url.pathname === "/allcolors" && request.method === "GET") {
      try {
        const result = await env.DB
          .prepare("SELECT id, name FROM colors ORDER BY id ASC")
          .all();

        return json({
          success: true,
          count: result.results.length,
          colors: result.results
        });
      } catch (err) {
        return json({ success: false, error: err.message }, 500);
      }
    }

    // fallback
    return new Response("Not Found", { status: 404 });
  }
};

// helper
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
