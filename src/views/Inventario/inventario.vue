<template>
  <div :class="'alert alert-'+mensaje.color+' alert-dismissible fade show'" role="alert" v-if="dissmiss">
    {{mensaje.texto}}
    <button type="button" class="btn-close" aria-label="Close" @click="dissAlert"></button>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nombre</th>
        <th scope="col">Precio</th>
        <th scope="col">Cantidad</th>
        <th scope="col">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in Inventarios" :key="index">
        <th scope="row">{{item.sk}}</th>
        <td>{{item.nombreInventario}}</td>
        <td>{{item.precio}}</td>
        <td>{{item.cantidad}}</td>
        <td>
          <button class="btn-warning btn-sm mx-2" @click="activarEdicion(item.sk,item.nombreInventario)">Actualizar</button>
          <button class="btn-danger btn-sm mx-2" @click="eliminarInventario(item.sk)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
  <form @submit.prevent="agregarInventario(Inventario)" v-if="agregar">
    <h3 class="text-center">Agregar nueva Inventario</h3>
    <input type="text" placeholder="Ingrese un Nombre" class="form-control my-2" v-model="Inventario.nombreInventario">
    <input type="text" placeholder="Ingrese una precio" class="form-control my-2" v-model="Inventario.precio">
    <input type="text" placeholder="Ingrese una cantidad" class="form-control my-2" v-model="Inventario.cantidad">
    <button class="btn-sm btn-block btn-success" type="submit">Agregar</button>
  </form>
  <form @submit.prevent="editarInventario(InventarioEditar)" v-else>
    <h3 class="text-center">Editar Inventario</h3>
    <input type="text" placeholder="Ingrese un Nombre" class="form-control my-2" v-model="InventarioEditar.nombreInventario">
    <input type="text" placeholder="Ingrese una precio" class="form-control my-2" v-model="InventarioEditar.precio">
    <input type="text" placeholder="Ingrese una cantidad" class="form-control my-2" v-model="InventarioEditar.cantidad">
    <button class="btn-sm btn-block m1 btn-warning" type="submit">Editar</button>
    <button class="btn-sm btn-block" @click="agregar = true">Cancelar</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      Inventarios: [],
      Inventario: {},
      InventarioEditar: {},
      agregar: true,
      mensaje: {color: 'success', texto: ''},
      dissmiss: false
    };
  },
  created(){
    this.listarInventarios();
  },
  methods:{
    listarInventarios(){
      this.axios.get('inventario/getAll')
      .then((response) => {
        // console.log(response.data)
        this.Inventarios = response.data;
      })
      .catch((e)=>{
        console.log('error' + e);
      })
    },
    agregarInventario(item){
      this.axios.post('inventario/createInventario', item)
        .then(res => {
          // Agrega al inicio de nuestro array Inventarios
          this.Inventarios.unshift(res.data);

          // Alerta de mensaje
          this.showAlert();
          this.mensaje.texto = 'Inventarios Agregada!'
          this.mensaje.color = 'success';
        })
        .catch( e => {
          console.log(e);

          // Alerta de mensaje
          this.showAlert();
          this.mensaje.color = 'danger';
          this.mensaje.texto = e.response;
        });
    },
    eliminarInventario(id){
    this.axios.delete(`inventario/deleteInventario/${id}`)
      .then(() => {
        let index = this.Inventarios.findIndex( item => item.sk === id )
        this.Inventarios.splice(index, 1);

        this.showAlert();
        this.mensaje.texto = 'Inventarios Eliminada!'
        this.mensaje.color = 'danger'
      })
      .catch( e => {
        console.log(e);
      })
    },
    activarEdicion(id,name){
    this.agregar = false;
    this.axios.get(`inventario/getInventario/${id}/${name}`)
      .then(res => {
        this.InventarioEditar = res.data;
      })
      .catch(e => {
        console.log(e);
      })
    },
    editarInventario(item){
      this.axios.put(`inventario/updateInventario/${item.sk}`, item)
        .then(() => {
          let index = this.Inventarios.findIndex( itemInventario => itemInventario.sk === this.InventarioEditar.sk);
          this.Inventarios[index].nombreInventario = this.InventarioEditar.nombreInventario;
          this.Inventarios[index].precio = this.InventarioEditar.precio;
          this.Inventarios[index].cantidad = this.InventarioEditar.cantidad;
          this.InventarioEditar = {}

          this.showAlert();
          this.mensaje.texto = 'Inventario Actualizada'
          this.mensaje.color = 'success'
        })
        .catch(e => {
          console.log(e);
        })
      this.agregar = true;
    },
    dissAlert() {
      this.dissmiss = false 
    },
    showAlert() {
      this.dissmiss = true 
    }
  }
};
</script>
