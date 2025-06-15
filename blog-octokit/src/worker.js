/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Octokit } from "@octokit/core";

export default {
    async fetch(request, env, ctx) {
        const OK = new Octokit({ auth: env.GITHUB_TOKEN })

        const owner = "bambans"
        const repo = "blog"
        const path = "posts"

        const res = await OK.request("GET /repos/{owner}/{repo}/contents/{path}", {
            owner,
            repo,
            path
        })

        const files = res.data
            .filter(item => item.name.endsWith(".md"))
            .map(item => item.name)

        return new Response(JSON.stringify(files, null, 4), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // Optional: allow frontend fetch
            }
        })
    }
}