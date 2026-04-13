import type { Metadata } from "next";
import AboutPage from "@/components/Pages/USER/About/AboutPage"

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