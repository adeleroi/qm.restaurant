import { json } from "react-router-dom";

export async function Feedloader() {
    const data = await getFeedData();
    return json({
        data,
    })
}

async function getFeedData() {
    const data = await fetch('http://localhost:4242/api/v1/feed', {headers: {"Content-Type": "application/json"}})
    const feed = await data.json();
    return feed;
}
