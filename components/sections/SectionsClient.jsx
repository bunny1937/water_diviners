"use client";
import dynamic from "next/dynamic";

const JourneySectionClient = dynamic(() => import("./JourneySectionClient"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "100vh" }} />,
});
const ProcessSectionClient = dynamic(() => import("./ProcessSectionClient"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "80vh" }} />,
});
const ServicesSectionClient = dynamic(() => import("./ServicesSectionClient"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "80vh" }} />,
});

export default function SectionsClient({ journey, process, services }) {
  return (
    <>
      <div id="about">
        <JourneySectionClient c={journey} />
      </div>
      <div id="services">
        <ServicesSectionClient c={services} />
      </div>
      <ProcessSectionClient c={process} />
    </>
  );
}
