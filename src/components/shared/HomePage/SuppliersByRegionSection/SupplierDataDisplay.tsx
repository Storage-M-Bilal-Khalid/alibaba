interface SupplierDataDisplayProps{
    imgUrl:string,
    country:string,
    shopname:string
}

export default function SupplierDataDisplay({imgUrl,country,shopname}:SupplierDataDisplayProps) {
    return (
        <div className="w-full grid grid-cols-[1fr_3fr] rounded-[2]">
            <div className="rounded-[2] p-2">
                <img src={imgUrl} alt="Flag" className="w-full h-full object-contain" />
            </div>
            <div className="pl-2 rounded-[2]">
                <p className="text-[#1c1c1c] cursor-pointer">{country}</p>
                <p className="text-sm text-[#8b96a5] hover:underline cursor-pointer transition-all duration-300 ease-in-out " title={"Go to " + country + " supplier ➡️"}>{shopname}</p>
            </div>
        </div>
    )
}