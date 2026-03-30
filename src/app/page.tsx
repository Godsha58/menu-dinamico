import { HomeMenuClient } from "@/components/HomeMenuClient";
import { menuBySection } from "@/data/menu";

export default function Home() {
  return <HomeMenuClient sections={menuBySection} />;
}
