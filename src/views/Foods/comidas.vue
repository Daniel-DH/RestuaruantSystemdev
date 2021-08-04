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
        <th scope="col">Contenido</th>
        <th scope="col">Peso</th>
        <th scope="col">Precio</th>
        <th scope="col">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in Comidas" :key="index">
        <th scope="row">{{item.sk}}</th>
        <td>{{item.nombreComida}}</td>
        <td>{{item.contenido}}</td>
        <td>{{item.peso}}</td>
        <td>{{item.precio}} </td>
        <td>
          <button class="btn-warning btn-sm mx-2" @click="activarEdicion(item.sk,item.nombreComida)">Actualizar</button>
          <button class="btn-danger btn-sm mx-2" @click="eliminarComida(item.sk)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
  <form @submit.prevent="agregarComida(Comida)" v-if="agregar">
    <h3 class="text-center">Agregar nueva Comida</h3>
    <input type="text" placeholder="Ingrese un Nombre" class="form-control my-2" v-model="Comida.nombreComida">
    <input type="text" placeholder="Ingrese una contenido" class="form-control my-2" v-model="Comida.contenido">
    <input type="text" placeholder="Ingrese una peso" class="form-control my-2" v-model="Comida.peso">
    <input type="text" placeholder="Ingrese una precio" class="form-control my-2" v-model="Comida.precio">
    <button class="btn-sm btn-block btn-success" type="submit">Agregar</button>
  </form>
  <form @submit.prevent="editarComida(ComidaEditar)" v-else>
    <h3 class="text-center">Editar Comida</h3>
    <input type="text" placeholder="Ingrese un Nombre" class="form-control my-2" v-model="ComidaEditar.nombreComida">
    <input type="text" placeholder="Ingrese una contenido" class="form-control my-2" v-model="ComidaEditar.contenido">
    <input type="text" placeholder="Ingrese una peso" class="form-control my-2" v-model="ComidaEditar.peso">
    <input type="text" placeholder="Ingrese una precio" class="form-control my-2" v-model="ComidaEditar.precio">
    <button class="btn-sm btn-block m1 btn-warning" type="submit">Editar</button>
    <button class="btn-sm btn-block" @click="agregar = true">Cancelar</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      Comidas: [],
      Comida: {},
      ComidaEditar: {},
      agregar: true,
      mensaje: {color: 'success', texto: ''},
      dissmiss: false
    };
  },
  created(){
    this.listarComida();
  },
  methods:{
    listarComida(){
      this.axios.get('comida/getAll')
      .then((response) => {
        // console.log(response.data)
        this.Comidas = response.data;
      })
      .catch((e)=>{
        console.log('error' + e);
      })
    },
    agregarComida(item){
      this.axios.post('comida/createComida', item)
        .then(res => {
          // Agrega al inicio de nuestro array Comida
          this.Comidas.unshift(res.data);

          // Alerta de mensaje
          this.showAlert();
          this.mensaje.texto = 'Comida Agregada!'
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
    eliminarComida(id){
    this.axios.delete(`comida/deleteComida/${id}`)
      .then(() => {
        let index = this.Comidas.findIndex( item => item.sk === id )
        this.Comidas.splice(index, 1);

        this.showAlert();
        this.mensaje.texto = 'Comida Eliminada!'
        this.mensaje.color = 'danger'
      })
      .catch( e => {
        console.log(e);
      })
    },
    activarEdicion(id,name){
    this.agregar = false;
    this.axios.get(`comida/getComida/${id}/${name}`)
      .then(res => {
        this.ComidaEditar = res.data;
      })
      .catch(e => {
        console.log(e);
      })
    },
    editarComida(item){
      this.axios.put(`comida/updateComida/${item.sk}`, item)
        .then(() => {
          let index = this.Comidas.findIndex( itemComida => itemComida.sk === this.ComidaEditar.sk);
          this.Comidas[index].nombreComida = this.ComidaEditar.nombreComida;
          this.Comidas[index].contenido = this.ComidaEditar.contenido;
          this.Comidas[index].peso = this.ComidaEditar.peso;
          this.Comidas[index].precio = this.ComidaEditar.precio;
          this.ComidaEditar = {}

          this.showAlert();
          this.mensaje.texto = 'Comida Actualizada'
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
