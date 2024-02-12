import { json, useLoaderData, useRouteLoaderData } from "react-router-dom";

// export async function loader() {
//     return json({});
// }

export function Restaurant() {
    const loader = useRouteLoaderData('root');
    console.log('|||||||>', loader);
    return <div>Restaurant</div>
}
