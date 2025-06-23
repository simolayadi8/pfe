import React from "react";
import { Link } from "@heroui/link";
import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";
import { button as buttonStyles } from "@heroui/theme";
import EarthSatellite3D from "@/components/EarthSatellite3D";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="relative flex flex-col items-center justify-center min-h-screen py-12 overflow-hidden">
        <EarthSatellite3D /> 

        <h1 className={title()}>
          Analyse et Visualisation<br/>
          des Données Agricoles
        </h1>

        <p className={subtitle({ class: "mt-4 max-w-2xl text-center" })}>
          Explorez les données NDVI, météorologiques et de rendement pour une meilleure compréhension de vos parcelles.
        </p>

        <div className="flex gap-4 mt-8">
          <Link
            href="/map"
            className={buttonStyles({
              color: "primary",
              variant: "shadow",
              radius: "full",
            })}
          >
            Carte
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}


