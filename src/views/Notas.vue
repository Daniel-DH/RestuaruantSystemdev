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
    <tr v-for="(item, index) in notas" :key="index">
      <th scope="row">{{item.sk}}</th>
      <td>{{item.nombreRestaurante}}</td>
      <td>{{item.contactoRestaurante}}</td>
      <td>{{item.telefono}}</td>
      <td>
        <b-button class="btn-warning btn-sm mx-2" @click="activarEdicion(item.sk)">Actualizar</b-button>
        <b-button class="btn-danger btn-sm mx-2" @click="eliminarNota(item.sk)">Eliminar</b-button>
      </td>
    </tr>
  </tbody>
</table>
</template>

<script>
export default {
  data() {
    return {
      notas: [],
    };
  },
  created(){
    this.listarNotas();
  },
  methods:{
    listarNotas(){
      this.axios.get('restaurante/getAll')
      .then((response) => {
        // console.log(response.data)
        this.notas = response.data;
      })
      .catch((e)=>{
        console.log('error' + e);
      })
    }
  }
};
</script>
