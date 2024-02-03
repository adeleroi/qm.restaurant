import { Link } from "react-router-dom";
import { StoreCard } from "../components/card";

export function StoreList() {
    return (
        <section className="grid mx-auto max-w-6xl">
            <div className="mt-20">
                <h1 className="text-4xl font-bold mb-8">Grocery store</h1>
            </div>
            <ul className='grid grid-cols-3 w-full gap-4 max-w-6xl'>
                {
                Array.from({length: 6}).map((_, idx) => (
                    <Link to="lcbo" key={idx}>
                        <StoreCard
                            title="LCBO"
                            description="Groceries . Organic . Alcohol"
                            alt="lcbo-logo"
                            src="https://cdn.theorg.com/f1bbabce-f3da-42a0-89fe-8be4f53af00f_thumb.jpg"
                            className=''
                            offer="20% off"
                            deliveryTime="Delivery by 11am"
                            key={idx}
                        />
                    </Link>
                ))
                }
            </ul>
        </section>
    )
}
