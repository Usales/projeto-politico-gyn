
import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { supabase } from "../lib/supabase";

const CENTRO_GOIANIA = [-16.6869, -49.2648];

function calcularAreaKm2(geometry) {
  if (!geometry?.coordinates) return null;

  const raio = 6371008.8;

  function areaAnel(coordenadas) {
    let soma = 0;

    for (let i = 0; i < coordenadas.length - 1; i++) {
      const [lon1, lat1] = coordenadas[i];
      const [lon2, lat2] = coordenadas[i + 1];

      const l1 = (lon1 * Math.PI) / 180;
      const l2 = (lon2 * Math.PI) / 180;
      const p1 = (lat1 * Math.PI) / 180;
      const p2 = (lat2 * Math.PI) / 180;

      soma +=
        (l2 - l1) *
        (2 + Math.sin(p1) + Math.sin(p2));
    }

    return Math.abs((soma * raio * raio) / 2) / 1000000;
  }

  function areaPoligono(aneis) {
    if (!aneis?.length) return 0;

    let area = areaAnel(aneis[0]);

    for (let i = 1; i < aneis.length; i++) {
      area -= areaAnel(aneis[i]);
    }

    return Math.max(0, area);
  }

  let area = 0;

  if (geometry.type === "Polygon") {
    area = areaPoligono(geometry.coordinates);
  } else if (geometry.type === "MultiPolygon") {
    area = geometry.coordinates.reduce(
      (total, poligono) =>
        total + areaPoligono(poligono),
      0
    );
  } else {
    return null;
  }

  return Number(area.toFixed(6));
}

function EditorMapa({ bairro, onGeometriaChange }) {
  const map = useMap();
  const camadaRef = useRef(null);
  const callbackRef = useRef(onGeometriaChange);
  const [modo, setModo] = useState("selecionar");
  const [erroMapa, setErroMapa] = useState("");

  useEffect(() => {
    callbackRef.current = onGeometriaChange;
  }, [onGeometriaChange]);

  const atualizarGeometria = useCallback((camada) => {
    if (!camada) {
      callbackRef.current(null);
      return;
    }

    const feature = camada.toGeoJSON();

    callbackRef.current(feature.geometry);
  }, []);

  const pararEdicao = useCallback(() => {
    const camada = camadaRef.current;

    if (map.pm) {
      map.pm.disableDraw();
    }

    if (camada?.pm) {
      camada.pm.disable();
      camada.pm.disableLayerDrag();
    }

    setModo("selecionar");
  }, [map]);

  useEffect(() => {
    if (!map.pm) {
      setErroMapa(
        "O Geoman não foi carregado. Verifique a instalação da dependência."
      );
      return;
    }

    let camada = null;

    function aplicarEstilo(layer) {
      if (layer.setStyle) {
        layer.setStyle({
          color: "#f5b82e",
          weight: 3,
          fillColor: "#f5b82e",
          fillOpacity: 0.25,
        });
      }
    }

    function aoEditar() {
      if (camada) atualizarGeometria(camada);
    }

    function aoCriar(event) {
      if (camada && map.hasLayer(camada)) {
        map.removeLayer(camada);
      }

      camada = event.layer;
      camadaRef.current = camada;

      aplicarEstilo(camada);
      pararEdicao();

      camada.on("pm:edit", aoEditar);
      camada.on("pm:dragend", aoEditar);

      atualizarGeometria(camada);
      setErroMapa("");
    }

    try {
      if (bairro.poligono) {
        const geojson = L.geoJSON({
          type: "Feature",
          properties: { nome: bairro.nome },
          geometry: bairro.poligono,
        });

        const layers = geojson.getLayers();

        if (layers.length === 1) {
          camada = layers[0];
          camadaRef.current = camada;

          aplicarEstilo(camada);
          camada.addTo(map);

          camada.on("pm:edit", aoEditar);
          camada.on("pm:dragend", aoEditar);

          const limites = camada.getBounds?.();

          if (limites?.isValid()) {
            map.fitBounds(limites, {
              padding: [35, 35],
              maxZoom: 16,
            });
          }
        } else if (layers.length > 1) {
          setErroMapa(
            "Este bairro contém vários componentes geográficos. A edição individual de cada componente ainda precisa ser configurada."
          );
        }
      }

      map.on("pm:create", aoCriar);

      if (camada) {
        atualizarGeometria(camada);
      } else {
        callbackRef.current(null);
      }
    } catch (error) {
      console.error("Erro ao carregar o polígono:", error);
      setErroMapa("Não foi possível carregar o polígono deste bairro.");
    }

    return () => {
      map.off("pm:create", aoCriar);
      map.pm?.disableDraw();

      if (camada) {
        camada.off("pm:edit", aoEditar);
        camada.off("pm:dragend", aoEditar);
        camada.pm?.disable();
        camada.pm?.disableLayerDrag();

        if (map.hasLayer(camada)) {
          map.removeLayer(camada);
        }
      }

      camadaRef.current = null;
    };
  }, [
    map,
    bairro.id,
    bairro.poligono,
    bairro.nome,
    atualizarGeometria,
    pararEdicao,
  ]);

  function desenharPoligono() {
    pararEdicao();
    setErroMapa("");

    map.pm.enableDraw("Polygon", {
      snappable: true,
      allowSelfIntersection: false,
      templineStyle: {
        color: "#f5b82e",
      },
      hintlineStyle: {
        color: "#f5b82e",
        dashArray: [5, 5],
      },
      pathOptions: {
        color: "#f5b82e",
        weight: 3,
        fillColor: "#f5b82e",
        fillOpacity: 0.25,
      },
    });

    setModo("desenhar");
  }

  function editarVertices() {
    const camada = camadaRef.current;

    if (!camada?.pm) {
      setErroMapa("Desenhe ou carregue um polígono primeiro.");
      return;
    }

    pararEdicao();
    camada.pm.enable({
      allowSelfIntersection: false,
    });

    setModo("editar");
    setErroMapa("");
  }

  function moverPoligono() {
    const camada = camadaRef.current;

    if (!camada?.pm) {
      setErroMapa("Desenhe ou carregue um polígono primeiro.");
      return;
    }

    pararEdicao();
    camada.pm.enableLayerDrag();

    setModo("mover");
    setErroMapa("");
  }

  function cancelarModo() {
    pararEdicao();
    setErroMapa("");
  }

  function removerDesenho() {
    pararEdicao();

    const camada = camadaRef.current;

    if (camada && map.hasLayer(camada)) {
      map.removeLayer(camada);
    }

    camadaRef.current = null;
    callbackRef.current(null);
    setErroMapa("");
    setModo("selecionar");
  }

  return (
    <div className="absolute inset-0 z-[500] pointer-events-none">
      <div className="pointer-events-auto absolute left-3 top-3 flex max-w-[calc(100%-24px)] flex-wrap gap-2 rounded-xl bg-white p-2 shadow-lg">
        <button
          type="button"
          onClick={desenharPoligono}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            modo === "desenhar"
              ? "bg-amber-500 text-black"
              : "bg-slate-800 text-white"
          }`}
        >
          Desenhar polígono
        </button>

        <button
          type="button"
          onClick={editarVertices}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            modo === "editar"
              ? "bg-amber-500 text-black"
              : "bg-slate-800 text-white"
          }`}
        >
          Editar pontos
        </button>

        <button
          type="button"
          onClick={moverPoligono}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            modo === "mover"
              ? "bg-amber-500 text-black"
              : "bg-slate-800 text-white"
          }`}
        >
          Mover polígono
        </button>

        <button
          type="button"
          onClick={cancelarModo}
          className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-900"
        >
          Concluir edição
        </button>

        <button
          type="button"
          onClick={removerDesenho}
          className="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white"
        >
          Remover desenho
        </button>
      </div>

      {erroMapa && (
        <div
          role="alert"
          className="pointer-events-auto absolute bottom-3 left-3 right-3 rounded-xl bg-red-950 p-3 text-sm text-white"
        >
          {erroMapa}
        </div>
      )}
    </div>
  );
}

export default function AdminBairrosMapa({
  bairros = [],
  onAtualizado,
}) {
  const [bairroId, setBairroId] = useState("");
  const [geometria, setGeometria] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const bairro = bairros.find(
    (item) => item.id === bairroId
  );

  useEffect(() => {
    setGeometria(bairro?.poligono || null);
    setMensagem("");
  }, [bairroId]);

  const receberGeometria = useCallback((geometry) => {
    setGeometria(geometry);
    setMensagem("Alteração pendente de salvamento.");
  }, []);

  async function salvarPoligono() {
    if (!supabase || !bairro) return;

    if (!geometria) {
      setMensagem(
        "Não existe um polígono para salvar. Desenhe um contorno antes de continuar."
      );
      return;
    }

    const area = calcularAreaKm2(geometria);

    if (
      area === null ||
      !Number.isFinite(area) ||
      area <= 0
    ) {
      setMensagem(
        "A geometria não é um polígono válido ou sua área não pôde ser calculada."
      );
      return;
    }

    setSalvando(true);
    setMensagem("");

    try {
      const { data, error } = await supabase
        .from("bairros")
        .update({
          poligono: geometria,
          area_km2: area,
        })
        .eq("id", bairro.id)
        .select("id")
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        throw new Error(
          "Nenhum registro foi atualizado. Verifique a autenticação e as permissões RLS."
        );
      }

      setMensagem(
        `Geometria salva para ${bairro.nome}. Área aproximada: ${area.toLocaleString(
          "pt-BR",
          { maximumFractionDigits: 3 }
        )} km².`
      );

      await onAtualizado?.();
    } catch (error) {
      console.error("Erro ao salvar polígono:", error);
      setMensagem(
        error.message || "Falha ao salvar a geometria."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-white">
      <div>
        <h2 className="text-xl font-bold">
          Editor de polígonos dos bairros
        </h2>

        <p className="mt-2 text-sm text-white/60">
          Selecione o bairro, desenhe os pontos do contorno ou
          ajuste um polígono existente. Depois salve a geometria
          para associá-la ao registro selecionado.
        </p>
      </div>

      <label className="block text-sm font-semibold">
        Bairro selecionado
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
              {item.nome} — {item.regiao}
            </option>
          ))}
        </select>
      </label>

      {bairro && (
        <>
          <div className="relative h-[550px] overflow-hidden rounded-xl border border-white/10">
            <MapContainer
              key={bairro.id}
              center={CENTRO_GOIANIA}
              zoom={12}
              scrollWheelZoom
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <EditorMapa
                key={bairro.id}
                bairro={bairro}
                onGeometriaChange={receberGeometria}
              />
            </MapContainer>
          </div>

          <p className="text-sm text-white/60">
            Para desenhar, clique em cada ponto do limite do
            bairro e finalize o polígono conforme o funcionamento
            do Geoman. Para ajustar um contorno existente, use
            Editar pontos e arraste os vértices.
          </p>

          <button
            type="button"
            onClick={salvarPoligono}
            disabled={salvando || !geometria}
            className="rounded-xl bg-[#f5b82e] px-5 py-3 font-bold text-[#101827] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvando
              ? "Salvando..."
              : "Salvar polígono no bairro"}
          </button>
        </>
      )}

      {mensagem && (
        <p
          role="status"
          className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm"
        >
          {mensagem}
        </p>
      )}
    </section>
  );
}
