import { BasicCard, FoodCard, StoreCard } from "../components/card";
import { Hero } from "../components/hero";
import { ArrowButton } from "../components/button";
import { H2 } from "../utils/typography";

export function Home() {
    return (
        <>
            <Hero/>
            <section className='grid place-items-center' id='grocery-store'>
            <div className='my-16'>
                <H2 variant='black' className='text-black font-semibold text-center mb-2'>Choose your grocery <span className='text-defaultGreen'>store</span></H2>
                <p className='text-black text-center'>Select a store - Place your order - Get your delivery</p>
            </div>
            <ul className='grid grid-cols-3 w-full gap-4 max-w-6xl'>
                {
                Array.from({length: 6}).map((_, idx) => (
                    <StoreCard
                        title="LCBO"
                        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. blanditiis."
                        alt="img"
                        src="https://cdn.theorg.com/f1bbabce-f3da-42a0-89fe-8be4f53af00f_thumb.jpg"
                        className=''
                        key={idx}
                    />
                ))
                }
            </ul>
            <div className='my-20'>
                <ArrowButton variant='primary' size='medium' text="Show All" className='h-8 font-semibold'/>
            </div>
            </section>
            <section className='grid place-items-center bg-[#d7e1b8]' id='dishes'>
            <div className='my-16'>
                <H2 variant='black' className='text-black font-semibold text-center mb-2'>Choose your <span className='text-defaultGreen'>restaurant</span></H2>
                <p>Make your choice from a wide variety of culturally diverse Restaurants</p>
            </div>
            <ul className='flex w-full gap-4 max-w-6xl'>
                {
                Array.from({length: 4}).map((_, idx) => (
                    <FoodCard
                        title="Nigeria"
                        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. blanditiis."
                        alt="img"
                        src="https://images.pexels.com/photos/5929/food-salad-dinner-eating.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        className='group relative bg-rose-300 h-[380px] overflow-hidden flex-1 cursor-pointer hover:grow-[1.3] transition-all'
                        key={idx}
                    />
                ))
                }
            </ul>
            <div className='my-20'>
                <ArrowButton variant='primary' size='medium' text="Show All" className='h-8 font-semibold'/>
            </div>
            </section>
            <section className='bg-smoke grid place-items-center py-20' id='how-it-works'>
            <div className='mb-9'>
                <H2 variant='black' className='text-black font-semibold text-center mb-2'>How it's <span className='text-defaultGreen'>Works</span></H2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates autem beatae minus quia.</p>
            </div>
            <ul className='flex w-full gap-4 max-w-6xl'>
                {
                Array.from({length: 4}).map((_, idx) => (
                    <BasicCard
                        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. blanditiis."
                        alt="img"
                        src="https://images.pexels.com/photos/5929/food-salad-dinner-eating.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        key={idx}
                    />
                ))
                }
            </ul>
            </section>
            <section className='bg-brown-bg h-[550px] flex items-center justify-center py-8' id='blog'>
                <div className='w-96 h-96 flex items-center relative'>
                    {/** put those in image in a container with gray background. Good for web vital */}
                <img className='absolute w-52 h-52 ring-4 ring-purple-600 object-cover -top-2 -left-16 origin-center rotate-45' src="https://as2.ftcdn.net/v2/jpg/06/66/40/51/1000_F_666405168_oPJGLEWNZxq83VhFTyHAzQYwS6V6VnuH.jpg" />
                <img className='absolute w-52 h-52 ring-4 ring-orange-500 object-cover left-20 origin-bottom rotate-12' src="https://images.pexels.com/photos/5929/food-salad-dinner-eating.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                <img className='absolute w-52 h-52 ring-4 ring-black -bottom-8 -left-10 origin-bottom -rotate-12' src="https://images.unsplash.com/photo-1611712142269-12b7433e28e9?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                </div>
                <div className='mb-9 grid place-items-center'>
                <H2 variant='black' className='text-black font-semibold text-center mb-2'>There is more to explore</H2>
                <p className='text-center'>Visit our blog for recipe, cultural events and more.</p>
                <ArrowButton variant='primary' size='large' text="Visit our blog" className='font-semibold mt-8 h-8'/>
                </div>  
            </section>
        </>
    )
}
