<template>
<div class="container">
    <div class="row">
        <div class="col-8">
            {{ObjName}}
        </div>
        <div class="col-4">
          <button class="btn btn-primary">Crear</button>
        </div>
    </div>
    <table class="table">
    <thead>
    <tr>
      <th v-for="(Keys, index) in ObjKeys" :key="index">
        {{Keys}}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in Obj" :key="index">
      <th scope="row">{{item.sk}}</th>
      <td>{{item.nombreRestaurante}}</td>
      <td>{{item.contactoRestaurante}}</td>
      <td>{{item.telefono}}</td>
      <td>
        <b-button class="btn-warning btn-sm mx-2" @click="activarEdicion(item.sk)">Editar</b-button>
        <b-button class="btn-danger btn-sm mx-2" @click="eliminarNota(item.sk)">Eliminar</b-button>
      </td>
    </tr>
  </tbody>
</table>
</div>
</template>

<script>
export default {
  props: {
    ObjName: String,
    ObjKeys: []
  },
  data() {
    return {
      Obj: [],
    };
  },
  created(){
    this.listarObj();
  },
  methods:{
    listarObj(){
      this.axios.get(this.ObjName+'/getAll')
      .then((response) => {
        // console.log(response.data)
        this.Obj = response.data;
      })
      .catch((e)=>{
        console.log('error' + e);
      })
    }
  }
};
</script>
