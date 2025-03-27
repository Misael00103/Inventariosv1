import { useEffect, useState } from "react";
import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  useProductosStore,
  useMarcaStore,
  useCategoriasStore,
  Selector,
  ListaGenerica,
  Btnfiltro,
  RegistrarMarca,
  RegistrarCategorias,
  Btnsave,
} from "../../../index";
import { useForm } from "react-hook-form";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { Device } from "../../../styles/breakpoints";

export function RegistrarProductos({ onClose, dataSelect, accion }) {
  const { insertarProductos, editarProductos } = useProductosStore();
  const { datamarca, selectMarca, marcaItemSelect } = useMarcaStore();
  const { datacategorias, categoriaItemSelect, selectCategoria } = useCategoriasStore();
  const { dataempresa } = useEmpresaStore();
  const [stateMarca, setStateMarca] = useState(false);
  const [stateCategoria, setStateCategoria] = useState(false);
  const [openRegistroMarca, SetopenRegistroMarca] = useState(false);
  const [openRegistroCategoria, SetopenRegistroCategoria] = useState(false);
  const [subaccion, setAccion] = useState("");

  console.log("Valor de accion recibido:", accion); // Depuración del valor de accion

  function nuevoRegistroMarca() {
    SetopenRegistroMarca(!openRegistroMarca);
    setAccion("Nuevo");
  }
  function nuevoRegistroCategoria() {
    SetopenRegistroCategoria(!openRegistroCategoria);
    setAccion("Nuevo");
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      descripcion: dataSelect?.descripcion || "",
      stock: dataSelect?.stock || "",
      stockminimo: dataSelect?.stock_minimo || "",
      codigobarras: dataSelect?.codigobarras || "",
      codigointerno: dataSelect?.codigointerno || "",
      precioventa: dataSelect?.precioventa || "",
      preciocompra: dataSelect?.preciocompra || "",
    },
  });

  async function insertar(data) {
    try {
      console.log("Accion dentro de insertar:", accion); // Depuración justo antes de la lógica
      if (accion === "Editar") {
        const p = {
          _id: dataSelect.id,
          _descripcion: data.descripcion,
          _idmarca: marcaItemSelect.id,
          _stock: parseFloat(data.stock),
          _stock_minimo: parseFloat(data.stockminimo),
          _codigobarras: data.codigobarras,
          _codigointerno: data.codigointerno,
          _precioventa: parseFloat(data.precioventa),
          _preciocompra: parseFloat(data.preciocompra),
          _id_categoria: categoriaItemSelect.id,
          _id_empresa: dataempresa.id,
        };
        console.log("Editando producto con datos:", p);
        await editarProductos(p); // Llama a editarProductos
      } else {
        const p = {
          _descripcion: data.descripcion,
          _idmarca: marcaItemSelect.id,
          _stock: parseFloat(data.stock),
          _stock_minimo: parseFloat(data.stockminimo),
          _codigobarras: data.codigobarras,
          _codigointerno: data.codigointerno,
          _precioventa: parseFloat(data.precioventa),
          _preciocompra: parseFloat(data.preciocompra),
          _id_categoria: categoriaItemSelect.id,
          _id_empresa: dataempresa.id,
        };
        console.log("Insertando producto con datos:", p);
        await insertarProductos(p); // Llama a insertarProductos
      }
      onClose();
    } catch (error) {
      console.error("Error al guardar el producto:", error.message);
      alert(`Error: ${error.message}`);
    }
  }

  useEffect(() => {
    if (accion === "Editar") {
      selectMarca({ id: dataSelect.idmarca, descripcion: dataSelect.marca });
      selectCategoria({ id: dataSelect.id_categoria, descripcion: dataSelect.categoria });
    }
  }, [accion, dataSelect]);

  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>
              {accion === "Editar" ? "Editar producto" : "Registrar nuevo producto"}
            </h1>
          </section>
          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>
        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          <section className="seccion1">
            <article>
              <InputText icono={<v.icononombre />}>
                <input
                  className="form__field"
                  type="text"
                  placeholder=""
                  {...register("descripcion", { required: true })}
                />
                <label className="form__label">Nombre</label>
                {errors.descripcion?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <ContainerSelector>
              <label>Marca: </label>
              <Selector
                state={stateMarca}
                color="#5c67c0"
                texto1="🍿"
                texto2={marcaItemSelect?.descripcion}
                funcion={() => setStateMarca(!stateMarca)}
              />
              <Btnfiltro
                funcion={nuevoRegistroMarca}
                bgcolor="#f6f3f3"
                textcolor="#353535"
                icono={<v.agregar />}
              />
              {stateMarca && (
                <ListaGenerica
                  bottom="-260px"
                  scroll="scroll"
                  setState={() => setStateMarca(!stateMarca)}
                  data={datamarca}
                  funcion={selectMarca}
                />
              )}
            </ContainerSelector>
            <article>
              <InputText icono={<v.iconostock />}>
                <input
                  step="0.01"
                  className="form__field"
                  type="number"
                  placeholder=""
                  {...register("stock", { required: true })}
                />
                <label className="form__label">Stock</label>
                {errors.stock?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <InputText icono={<v.iconostockminimo />}>
                <input
                  step="0.01"
                  className="form__field"
                  type="number"
                  placeholder=""
                  {...register("stockminimo", { required: true })}
                />
                <label className="form__label">Stock mínimo</label>
                {errors.stockminimo?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <ContainerSelector>
              <label>Categoría: </label>
              <Selector
                state={stateCategoria}
                color="#5c67c0"
                texto1="🍿"
                texto2={categoriaItemSelect?.descripcion}
                funcion={() => setStateCategoria(!stateCategoria)}
              />
              <Btnfiltro
                funcion={nuevoRegistroCategoria}
                bgcolor="#f6f3f3"
                textcolor="#353535"
                icono={<v.agregar />}
              />
              {stateCategoria && (
                <ListaGenerica
                  bottom="50px"
                  scroll="scroll"
                  setState={() => setStateCategoria(!stateCategoria)}
                  data={datacategorias}
                  funcion={selectCategoria}
                />
              )}
            </ContainerSelector>
          </section>
          <section className="seccion2">
            <article>
              <InputText icono={<v.iconocodigobarras />}>
                <input
                  className="form__field"
                  type="text"
                  placeholder=""
                  {...register("codigobarras", { required: true })}
                />
                <label className="form__label">Código de barras</label>
                {errors.codigobarras?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <InputText icono={<v.iconocodigointerno />}>
                <input
                  className="form__field"
                  type="text"
                  placeholder=""
                  {...register("codigointerno", { required: true })}
                />
                <label className="form__label">Código interno</label>
                {errors.codigointerno?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <InputText icono={<v.iconoprecioventa />}>
                <input
                  step="0.01"
                  className="form__field"
                  type="number"
                  placeholder=""
                  {...register("precioventa", { required: true })}
                />
                <label className="form__label">Precio de venta</label>
                {errors.precioventa?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <InputText icono={<v.iconopreciocompra />}>
                <input
                  step="0.01"
                  className="form__field"
                  type="number"
                  placeholder=""
                  {...register("preciocompra", { required: true })}
                />
                <label className="form__label">Precio de compra</label>
                {errors.preciocompra?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
          </section>
          <div className="btnguardarContent">
            <Btnsave
              icono={<v.iconoguardar />}
              titulo="Guardar"
              bgcolor="#5c67c0"
            />
          </div>
        </form>
        {openRegistroMarca && (
          <RegistrarMarca
            dataSelect={dataSelect}
            onClose={() => SetopenRegistroMarca(!openRegistroMarca)}
            accion={subaccion}
          />
        )}
        {openRegistroCategoria && (
          <RegistrarCategorias
            dataSelect={dataSelect}
            onClose={() => SetopenRegistroCategoria(!openRegistroCategoria)}
            accion={subaccion}
          />
        )}
      </div>
    </Container>
  );
}

// Estilos (sin cambios)
const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    overflow-y: auto;
    overflow-x: hidden;
    height: 90vh;
    &::-webkit-scrollbar {
      width: 6px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #484848;
      border-radius: 10px;
    }
    width: 100%;
    max-width: 90%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 20px;
        font-weight: 500;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
      @media ${Device.tablet} {
        grid-template-columns: repeat(2, 1fr);
      }
      section {
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
      .btnguardarContent {
        display: flex;
        justify-content: end;
        grid-column: 1;
        @media ${Device.tablet} {
          grid-column: 2;
        }
      }
    }
  }
`;

const ContainerSelector = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  position: relative;
`;