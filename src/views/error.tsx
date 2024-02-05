import { useRouteError } from "react-router-dom"

type ErrorRoute = {statusText: string, message: string};

export function ErrorPage() {
    const error = useRouteError() as ErrorRoute;
    return (
        <>
            <div>Oups! Nothing to deliver here</div>
            <p>Go back to home page</p>
            <p>
                <i>{error.statusText || error.message }</i>
            </p>
        </>
    )
}
