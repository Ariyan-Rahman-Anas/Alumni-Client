import { useGetWebsiteManagementQuery } from "@/redux/apis/websiteManagementApi";

export const useSchoolInfo = () => {
    const { data: websiteManagement, isLoading, isError } = useGetWebsiteManagementQuery();
    const d = websiteManagement?.data;

    const name = d?.schoolName ?? "Battali Abdul Matin High School";
    const shortName = d?.schoolName?.split(" ").map((w) => w[0]).join("") ?? "BAMHS";
    const alumniName = `${shortName}ian`;
    const fullAddress = `${d?.postalCode ?? "3582"} - ${d?.area ?? "Battali"}, ${d?.thana ?? "Nangalkot"}, ${d?.district ?? "Cumilla"}, ${d?.division ?? "Chattogram"}, ${d?.country ?? "Bangladesh"}`;
    const contactNumber = d?.contactNumber ?? "01700000000";
    const whatsappNumber = d?.whatsappNumber ?? d?.contactNumber ?? "01700000000";
    const email = d?.email ?? "info@bamhsian.org.bd";
    const facebook = d?.facebook;
    const youtube = d?.youtube;
    const bannerUrl = d?.bannerUrl;
    const motto = d?.motto;

    return {
        name,
        shortName,
        alumniName,
        fullAddress,
        addresses: {
            postalCode: d?.postalCode ?? "3582",
            area: d?.area ?? "Battali",
            thana: d?.thana ?? "Nangalkot",
            district: d?.district ?? "Cumilla",
            division: d?.division ?? "Chattogram",
            country: d?.country ?? "Bangladesh",
        },
        contactNumber,
        whatsappNumber,
        email,
        facebook,
        youtube,
        bannerUrl,
        motto,
        isLoading,
        isError,
    };
};
