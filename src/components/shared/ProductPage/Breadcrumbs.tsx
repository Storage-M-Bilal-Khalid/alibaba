import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs(){
    return(
        <section className="flex space-x-4 mt-5">
            <ul  className="flex space-x-4 text-[#8b96a5] text-sm cursor-pointer">
                <li>Home</li>
                <ChevronRight className='w-4 h-4 mt-[6px]'/>
                <li>Categories</li>
                <ChevronRight className='w-4 h-4 mt-[6px]'/>
                <li>Mens's wear</li>
                <ChevronRight className='w-4 h-4  mt-[6px]'/>
                <li>Summer clothing</li>
            </ul>
        </section>
    )
}