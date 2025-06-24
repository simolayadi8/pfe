import React, { useState } from "react";
import { Link } from "@heroui/link";
import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";
import { button as buttonStyles } from "@heroui/theme";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";

export default function PredictionPage() {
  const [selectedModel, setSelectedModel] = useState("stafnet");

  const models = [
    {
      id: "stafnet",
      name: "STAFNet",
      fullName: "Spatial-Temporal Attention Fusion Network",
      accuracy: "93.5%",
      description: "Modèle d'apprentissage profond avec mécanisme d'attention spatio-temporelle",
      features: ["Fusion spatio-temporelle", "Mécanisme d'attention"],
      color: "primary"
    },
    {
      id: "xgboost",
      name: "XGBoost",
      fullName: "eXtreme Gradient Boosting",
      accuracy: "91.9%",
      description: "Modèle d'apprentissage automatique basé sur le gradient boosting",
      features: [],
      color: "secondary"
    }
  ];

  const predictionSteps = [

  ];

  const architectureComponents = [
    {
      name: "Encodeur Spatial",
      description: "Extraction des caractéristiques visuelles des images satellitaires",
    },
    {
      name: "Module de Fusion",
      description: "Intégration spatio-temporelle et climatique",
      details: "Combine les données  météorologiques et temporelles"
    },
    {
      name: "Mécanisme d'Attention",
      description: "Focalisation sur les caractéristiques importantes",
      details: "Améliore la précision en pondérant les informations pertinentes"
    },
    {
      name: "Tête de Régression",
      description: "Prédiction finale du rendement",
      details: "Couches denses pour la prédiction quantitative"
    }
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className={title({ size: "lg" })}>
            Prédiction du Rendement avec STAFNet
          </h1>
          <p className={subtitle({ class: "mt-4 max-w-4xl mx-auto" })}>
            Modèle d'intelligence artificielle avancé pour la prédiction précise du rendement du blé 
            utilisant la télédétection et l'apprentissage profond
          </p>
        </div>

        {/* Section Hero */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <CardBody className="p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Intelligence Artificielle pour l'Agriculture
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                  STAFNet combine les dernières avancées en apprentissage profond avec 
                  les données de télédétection pour prédire le rendement des cultures 
                  avec une précision exceptionnelle de 93.5%.
                </p>
                <div className="flex gap-4 justify-center">
                  <Chip color="success" variant="flat">Précision: 93.5%</Chip>
                  <Chip color="primary" variant="flat">Deep Learning</Chip>
                  <Chip color="secondary" variant="flat">Sentinel-2</Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Comparaison des modèles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Comparaison des Modèles</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {models.map((model) => (
              <Card 
                key={model.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedModel === model.id ? 'ring-2 ring-blue-500' : ''
                }`}
                isPressable
                onPress={() => setSelectedModel(model.id)}
              >
                <CardHeader className="pb-2">
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold">{model.name}</h3>
                      <Chip color={model.color as any} variant="flat">
                        {model.accuracy}
                      </Chip>
                    </div>
                    <p className="text-sm text-gray-500">{model.fullName}</p>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <p className="text-sm mb-4">{model.description}</p>
                  <div className="space-y-2">
                    {model.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Architecture STAFNet */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Architecture STAFNet</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {architectureComponents.map((component, index) => (
              <Card key={index}>
                <CardBody className="p-4">
                  <h3 className="font-bold text-lg mb-2">{component.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {component.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {component.details}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Processus de prédiction */}
        <div className="mb-12">
          
          
        </div>

        {/* Résultats et performances */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Performances du Modèle</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold">Métriques de Performance</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>R² (Coefficient de détermination)</span>
                    <span className="font-bold text-blue-600">0.935</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between items-center">
                    <span>RMSE (kg/ha)</span>
                    <span className="font-bold text-green-600">155.93</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between items-center">
                    <span>MAE (kg/ha)</span>
                    <span className="font-bold text-purple-600">122.88</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold">Avantages du Modèle</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Haute Précision</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      93.5% de précision grâce à l'augmentation de données GAN
                    </p>
                  </div>
                  <Divider />
                  <div>
                    <h4 className="font-semibold mb-1">Fusion Multi-Source</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Combine données satellitaires et climatiques
                    </p>
                  </div>
                  <Divider />
                  <div>
                    <h4 className="font-semibold mb-1">Mécanisme d'Attention</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Focalisation sur les caractéristiques importantes
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Données utilisées */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Données utilisées</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardBody className="text-center p-6">
                <h3 className="font-bold mb-2">Images Sentinel-2</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Images satellitaires multispectrales (2020-2024) 
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center p-6">
                <h3 className="font-bold mb-2">Données Climatiques</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Précipitations et températures 
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center p-6">
                <h3 className="font-bold mb-2">Rendements Simulés</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Données de rendement du blé pour la commune de Sidi Yahya Zaier
                </p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <CardBody className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Explorez les Prédictions en Action
              </h2>
              <p className="mb-6 text-blue-100">
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/map"
                  className={buttonStyles({
                    color: "default",
                    variant: "solid",
                    radius: "full",
                  })}
                >
                  Voir la Carte
                </Link>
                <Link
                  href="/analysis"
                  className={buttonStyles({
                    color: "default",
                    variant: "bordered",
                    radius: "full",
                  })}
                >
                  Analyser les Données
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
}

