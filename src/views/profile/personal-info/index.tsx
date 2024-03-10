import { ChevronForward } from "../../../components/icons/icon"

export function PersonalInfo() {
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold">
                Personal infos
            </h1>
            <div className="w-full mt-8">
                <ul className="w-1/2">
                    <InfoListItem title="Name" value="Adé Ange-Wilfried N'guessan"/>
                    <InfoListItem title="Email" value="wilfriednguess@gmail.com"/>
                    <InfoListItem title="Phone number" value="581-777-7338"/>
                </ul>
            </div>
        </div>
    )
}

function InfoListItem({ title, value } : { title: string, value: string}) {
    return (
        <li className="flex justify-between items-center py-6 border-b-[1px] border-gray-150 w-full">
            <p className="font-bold">{title}</p>
            <div className="flex items-center gap-3 hover:opacity-50">
                <p className="font-normal cursor-pointer">{value}</p>
                <div className="rotate-">
                    <ChevronForward height={16} width={16}/>
                </div>
            </div>
        </li>
    )
}
