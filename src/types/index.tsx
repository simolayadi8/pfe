// src/pages/index.tsx
import React from "react";
import { Link } from "@heroui/link";
import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";
import { button as buttonStyles } from "@heroui/theme";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center min-h-screen py-12">
        {/* Titre principal */}
        <h1 className={title()}>
          Géo‑portail de prédiction<br/>
          du rendement de blé
        </h1>

        {/* Sous‑titre / description */}
        <p className={subtitle({ class: "mt-4 max-w-2xl text-center" })}>
          Sélectionnez une parcelle sur la carte pour estimer en quelques secondes
          le rendement de votre culture grâce à l’imagerie satellite et nos modèles ML.
        </p>

        {/* Call‑to‑action */}
        <div className="flex gap-4 mt-8">
          <Link
            href="/prediction"
            className={buttonStyles({
              color: "primary",
              variant: "shadow",
              radius: "full",
            })}
          >
            Prédire maintenant
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
