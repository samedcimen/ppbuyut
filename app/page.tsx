import { HowItWorks } from "@/components/sections/how-it-works";
import { Viewer } from "@/components/viewer/viewer";

export default function Home() {
  return (
    <>
      <div className="min-h-[calc(100svh-4.5rem)] pb-16">
        <Viewer />
      </div>
      <HowItWorks />
    </>
  );
}
