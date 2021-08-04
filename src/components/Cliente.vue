<template>
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
      <tr v-for="(item, index) in Clientes" :key="index">
        <th scope="row">{{item.sk}}</th>
        <td>{{item.nombreCliente}}</td>
        <td>{{item.apellidos}}</td>
        <td>{{item.email}}</td>
        <td>
          <button class="btn-warning btn-sm mx-2" @click="activarEdicion(item.sk)">Actualizar</button>
          <button class="btn-danger btn-sm mx-2" @click="eliminarCliente(item.sk)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
  <form @submit.prevent="agregarCliente(Cliente)" v-if="agregar">
    <h3 class="text-center">Agregar nueva Cliente</h3>
    <input type="text" placeholder="Ingrese un Nombre" class="form-control my-2" v-model="Cliente.nombreCliente">
    <input type="text" placeholder="Ingrese una apellidos" class="form-control my-2" v-model="Cliente.apellidos">
    <button class="btn-sm btn-block btn-success" type="submit">Agregar</button>
  </form>
  <form @submit.prevent="editarCliente(ClienteEditar)" v-else>
    <h3 class="text-center">Editar Cliente</h3>
    <input type="text" placeholder="Ingrese un Nombre" class="form-control my-2" v-model="ClienteEditar.nombreCliente">
    <input type="text" placeholder="Ingrese una apellidos" 
    class="form-control my-2" v-model="ClienteEditar.apellidos">
    <button class="btn-sm btn-block m1 btn-warning" type="submit">Editar</button>
    <button class="btn-sm btn-block" @click="agregar = true">Cancelar</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      Clientes: [],
      Cliente: {},
      agregar: true,
    };
  },
  created(){
    this.listarClientes();
  },
  methods:{
    listarClientes(){
      this.axios.get('cliente/getAll')
      .then((response) => {
        // console.log(response.data)
        this.Clientes = response.data;
      })
      .catch((e)=>{
        console.log('error' + e);
      })
    },
    agregarCliente(item){
      this.axios.post('cliente/createCliente', item)
        .then(res => {
          // Agrega al inicio de nuestro array Clientes
          this.Clientes.unshift(res.data);

          // Alerta de mensaje
          this.showAlert();
          this.mensaje.texto = 'Clientes Agregada!'
          this.mensaje.color = 'success';
        })
        .catch( e => {
          console.log(e.response.data.error.errors.nombre.message);

          // Alerta de mensaje
          this.showAlert();
          this.mensaje.color = 'danger';
          this.mensaje.texto = e.response.data.error.errors.nombre.message;
        })
      this.Clientes = {}
    },
    eliminarCliente(id){
    this.axios.delete(`cliente/deleteCliente/${id}`)
      .then(res => {
        let index = this.Clientes.findIndex( item => item.sk === res.data.sk )
        this.Clientes.splice(index, 1);

        this.showAlert();
        this.mensaje.texto = 'Clientes Eliminada!'
        this.mensaje.color = 'danger'
      })
      .catch( e => {
        console.log(e.response);
      })
    },
    activarEdicion(id){
    this.agregar = false;
    this.axios.get(`cliente/getCliente/?sk=${id}`)
      .then(res => {
        this.ClienteEditar = res.data;
      })
      .catch(e => {
        console.log(e.response);
      })
    },
    editarCliente(item){
      this.axios.put(`cliente/updateCliente/${item.sk}`, item)
        .then(() => {
          let index = this.Clientes.findIndex( itemCliente => itemCliente.sk === this.ClienteEditar.sk);
          this.Clientes[index].nombreCliente = this.ClienteEditar.nombreCliente;
          this.Clientes[index].apellidos = this.ClienteEditar.apellidos;
          this.ClienteEditar = {}

          this.showAlert();
          this.mensaje.texto = 'Cliente Actualizada'
          this.mensaje.color = 'success'
        })
        .catch(e => {
          console.log(e);
        })
      this.agregar = true;
    },
  }
};
</script>
