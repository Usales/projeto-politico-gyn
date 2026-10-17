import { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { bairrosGeo } from "../data/bairrosGeo";

const CENTRO_GOIANIA = [-16.6869, -49.2648];

// Enquadra o mapa nos polígonos cadastrados
function AjustarVista() {
  const map = useMap();

  useEffect(() => {
    if (!bairrosGeo.features.length) return;
    const limites = L.geoJSON(bairrosGeo).getBounds();
    if (limites.isValid()) {
      map.fitBounds(limites, { padding: [40, 40], maxZoom: 15 });
    }
  }, [map]);

  return null;
}

export default function MapaBairros({ bairros }) {
  const visitados = new Set(bairros.filter((b) => b.visitado).map((b) => b.nome));

  const estilo = (feature) => {
    const visitado = visitados.has(feature.properties?.nome);
    return {
      color: visitado ? "#16a34a" : "#dc2626",
      weight: 4,
      fillColor: visitado ? "#22c55e" : "#dc2626",
      fillOpacity: visitado ? 0.45 : 0.25,
    };
  };

  function aoCriarBairro(feature, layer) {
    const nome = feature.properties?.nome;
    if (!nome) return;
    const texto = document.createElement("span");
    texto.textContent = `${nome} · ${visitados.has(nome) ? "Visitado" : "Pendente"}`;
    layer.bindTooltip(texto, { sticky: true });
  }

  return (
    // "isolate" evita que o mapa fique por cima do menu fixo do site
    <div className="relative isolate z-0 h-[380px] overflow-hidden rounded-2xl border border-white/10 md:h-[520px]">
      <MapContainer
        center={CENTRO_GOIANIA}
        zoom={11}
        minZoom={9}
        scrollWheelZoom={false}
        dragging={!L.Browser.mobile} // no celular, 1 dedo rola a página e 2 dedos mexem no mapa
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="mapa-cinza"
        />

        <AjustarVista />

        {bairrosGeo.features.length > 0 && (
          <GeoJSON
            key={[...visitados].sort().join("|")}
            data={bairrosGeo}
            style={estilo}
            onEachFeature={aoCriarBairro}
          />
        )}
      </MapContainer>
    </div>
  );
}