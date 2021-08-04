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
        <th scope="col">Descripción</th>
        <th scope="col">Fecha</th>
        <th scope="col">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in Ordenes" :key="index">
        <th scope="row">{{item.sk}}</th>
        <td>{{item.nombreOrden}}</td>
        <td>{{item.precioTotal}}</td>
        <td>
          <button class="btn-warning btn-sm mx-2" @click="activarEdicion(item.sk,item.nombreOrden)">Actualizar</button>
          <button class="btn-danger btn-sm mx-2" @click="eliminarOrden(item.sk)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
  <form @submit.prevent="agregarOrden(Orden)" v-if="agregar">
    <h3 class="text-center">Agregar nueva Orden</h3>
    <input type="text" placeholder="Ingrese un Nombre" class="form-control my-2" v-model="Orden.nombreOrden">
    <input type="text" placeholder="Ingrese una precioTotal" class="form-control my-2" v-model="Orden.precioTotal">
    <button class="btn-sm btn-block btn-success" type="submit">Agregar</button>
  </form>
  <form @submit.prevent="editarOrden(OrdenEditar)" v-else>
    <h3 class="text-center">Editar Orden</h3>
    <input type="text" placeholder="Ingrese un Nombre" class="form-control my-2" v-model="OrdenEditar.nombreOrden">
    <input type="text" placeholder="Ingrese una precioTotal" class="form-control my-2" v-model="OrdenEditar.precioTotal">
    <button class="btn-sm btn-block m1 btn-warning" type="submit">Editar</button>
    <button class="btn-sm btn-block" @click="agregar = true">Cancelar</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      Ordenes: [],
      Orden: {},
      OrdenEditar: {},
      agregar: true,
      mensaje: {color: 'success', texto: ''},
      dissmiss: false
    };
  },
  created(){
    this.listarOrdenes();
  },
  methods:{
    listarOrdenes(){
      this.axios.get('Orden/getAll')
      .then((response) => {
        // console.log(response.data)
        this.Ordenes = response.data;
      })
      .catch((e)=>{
        console.log('error' + e);
      })
    },
    agregarOrden(item){
      this.axios.post('Orden/createOrden', item)
        .then(res => {
          // Agrega al inicio de nuestro array Ordenes
          this.Ordenes.unshift(res.data);

          // Alerta de mensaje
          this.showAlert();
          this.mensaje.texto = 'Ordenes Agregada!'
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
    eliminarOrden(id){
    this.axios.delete(`Orden/deleteOrden/${id}`)
      .then(() => {
        let index = this.Ordenes.findIndex( item => item.sk === id )
        this.Ordenes.splice(index, 1);

        this.showAlert();
        this.mensaje.texto = 'Ordenes Eliminada!'
        this.mensaje.color = 'danger'
      })
      .catch( e => {
        console.log(e);
      })
    },
    activarEdicion(id,name){
    this.agregar = false;
    this.axios.get(`Orden/getOrden/${id}/${name}`)
      .then(res => {
        this.OrdenEditar = res.data;
      })
      .catch(e => {
        console.log(e);
      })
    },
    editarOrden(item){
      this.axios.put(`Orden/updateOrden/${item.sk}`, item)
        .then(() => {
          let index = this.Ordenes.findIndex( itemOrden => itemOrden.sk === this.OrdenEditar.sk);
          this.Ordenes[index].nombreOrden = this.OrdenEditar.nombreOrden;
          this.Ordenes[index].precioTotal = this.OrdenEditar.precioTotal;
          this.OrdenEditar = {}

          this.showAlert();
          this.mensaje.texto = 'Orden Actualizada'
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
