import styled from "styled-components";
import {
  Header,
  Btnfiltro,
  v,
  RegistrarProductos,
  useProductosStore,
  TablaProductos,
  Title,
  Lottieanimacion,
  Buscador,
} from "../../index";
import { useState } from "react";
import vacio from "../../assets/vacio.json";

export function ProductosTemplate({ data }) {
  const { setBuscador } = useProductosStore();
  const [state, setState] = useState(false);
  const [openRegistro, setOpenRegistro] = useState(false); // Renombrado a camelCase
  const [accion, setAccion] = useState(""); // Estado inicial vacío
  const [dataSelect, setDataSelect] = useState([]); // Renombrado a camelCase

  function nuevoRegistro() {
    setOpenRegistro(true); // Solo abre el formulario
    setAccion("Nuevo"); // Establece "Nuevo" solo para nuevos registros
    setDataSelect([]); // Limpia la selección
    console.log("Abriendo formulario para nuevo registro, accion:", "Nuevo"); // Depuración
  }

  return (
    <Container>
      {openRegistro && (
        <RegistrarProductos
          dataSelect={dataSelect}
          onClose={() => setOpenRegistro(false)} // Cierra el formulario
          accion={accion}
        />
      )}
      <header className="header">
        <Header
          stateConfig={{ state: state, setState: () => setState(!state) }}
        />
      </header>
      <section className="area1">
        <ContentFiltro>
          <Title>Productos</Title>
          <Btnfiltro
            funcion={nuevoRegistro}
            bgcolor="#f6f3f3"
            textcolor="#353535"
            icono={<v.agregar />}
          />
        </ContentFiltro>
      </section>
      <section className="area2">
        <Buscador setBuscador={setBuscador} />
      </section>
      <section className="main">
        {data?.length === 0 && (
          <Lottieanimacion alto="300" ancho="300" animacion={vacio} />
        )}
        <TablaProductos
          data={data}
          SetopenRegistro={setOpenRegistro} // Setter para abrir el formulario
          setdataSelect={setDataSelect} // Setter para seleccionar datos
          setAccion={setAccion} // Setter para la acción
          isOpen={openRegistro} // Estado del formulario
        />
      </section>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  padding: 15px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "area1" 100px
    "area2" 60px
    "main" auto;

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }
  .area1 {
    grid-area: area1;
    display: flex;
    align-items: center;
  }
  .area2 {
    grid-area: area2;
    display: flex;
    align-items: center;
    justify-content: end;
  }
  .main {
    grid-area: main;
  }
`;

const ContentFiltro = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  width: 100%;
  gap: 15px;
`;