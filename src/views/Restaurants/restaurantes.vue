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
        <th scope="col">Telefono</th>
        <th scope="col">contactoRestaurante</th>
        <th scope="col">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in Restaurantes" :key="index">
        <th scope="row">{{item.sk}}</th>
        <td>{{item.nombreRestaurante}}</td>
        <td>{{item.telefono}}</td>
        <td>{{item.contactoRestaurante}}</td>
        <td>
          <button class="btn-warning btn-sm mx-2" @click="activarEdicion(item.sk,item.nombreRestaurante)">Actualizar</button>
          <button class="btn-danger btn-sm mx-2" @click="eliminarRestaurante(item.sk)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
  <form @submit.prevent="agregarRestaurante(Restaurante)" v-if="agregar">
    <h3 class="text-center">Agregar nueva Restaurante</h3>
    <input type="text" placeholder="Ingrese un Nombre" class="form-control my-2" v-model="Restaurante.nombreRestaurante">
    <input type="text" placeholder="Ingrese una telefono" class="form-control my-2" v-model="Restaurante.telefono">
    <input type="text" placeholder="Ingrese una contactoRestaurante" class="form-control my-2" v-model="Restaurante.contactoRestaurante">
    <button class="btn-sm btn-block btn-success" type="submit">Agregar</button>
  </form>
  <form @submit.prevent="editarRestaurante(RestauranteEditar)" v-else>
    <h3 class="text-center">Editar Restaurante</h3>
    <input type="text" placeholder="Ingrese un Nombre" class="form-control my-2" v-model="RestauranteEditar.nombreRestaurante">
    <input type="text" placeholder="Ingrese una telefono" class="form-control my-2" v-model="RestauranteEditar.telefono">
    <input type="text" placeholder="Ingrese una contactoRestaurante" class="form-control my-2" v-model="RestauranteEditar.contactoRestaurante">
    <button class="btn-sm btn-block m1 btn-warning" type="submit">Editar</button>
    <button class="btn-sm btn-block" @click="agregar = true">Cancelar</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      Restaurantes: [],
      Restaurante: {},
      RestauranteEditar: {},
      agregar: true,
      mensaje: {color: 'success', texto: ''},
      dissmiss: false
    };
  },
  created(){
    this.listarRestaurantes();
  },
  methods:{
    listarRestaurantes(){
      this.axios.get('restaurante/getAll')
      .then((response) => {
        // console.log(response.data)
        this.Restaurantes = response.data;
      })
      .catch((e)=>{
        console.log('error' + e);
      })
    },
    agregarRestaurante(item){
      this.axios.post('restaurante/createRestaurante', item)
        .then(res => {
          // Agrega al inicio de nuestro array Restaurantes
          this.Restaurantes.unshift(res.data);

          // Alerta de mensaje
          this.showAlert();
          this.mensaje.texto = 'Restaurantes Agregada!'
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
    eliminarRestaurante(id){
    this.axios.delete(`restaurante/deleteRestaurante/${id}`)
      .then(() => {
        let index = this.Restaurantes.findIndex( item => item.sk === id )
        this.Restaurantes.splice(index, 1);

        this.showAlert();
        this.mensaje.texto = 'Restaurantes Eliminada!'
        this.mensaje.color = 'danger'
      })
      .catch( e => {
        console.log(e);
      })
    },
    activarEdicion(id,name){
    this.agregar = false;
    this.axios.get(`restaurante/getRestaurante/${id}/${name}`)
      .then(res => {
        this.RestauranteEditar = res.data;
      })
      .catch(e => {
        console.log(e);
      })
    },
    editarRestaurante(item){
      this.axios.put(`restaurante/updateRestaurante/${item.sk}`, item)
        .then(() => {
          let index = this.Restaurantes.findIndex( itemRestaurante => itemRestaurante.sk === this.RestauranteEditar.sk);
          this.Restaurantes[index].nombreRestaurante = this.RestauranteEditar.nombreRestaurante;
          this.Restaurantes[index].telefono = this.RestauranteEditar.telefono;
          this.Restaurantes[index].contactoRestaurante = this.RestauranteEditar.contactoRestaurante;
          this.RestauranteEditar = {}

          this.showAlert();
          this.mensaje.texto = 'Restaurante Actualizada'
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
