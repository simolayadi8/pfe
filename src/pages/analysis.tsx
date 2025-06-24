import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
import DefaultLayout from '@/layouts/default';

interface NDVIData {
  parcelle: number;
  annee: number;
  janvier: number;
  fevrier: number;
  mars: number;
  avril: number;
  mai: number;
}

interface RendementData {
  parcelle: number;
  annee: number;
  rendement: number;
  rendement_predit: number;
}

interface WeatherData {
  annee: number;
  temp_novembre: number;
  precip_novembre: number;
  temp_decembre: number;
  precip_decembre: number;
  temp_janvier: number;
  precip_janvier: number;
  cumul_precipitations: number;
  temperature_moyenne: number;
}

// Composant pour la comparaison météorologique
const WeatherComparison: React.FC<{ weatherData: WeatherData[] }> = ({ weatherData }) => {
  const [comparisonMode, setComparisonMode] = useState<string>('temperature');
  const [selectedYears, setSelectedYears] = useState<number[]>([2020, 2021]);

  // Préparer les données pour la superposition des courbes de température
  const temperatureComparisonData = (() => {
    const months = ['Novembre', 'Décembre', 'Janvier'];
    return months.map(month => {
      const monthData: any = { mois: month };
      selectedYears.forEach(year => {
        const yearData = weatherData.find(d => d.annee === year);
        if (yearData) {
          switch(month) {
            case 'Novembre':
              monthData[`temp_${year}`] = yearData.temp_novembre;
              break;
            case 'Décembre':
              monthData[`temp_${year}`] = yearData.temp_decembre;
              break;
            case 'Janvier':
              monthData[`temp_${year}`] = yearData.temp_janvier;
              break;
          }
        }
      });
      return monthData;
    });
  })();

  // Préparer les données pour la superposition des barres de précipitation
  const precipitationComparisonData = (() => {
    const months = ['Novembre', 'Décembre', 'Janvier'];
    return months.map(month => {
      const monthData: any = { mois: month };
      selectedYears.forEach(year => {
        const yearData = weatherData.find(d => d.annee === year);
        if (yearData) {
          switch(month) {
            case 'Novembre':
              monthData[`precip_${year}`] = yearData.precip_novembre;
              break;
            case 'Décembre':
              monthData[`precip_${year}`] = yearData.precip_decembre;
              break;
            case 'Janvier':
              monthData[`precip_${year}`] = yearData.precip_janvier;
              break;
          }
        }
      });
      return monthData;
    });
  })();

  const availableYears = weatherData.map(d => d.annee).sort();
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const toggleYearSelection = (year: number) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter(y => y !== year));
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de mode de comparaison */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setComparisonMode('temperature')}
          className={`px-4 py-2 rounded transition-all ${
            comparisonMode === 'temperature' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
        >
          Comparaison Températures
        </button>
        <button
          onClick={() => setComparisonMode('precipitation')}
          className={`px-4 py-2 rounded transition-all ${
            comparisonMode === 'precipitation' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
        >
          Comparaison Précipitations
        </button>
      </div>

      {/* Sélecteur d'années */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Sélectionner les années à comparer :</h4>
        <div className="flex gap-2 flex-wrap">
          {availableYears.map(year => (
            <button
              key={year}
              onClick={() => toggleYearSelection(year)}
              className={`px-3 py-1 rounded transition-all ${
                selectedYears.includes(year) 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Sélectionnez au moins 2 années pour afficher la comparaison.
        </p>
      </div>

      {selectedYears.length >= 2 && (
        <div>
          {comparisonMode === 'temperature' && (
            <div>
              <h3 className="text-lg font-medium mb-3">Superposition des Courbes de Température</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={temperatureComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis label={{ value: 'Température (°C)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  {selectedYears.map((year, index) => (
                    <Line 
                      key={year}
                      type="monotone" 
                      dataKey={`temp_${year}`} 
                      stroke={colors[index % colors.length]} 
                      strokeWidth={2}
                      name={`${year}`}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {comparisonMode === 'precipitation' && (
            <div>
              <h3 className="text-lg font-medium mb-3">Superposition des Barres de Précipitation</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={precipitationComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis label={{ value: 'Précipitations (mm)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  {selectedYears.map((year, index) => (
                    <Bar 
                      key={year}
                      dataKey={`precip_${year}`} 
                      fill={colors[index % colors.length]} 
                      name={`${year}`}
                      opacity={0.8}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {selectedYears.length < 2 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Veuillez sélectionner au moins 2 années pour afficher la comparaison.
        </div>
      )}
    </div>
  );
};

const AnalysisPage: React.FC = () => {
  const [ndviData, setNdviData] = useState<NDVIData[]>([]);
  const [rendementData, setRendementData] = useState<RendementData[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedParcelle, setSelectedParcelle] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number>(1); // Pour la nouvelle fonctionnalité NDVI
  const [activeTab, setActiveTab] = useState<string>('ndvi');
  const [ndviViewMode, setNdviViewMode] = useState<string>('parcelle'); // 'parcelle', 'mois' ou 'annee'

  useEffect(() => {
    // Charger les données NDVI
    fetch('/data/NDVI_Parcelles.csv')
      .then(response => response.text())
      .then(text => {
        const lines = text.trim().split('\n');
        const data = lines.slice(1).map(line => {
          const values = line.split(';'); // Utiliser ; comme séparateur
          return {
            parcelle: parseInt(values[0]),
            annee: parseInt(values[1]),
            janvier: parseFloat(values[2]),
            fevrier: parseFloat(values[3]),
            mars: parseFloat(values[4]),
            avril: parseFloat(values[5]),
            mai: parseFloat(values[6])
          };
        });
        setNdviData(data);
      })
      .catch(error => console.error('Erreur chargement NDVI:', error));

    // Charger les données de rendement
    fetch('/data/rendement_predit.csv')
      .then(response => response.text())
      .then(text => {
        const lines = text.trim().split('\n');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            parcelle: parseInt(values[0]),
            annee: parseInt(values[1]),
            rendement: parseFloat(values[2]),
            rendement_predit: parseFloat(values[3])
          };
        });
        setRendementData(data);
      })
      .catch(error => console.error('Erreur chargement rendement:', error));

    // Charger les données météo
    fetch('/data/weather.csv')
      .then(response => response.text())
      .then(text => {
        const lines = text.trim().split('\n');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          const temp_nov = parseFloat(values[1]);
          const precip_nov = parseFloat(values[2]);
          const temp_dec = parseFloat(values[3]);
          const precip_dec = parseFloat(values[4]);
          const temp_jan = parseFloat(values[5]);
          const precip_jan = parseFloat(values[6]);
          
          return {
            annee: parseInt(values[0]),
            temp_novembre: temp_nov,
            precip_novembre: precip_nov,
            temp_decembre: temp_dec,
            precip_decembre: precip_dec,
            temp_janvier: temp_jan,
            precip_janvier: precip_jan,
            cumul_precipitations: precip_nov + precip_dec + precip_jan,
            temperature_moyenne: (temp_nov + temp_dec + temp_jan) / 3
          };
        });
        setWeatherData(data);
      })
      .catch(error => console.error('Erreur chargement météo:', error));
  }, []);

  // Préparer les données NDVI pour le graphique par parcelle (mode existant)
  const ndviChartData = ndviData
    .filter(d => d.parcelle === selectedParcelle)
    .map(d => ({
      annee: d.annee,
      janvier: d.janvier,
      fevrier: d.fevrier,
      mars: d.mars,
      avril: d.avril,
      mai: d.mai
    }));

  // Nouvelle fonctionnalité : Préparer les données NDVI pour la comparaison année par année d'un mois donné
  const getMonthName = (monthNum: number): string => {
    const months = ['', 'janvier', 'fevrier', 'mars', 'avril', 'mai'];
    return months[monthNum] || '';
  };

  const ndviMonthComparisonData = (() => {
    const monthKey = getMonthName(selectedMonth) as keyof NDVIData;
    if (!monthKey) return [];
    
    const years = [...new Set(ndviData.map(d => d.annee))].sort();
    
    return years.map(year => {
      const yearData: any = { annee: year };
      const parcelles = [...new Set(ndviData.map(d => d.parcelle))].sort();
      
      parcelles.forEach(parcelle => {
        const data = ndviData.find(d => d.annee === year && d.parcelle === parcelle);
        yearData[`parcelle_${parcelle}`] = data ? data[monthKey] : null;
      });
      
      return yearData;
    });
  })();

  // Nouvelle fonctionnalité : Préparer les données NDVI pour la comparaison par année (tous les mois pour une année)
  const ndviYearComparisonData = (() => {
    const months = ['janvier', 'fevrier', 'mars', 'avril', 'mai'];
    const parcelles = [...new Set(ndviData.map(d => d.parcelle))].sort();

    return months.map(month => {
      const monthData: any = { mois: month.charAt(0).toUpperCase() + month.slice(1) };
      parcelles.forEach(parcelle => {
        const data = ndviData.find(d => d.annee === selectedYear && d.parcelle === parcelle);
        monthData[`parcelle_${parcelle}`] = data ? data[month as keyof NDVIData] : null;
      });
      return monthData;
    });
  })();

  // Préparer les données de comparaison rendement
  const rendementChartData = rendementData.map(d => ({
    parcelle: `Parcelle ${d.parcelle}`,
    annee: d.annee,
    reel: d.rendement,
    predit: d.rendement_predit,
    difference: Math.abs(d.rendement - d.rendement_predit)
  }));

  // Préparer les données météo pour le graphique
  const weatherChartData = weatherData.map(d => ({
    annee: d.annee,
    temp_novembre: d.temp_novembre,
    temp_decembre: d.temp_decembre,
    temp_janvier: d.temp_janvier,
    precip_novembre: d.precip_novembre,
    precip_decembre: d.precip_decembre,
    precip_janvier: d.precip_janvier,
    cumul_precipitations: d.cumul_precipitations,
    temperature_moyenne: d.temperature_moyenne
  }));

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Analyse des Données Agricoles</h1>
        
        {/* Navigation par onglets */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('ndvi')}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === 'ndvi' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Analyse NDVI
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === 'weather' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Données Météo
            </button>
            <button
              onClick={() => setActiveTab('rendement')}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === 'rendement' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Comparaison Rendements
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'ndvi' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* Sélecteur de mode de visualisation NDVI */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Analyse NDVI</h2>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setNdviViewMode('parcelle')}
                  className={`px-4 py-2 rounded transition-all ${
                    ndviViewMode === 'parcelle' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  Par Parcelle
                </button>
                <button
                  onClick={() => setNdviViewMode('mois')}
                  className={`px-4 py-2 rounded transition-all ${
                    ndviViewMode === 'mois' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  Comparaison Mensuelle
                </button>
                <button
                  onClick={() => setNdviViewMode('annee')}
                  className={`px-4 py-2 rounded transition-all ${
                    ndviViewMode === 'annee' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  Comparaison Annuelle
                </button>
              </div>
            </div>

            {ndviViewMode === 'parcelle' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-3">Évolution NDVI par Parcelle</h3>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map(parcelle => (
                      <button
                        key={parcelle}
                        onClick={() => setSelectedParcelle(parcelle)}
                        className={`px-3 py-1 rounded transition-all ${
                          selectedParcelle === parcelle 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                      >
                        Parcelle {parcelle}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={ndviChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="annee" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="janvier" stroke="#8884d8" name="Janvier" />
                    <Line type="monotone" dataKey="fevrier" stroke="#82ca9d" name="Février" />
                    <Line type="monotone" dataKey="mars" stroke="#ffc658" name="Mars" />
                    <Line type="monotone" dataKey="avril" stroke="#ff7300" name="Avril" />
                    <Line type="monotone" dataKey="mai" stroke="#8dd1e1" name="Mai" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {ndviViewMode === 'mois' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-3">Comparaison NDVI d'un Mois sur Toutes les Années</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Sélectionnez un mois pour voir l'évolution du NDVI de ce mois pour toutes les parcelles sur toutes les années.
                  </p>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map(month => (
                      <button
                        key={month}
                        onClick={() => setSelectedMonth(month)}
                        className={`px-3 py-1 rounded transition-all ${
                          selectedMonth === month 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                      >
                        {getMonthName(month).charAt(0).toUpperCase() + getMonthName(month).slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={ndviMonthComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="annee" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {[1, 2, 3, 4, 5].map(parcelle => (
                      <Line 
                        key={`parcelle_${parcelle}`}
                        type="monotone" 
                        dataKey={`parcelle_${parcelle}`} 
                        stroke={['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'][parcelle - 1]} 
                        name={`Parcelle ${parcelle}`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                
                {/* Statistiques pour le mois sélectionné */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-lg font-medium mb-3">Statistiques pour {getMonthName(selectedMonth).charAt(0).toUpperCase() + getMonthName(selectedMonth).slice(1)}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5].map(parcelle => {
                      const parcelleData = ndviMonthComparisonData.map(d => d[`parcelle_${parcelle}`]).filter(v => v !== null);
                      const moyenne = parcelleData.length > 0 ? (parcelleData.reduce((a, b) => a + b, 0) / parcelleData.length).toFixed(3) : 'N/A';
                      const min = parcelleData.length > 0 ? Math.min(...parcelleData).toFixed(3) : 'N/A';
                      const max = parcelleData.length > 0 ? Math.max(...parcelleData).toFixed(3) : 'N/A';
                      
                      return (
                        <div key={parcelle} className="text-sm">
                          <div className="font-medium text-gray-800 dark:text-gray-200">Parcelle {parcelle}</div>
                          <div className="text-gray-600 dark:text-gray-400">Moyenne: {moyenne}</div>
                          <div className="text-gray-600 dark:text-gray-400">Min: {min} | Max: {max}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {ndviViewMode === 'annee' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-3">Comparaison NDVI par Année</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Sélectionnez une année pour voir l'évolution du NDVI pour tous les mois et toutes les parcelles.
                  </p>
                  <div className="flex gap-2 mb-4">
                    {[2020, 2021, 2022, 2023, 2024].map(year => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`px-3 py-1 rounded transition-all ${
                          selectedYear === year 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={ndviYearComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {[1, 2, 3, 4, 5].map(parcelle => (
                      <Line 
                        key={`parcelle_${parcelle}`}
                        type="monotone" 
                        dataKey={`parcelle_${parcelle}`} 
                        stroke={['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'][parcelle - 1]} 
                        name={`Parcelle ${parcelle}`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                
                {/* Statistiques pour l'année sélectionnée */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-lg font-medium mb-3">Statistiques pour l'année {selectedYear}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5].map(parcelle => {
                      const parcelleData = ndviData.filter(d => d.annee === selectedYear && d.parcelle === parcelle);
                      const moisValues = ['janvier', 'fevrier', 'mars', 'avril', 'mai'].map(month => parcelleData[0]?.[month as keyof NDVIData]).filter(v => v !== undefined && v !== null);
                      const moyenne = moisValues.length > 0 ? (moisValues.reduce((a, b) => a + b, 0) / moisValues.length).toFixed(3) : 'N/A';
                      const min = moisValues.length > 0 ? Math.min(...moisValues).toFixed(3) : 'N/A';
                      const max = moisValues.length > 0 ? Math.max(...moisValues).toFixed(3) : 'N/A';
                      
                      return (
                        <div key={parcelle} className="text-sm">
                          <div className="font-medium text-gray-800 dark:text-gray-200">Parcelle {parcelle}</div>
                          <div className="text-gray-600 dark:text-gray-400">Moyenne: {moyenne}</div>
                          <div className="text-gray-600 dark:text-gray-400">Min: {min} | Max: {max}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Conditions Météorologiques</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Données pour novembre et décembre de l'année N-1 et janvier de l'année N
            </p>
            
            {/* Nouvelles métriques météo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Cumul des Précipitations (Novembre-Janvier)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weatherChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="annee" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} mm`, 'Cumul Précipitations']} />
                    <Bar dataKey="cumul_precipitations" fill="#4ecdc4" name="Cumul Précipitations (mm)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Température Moyenne (Novembre-Janvier)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weatherChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="annee" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}°C`, 'Température Moyenne']} />
                    <Line type="monotone" dataKey="temperature_moyenne" stroke="#ff6b6b" strokeWidth={3} name="Température Moyenne (°C)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comparaison des conditions météo d'une année à l'autre */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Comparaison des Conditions Météo</h3>
              <WeatherComparison weatherData={weatherData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Températures Moyennes par Mois (°C)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weatherChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="annee" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temp_novembre" stroke="#ff6b6b" name="Novembre" />
                    <Line type="monotone" dataKey="temp_decembre" stroke="#4ecdc4" name="Décembre" />
                    <Line type="monotone" dataKey="temp_janvier" stroke="#45b7d1" name="Janvier" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Précipitations par Mois (mm)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weatherChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="annee" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="precip_novembre" fill="#ff6b6b" name="Novembre" />
                    <Bar dataKey="precip_decembre" fill="#4ecdc4" name="Décembre" />
                    <Bar dataKey="precip_janvier" fill="#45b7d1" name="Janvier" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rendement' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Rendements Réels vs Prédits(obtenues par méthode LOO)</h2>
            
            {/* Sélecteur d'année */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Sélectionner l'année :</label>
              <div className="flex gap-2">
                {[2020, 2021, 2022, 2023, 2024].map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1 rounded transition-all ${
                      selectedYear === year 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Comparaison par Parcelle ({selectedYear})</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rendementChartData.filter(d => d.annee === selectedYear)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="parcelle" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reel" fill="#8884d8" name="Rendement Réel" />
                    <Bar dataKey="predit" fill="#82ca9d" name="Rendement Prédit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default AnalysisPage;


