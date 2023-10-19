<template>
    <div class="container">
        <div>
            <h1>Test Database Page</h1>
            <p>
                This page is used to test the database connection.
            </p>
        </div>
        <div class="form-group">
            <div class="input-group my-3">
                <input type="text" class="form-control" v-model="input_user_username" placeholder="Input username" />
            </div>
            <div class="input-group my-3">
                <input type="email" class="form-control" v-model="input_user_email" placeholder="Input e-mail" />
            </div>
            <div class="input-group my-3">
                <input type="password" class="form-control" v-model="input_user_password" placeholder="Input password" />
            </div>
            <div class="input-group my-3">
                <button type="button" class="btn btn-primary" @click="save_user_to_db" >Create user</button>
            </div>
        </div>
        <table class="table" style="border: 1px;">
            <thead>
                <tr>
                    <th scope="col">Username</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Password</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.password }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import axios from 'axios';

import { ref } from 'vue'


const input_user_username = ref('');
const input_user_email = ref('');
const input_user_password = ref('');
const users = ref([]);

function save_user_to_db() {
    axios.post('http://localhost:3000/add_user', null, {params  : { 
        username: input_user_username.value,
        email: input_user_email.value,
        password: input_user_password.value
    }})
    .then(response => {
        get_users_data();
    });
}

function get_users_data() {
    axios.get('http://localhost:3000/get_users')
        .then(response => {
            console.log(response)
            users.value = response.data
        });
}

get_users_data();

    


</script>
