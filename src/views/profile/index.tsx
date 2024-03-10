import { NavLink, Outlet } from "react-router-dom";

export function Profile() {
    return (
        <div className="w-full flex min-h-screen gap-8">
            <div className="pl-16">
                <div>
                    <ul className="flex flex-col w-56">
                        <Tile to="/" title="Account informations" end/>
                        <Tile to="/orders-history" title="Orders history"/>
                        <Tile to="/promotions" title="Promotions"/>
                    </ul>
                </div>
            </div>
            <div className="pt-4 w-full">
                <Outlet/>
            </div>
        </div>
    )
}

function Tile({ title, to="", end=false } : { title: string, to?: string, end?: boolean }) {
    return (
        <NavLink to={`/account${to}`}  className={({isActive}) => isActive ? 'border-l-8 border-defaultGreen bg-gray-100 pl-3' : 'pl-5'} end={end}>
            <li className="py-3 font-medium">{title}</li>
        </NavLink>
    )
}