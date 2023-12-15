<template>
    <div class="container">
        <div>
            <h1>Categories</h1>
        </div>

        <button type="button" class="btn btn-primary" @click="show_add_category_modal = !show_add_category_modal" >Add category +</button>

        <Modal name="m1" v-model:visible="show_add_category_modal" :maskClosable="false" :closable="false" :cancelButton="{text: 'cancel', onclick: () => {show_add_category_modal = !show_add_category_modal}, loading: false}" :okButton="{text: 'Add category +', onclick: () => {add_category();}, loading: false}">
            <div>
                <div class="form-group">
                    <div class="input-group my-3">
                        <input type="text" class="form-control" v-model="category_name" placeholder="Input name" />
                    </div>
                </div>

            </div>
        </Modal>  

        <div class="container">
            <div class="row">
                <div class="col">
                    <table class="table" style="border: 1px;">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="category in categories" :key="category.id">
                                <td>{{ category.name }}</td>

                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>
        </div>

    </div>
</template>

<script setup>
import axios from 'axios';

import { Modal } from 'usemodal-vue3';

import { ref } from 'vue'


import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

const category_name = ref('');

const categories = ref([]);
const show_add_category_modal = ref(false);





function add_category() {
    show_add_category_modal.value = !show_add_category_modal.value;
    save_category_to_db();
}

function save_category_to_db() {
    axios.post('http://localhost:3000/add_category', null, {params  : { 
        name: category_name.value,
    }})
    .then(response => {
        get_categories_data();
    });
}

function get_categories_data() {

    axios.get('http://localhost:3000/get_categories')
        .then(response => {
            console.log(response)
            categories.value = response.data
        });

}





get_categories_data();

</script>
