import AboutPage from "@/components/pages/user/About/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | BAMHS Alumni",
  description: "Learn more about the BAMHS alumni community and our mission.",
};

const About = () => {
  return (
    <div>
      <AboutPage />
    </div>
  )
}
export default About