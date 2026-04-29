import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import Image from "next/image"
import { RiMapPinLine, RiMoneyDollarCircleLine } from "react-icons/ri"
import { IServiceProvider } from "./job.types";

const JobPageProviderCard = ({ provider, onClick }: { provider: IServiceProvider; onClick: () => void }) => {
    return (
        <FadeUpWrapper
            delay={0.04}
            onClick={onClick}
            className="group bg-white rounded-2xl border border-surface-200 p-4 hover:shadow-md hover:border-primary2-300 cursor-pointer transition-all duration-300 flex gap-4 items-start"
        >
            {provider.user.imageUrl ? (
                <Image src={provider.user.imageUrl} alt={provider.user.name} width={52} height={52} className="rounded-xl object-cover flex-shrink-0" />
            ) : (
                <div className="rounded-xl bg-primary2-100 flex items-center justify-center text-xl font-bold text-primary2-700 flex-shrink-0 w-[52px] h-[52px]">
                    {provider.user.name[0]}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-primary2-900 text-sm group-hover:text-primary2-700 transition-colors">{provider.user.name}</h4>
                    <span className="text-xs bg-primary2-50 text-primary2-700 border border-primary2-200 px-2 py-0.5 rounded-full capitalize flex-shrink-0">{provider.providerType}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><RiMapPinLine className="flex-shrink-0" /> {provider.location}</p>
                <p className="text-xs text-neutral-600 mt-1.5 line-clamp-2">{provider.bio}</p>
                {(provider.hourlyRate || provider.monthlyRate) && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <RiMoneyDollarCircleLine />
                        {provider.hourlyRate ? `${provider.hourlyRate} BDT/hr` : ""}
                        {provider.hourlyRate && provider.monthlyRate ? " Â· " : ""}
                        {provider.monthlyRate ? `${provider.monthlyRate} BDT/mo` : ""}
                    </p>
                )}
            </div>
        </FadeUpWrapper>
    )
}
export default JobPageProviderCard