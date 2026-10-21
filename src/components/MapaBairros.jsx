import { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useConsentimento } from "../lib/consentimento";
import AvisoTerceiros from "./AvisoTerceiros";

const CENTRO_GOIANIA = [-16.6869, -49.2648];

function AjustarVista({ dados }) {
  const map = useMap();

  useEffect(() => {
    if (!dados || dados.length === 0) return;
    
    // Cria um GeoJSON temporário apenas para calcular os limites (bounds)
    const featureCollection = {
      type: "FeatureCollection",
      features: dados
        .filter(b => b.poligono)
        .map(b => ({
          type: "Feature",
          geometry: b.poligono,
          properties: { nome: b.nome }
        }))
    };

    const limites = L.geoJSON(featureCollection).getBounds();
    if (limites.isValid()) {
      map.fitBounds(limites, { padding: [40, 40], maxZoom: 15 });
    }
  }, [map, dados]);

  return null;
}

export default function MapaBairros({ bairros }) {
  const permitido = useConsentimento() === "sim";
  
  // Criamos um Set de nomes de bairros visitados para busca rápida
  const visitados = new Set(bairros.filter((b) => b.visitado).map((b) => b.nome));

  const estilo = (feature) => {
    const nome = feature.properties?.nome;
    const isVisitado = visitados.has(nome);
    return {
      color: isVisitado ? "#16a34a" : "#dc2626",
      weight: 4,
      fillColor: isVisitado ? "#22c55e" : "#dc2626",
      fillOpacity: isVisitado ? 0.45 : 0.25,
    };
  };

  function aoCriarBairro(feature, layer) {
    const nome = feature.properties?.nome;
    if (!nome) return;
    const texto = document.createElement("span");
    texto.textContent = `${nome} · ${visitados.has(nome) ? "Visitado" : "Pendente"}`;
    layer.bindTooltip(texto, { sticky: true });
  }

  // Transformamos a lista de bairros do banco no formato GeoJSON que o Leaflet entende
  const geoJsonDados = {
    type: "FeatureCollection",
    features: bairros
      .filter(b => b.poligono) // Só mostra quem tem desenho no mapa
      .map(b => ({
        type: "Feature",
        geometry: b.poligono,
        properties: { nome: b.nome }
      }))
  };

  return (
    <div className="relative isolate z-0 h-[380px] overflow-hidden rounded-2xl border border-white/10 md:h-[520px]">
      {permitido ? (
        <MapContainer
          center={CENTRO_GOIANIA}
          zoom={11}
          minZoom={9}
          scrollWheelZoom={false}
          dragging={!L.Browser.mobile}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="mapa-cinza"
          />

          <AjustarVista dados={bairros} />

          {geoJsonDados.features.length > 0 && (
            <GeoJSON
              key={[...visitados].sort().join("|")} // Força o mapa a atualizar as cores quando mudar o status
              data={geoJsonDados}
              style={estilo}
              onEachFeature={aoCriarBairro}
            />
          )}
        </MapContainer>
      ) : (
        <AvisoTerceiros servico="o mapa de Goiânia (OpenStreetMap)" />
      )}
    </div>
  );
}
