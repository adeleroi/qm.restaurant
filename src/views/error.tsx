import { useRouteError } from "react-router-dom"

type ErrorRoute = {statusText: string, message: string};

export function ErrorPage() {
    const error = useRouteError() as ErrorRoute;
    return (
        <>
            <div>Oups! Something went wrong...</div>
            <p>
                <i>{error.statusText || error.message }</i>
            </p>
        </>
    )
}
