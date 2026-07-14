import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { recommendBalls } from "./server/recommendBalls.js";
import { listBallRequests, addBallRequest } from "./server/ballRequests.js";

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) reject(new Error("Request body is too large."));
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON request body."));
      }
    });
    request.on("error", reject);
  });
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      {
        name: "recommendation-api",
        configureServer(server) {
          server.middlewares.use("/api/recommend-balls", async (request, response, next) => {
            if (request.method !== "POST") return next();

            try {
              const payload = await readJson(request);
              const result = await recommendBalls(payload, env.ANTHROPIC_API_KEY);
              response.statusCode = 200;
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify(result));
            } catch (error) {
              console.error("Ball recommendation request failed:", error);
              response.statusCode = 500;
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify({ error: "Unable to generate recommendations right now." }));
            }
          });

          server.middlewares.use("/api/ball-requests", async (request, response, next) => {
            if (request.method === "GET") {
              try {
                const requests = await listBallRequests();
                response.statusCode = 200;
                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify(requests));
              } catch (error) {
                console.error("Failed to list ball requests:", error);
                response.statusCode = 500;
                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify({ error: "Unable to load requests right now." }));
              }
              return;
            }

            if (request.method !== "POST") return next();

            try {
              const payload = await readJson(request);
              const created = await addBallRequest(payload);
              response.statusCode = 200;
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify(created));
            } catch (error) {
              console.error("Failed to save ball request:", error);
              response.statusCode = 500;
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify({ error: "Unable to save request right now." }));
            }
          });
        },
      },
    ],
  };
});
