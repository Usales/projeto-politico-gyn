
import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { supabase } from "../lib/supabase";

const CENTRO = [-16.6869, -49.2648];

function areaAnelKm2(anel) {
  const raio = 6371008.8;
  let soma = 0;

  for (let i = 0; i < anel.length - 1; i++) {
    const [lon1, lat1] = anel[i];
    const [lon2, lat2] = anel[i + 1];

    const l1 = (lon1 * Math.PI) / 180;
    const l2 = (lon2 * Math.PI) / 180;
    const p1 = (lat1 * Math.PI) / 180;
    const p2 = (lat2 * Math.PI) / 180;

    soma += (l2 - l1) * (2 + Math.sin(p1) + Math.sin(p2));
  }

  return Math.abs((soma * raio * raio) / 2) / 1000000;
}

function calcularAreaKm2(geometry) {
  if (!geometry?.coordinates) return null;

  function areaPoligono(aneis) {
    if (!aneis?.length) return 0;

    let area = areaAnelKm2(aneis[0]);

    for (let i = 1; i < aneis.length; i++) {
      area -= areaAnelKm2(aneis[i]);
    }

    return Math.max(0, area);
  }

  let area = 0;

  if (geometry.type === "Polygon") {
    area = areaPoligono(geometry.coordinates);
  } else if (geometry.type === "MultiPolygon") {
    area = geometry.coordinates.reduce(
      (total, poligono) => total + areaPoligono(poligono),
      0
    );
  } else {
    return null;
  }

  return Number(area.toFixed(6));
}

function FerramentasMapa({ bairro, camadaRef, onMudanca }) {
  const map = useMap();

  useEffect(() => {
    if (!map.pm) return;

    map.pm.addControls({
      position: "topleft",
      drawPolygon: true,
      drawMarker: false,
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawText: false,
      editMode: true,
      dragMode: true,
      removalMode: true,
      cutPolygon: false,
      rotateMode: false,
    });

    map.pm.setGlobalOptions({
      continueDrawing: false,
      snappable: true,
    });

    let camada = null;

    if (bairro?.poligono) {
      try {
        const geojson = L.geoJSON({
          type: "Feature",
          properties: { nome: bairro.nome },
          geometry: bairro.poligono,
        });

        const layers = geojson.getLayers();

        if (layers.length === 1) {
          camada = layers[0];
          camada.setStyle({
            color: "#f5b82e",
            weight: 3,
            fillColor: "#f5b82e",
            fillOpacity: 0.3,
          });
          camada.addTo(map);
          camadaRef.current = camada;

          const limites = camada.getBounds?.();

          if (limites?.isValid()) {
            map.fitBounds(limites, {
              padding: [35, 35],
              maxZoom: 16,
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar polígono:", error);
      }
    }

    function aoCriar(event) {
      if (camada) map.removeLayer(camada);

      camada = event.layer;
      camada.setStyle({
        color: "#f5b82e",
        weight: 3,
        fillColor: "#f5b82e",
        fillOpacity: 0.3,
      });

      camadaRef.current = camada;
      onMudanca();
    }

    function aoEditar(event) {
      if (event.layer === camada) onMudanca();
    }

    function aoRemover(event) {
      if (event.layer === camada) {
        camada = null;
        camadaRef.current = null;
        onMudanca();
      }
    }

    map.on("pm:create", aoCriar);
    map.on("pm:edit", aoEditar);
    map.on("pm:remove", aoRemover);

    return () => {
      map.off("pm:create", aoCriar);
      map.off("pm:edit", aoEditar);
      map.off("pm:remove", aoRemover);

      if (camada && map.hasLayer(camada)) {
        map.removeLayer(camada);
      }

      camadaRef.current = null;
      map.pm.removeControls();
    };
  }, [map, bairro, camadaRef, onMudanca]);

  return null;
}

export default function AdminBairrosMapa({
  bairros = [],
  onAtualizado,
}) {
  const [bairroId, setBairroId] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const camadaRef = useRef(null);

  const bairro = bairros.find((item) => item.id === bairroId);

  const aoMudarDesenho = useCallback(() => {
    setMensagem("Alteração ainda não salva.");
  }, []);

  async function salvarGeometria() {
    if (!supabase || !bairro) return;

    const camada = camadaRef.current;

    if (!camada) {
      setMensagem(
        "Nenhum polígono disponível. Desenhe um contorno no mapa."
      );
      return;
    }

    const geometry = camada.toGeoJSON().geometry;

    if (
      !geometry ||
      !["Polygon", "MultiPolygon"].includes(geometry.type)
    ) {
      setMensagem("A geometria selecionada não é válida.");
      return;
    }

    const area = calcularAreaKm2(geometry);

    if (area === null || !Number.isFinite(area) || area <= 0) {
      setMensagem("Não foi possível calcular uma área válida.");
      return;
    }

    setSalvando(true);
    setMensagem("");

    try {
      const { data, error } = await supabase
        .from("bairros")
        .update({
          poligono: geometry,
          area_km2: area,
        })
        .eq("id", bairro.id)
        .select("id")
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        throw new Error(
          "Nenhum registro foi atualizado. Verifique a permissão de administrador e as políticas RLS."
        );
      }

      setMensagem(
        `Polígono salvo. Área aproximada: ${area.toLocaleString(
          "pt-BR",
          { maximumFractionDigits: 3 }
        )} km².`
      );

      await onAtualizado?.();
    } catch (error) {
      console.error("Erro ao salvar geometria:", error);
      setMensagem(
        error.message ||
          "Não foi possível salvar o polígono no Supabase."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-white">
      <div>
        <h2 className="text-xl font-bold">
          Editor de limites dos bairros
        </h2>
        <p className="mt-2 text-sm text-white/60">
          Selecione um bairro para editar seu contorno. Arraste
          os vértices para ajustar a forma ou desenhe um novo
          polígono. Salve para gravar a alteração no banco.
        </p>
      </div>

      <label className="block text-sm font-semibold">
        Bairro
        <select
          value={bairroId}
          onChange={(event) => {
            setBairroId(event.target.value);
            setMensagem("");
          }}
          className="mt-2 w-full rounded-xl border border-white/15 bg-[#0b1425] px-4 py-3 text-white"
        >
          <option value="">Selecione um bairro</option>
          {bairros.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome}
            </option>
          ))}
        </select>
      </label>

      {bairro && (
        <>
          <div className="h-[480px] overflow-hidden rounded-xl border border-white/10">
            <MapContainer
              key={bairro.id}
              center={CENTRO}
              zoom={12}
              scrollWheelZoom
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <FerramentasMapa
                bairro={bairro}
                camadaRef={camadaRef}
                onMudanca={aoMudarDesenho}
              />
            </MapContainer>
          </div>

          <p className="text-sm text-white/60">
            Use as ferramentas no canto superior esquerdo do mapa
            para desenhar, editar, mover ou remover o polígono.
            Remover o desenho só altera a sessão atual até você
            salvar uma nova geometria.
          </p>

          <button
            type="button"
            onClick={salvarGeometria}
            disabled={salvando}
            className="rounded-xl bg-[#f5b82e] px-5 py-3 font-bold text-[#101827] disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar geometria e área"}
          </button>
        </>
      )}

      {mensagem && (
        <p role="status" className="text-sm text-white/80">
          {mensagem}
        </p>
      )}
    </section>
  );
}
