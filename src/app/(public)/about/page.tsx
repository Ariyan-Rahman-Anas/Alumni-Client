import AboutPage from "@/components/pages/user/About/AboutPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const wm = await getWebsiteData();
  const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
  const name: string = wm?.schoolName ?? "Battali Abdul Matin High School";

  return {
    title: "About",
    description: `Learn about the ${name} Alumni Association — our history, mission, and the community that connects ${shortName} graduates.`,
  };
}

const About = () => {
  return (
    <div>
      <AboutPage />
    </div>
  )
}
export default About