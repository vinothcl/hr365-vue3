<script setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { ref, inject } from 'vue';
import { Grid } from '@progress/kendo-vue-grid';
import { Filter, Operators } from "@progress/kendo-vue-data-tools";
import { filterBy } from "@progress/kendo-data-query";
import '@progress/kendo-theme-default/dist/all.css';
let user = ref({});

// sweetalert injection
const swal = inject('$swal');

//vee-validate by yup
const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    age: Yup.number().required().positive().integer('Please enter valid age'),
    email: Yup.string().required('Email is required').email('Please enter valid email')
});

const showForm = ref(false);
const editId = ref(null);
const onDataBound = ref([
        { id: 1, name: "John Doe", age: 28, email: "JohnDoe@test.com" },
        { id: 2, name: "Jane Smith", age: 32, email: "JaneSmith@test.com" },
        { id: 3, name: "Michael Johnson", age: 45, email: "MichaelJohnson@test.com" },
      ]);
const columns = [
            { field: 'id', title: 'ID' },
            { field: 'name', title: 'Name' },
            { field: 'age', title: 'Age' },
            { field: 'email', title: 'Email' },
            {
              title: 'Actions',
              cell: (h, td, props) =>
                h('td', { style: { textAlign: 'center' } }, [
                  h(
                    'button',
                    {
                      class: 'btn btn-sm btn-primary',
                      style: 'margin-right: 5px;',
                      onClick: () => editHandler(props.dataItem)
                    },
                    'Edit'
                  ),
                  h(
                    'button',
                    {
                      class: 'btn btn-sm btn-danger',
                      onClick: () => deleteHandler(props.dataItem)
                    },
                    'Delete'
                  )
                ])
            }
        ];

const deleteHandler = (row) => {
      swal.fire({
          title: 'Are you sure?',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
          if (result.value) {
              onDataBound.value.map((onDataBoundLoopVal, index) => {  
                if(onDataBoundLoopVal.id === row.id) {
                  onDataBound.value.splice(index, 1);
                }
              })
              onDataBound.value.map((onDataBoundLoopVal, index) => {  
                onDataBound.value[index].id = index + 1;
              })
              swal.fire({
                title: "Great!",
                text: "User Deleted Successfully",
                icon: "success"
              });
          } else {
            
            console.log('Cancelled');
          }
      });
    }
const editHandler = (row) => {
    editId.value = row.id;
    user.value = row;
    showForm.value = true;
}
const filter = ref({
        logic: "and",
        filters: [
          { field: "name", operator: "contains", value: "" },
          { field: "age", operator: "contains", value: "" },
          { field: "email", operator: "contains", value: "" },
        ],
      });
const fields = [
        {
          name: "id",
          label: "ID",
          filter: "text",
          operators: Operators.text,
        },
        {
          name: "name",
          label: "Name",
          filter: "text",
          operators: Operators.text,
        },
        {
          name: "age",
          label: "age",
          filter: "text",
          operators: Operators.numeric,
        },
        {
          name: "email",
          label: "Email",
          filter: "text",
          operators: Operators.text,
        },
      ];
const defaultGroupFilter = ref({
        logic: "and",
        filters: [],
      });
const onDataBoundRefValue = ref(onDataBound.value);
const onFilterChange = (event) => {
      if (event.filter !== null) {
        filter.value = event.filter;
        onDataBoundRefValue.value = filterBy(onDataBound.value, filter.value);
      } else {
        filter.value = defaultGroupFilter;
        onDataBoundRefValue.value = filterBy(onDataBound.value, []);
      }      
    };
const addNew = () => {
      editId.value = null;
      user.value = null;
      //formData.value = { id: null, name: '', age: '', email: '' }; // Reset form data
      showForm.value = true; // Show the form modal
    }
async function saveData(values) {
    if(editId.value == null) {
      values['id'] = onDataBound.value.length + 1;
      onDataBound.value.push({ ...values });
      swal.fire({
        title: "Great!",
        text: "User Added Successfully",
        icon: "success"
      });
    } else {
      onDataBound.value.map((onDataBoundLoopVal, index) => {  
        if(onDataBoundLoopVal.id === editId.value) {
          onDataBound.value[index] = values;
        }
      })
      swal.fire({
        title: "Great!",
        text: "User Updated Successfully",
        icon: "success"
      });
      //onDataBound.value[editId.value] = values;  
    }
    showForm.value = false; // Close the form modal after saving
}
</script>

<template>
  <div>
    <div class="container">
      <h3>Vue.js 2 to vue.js 3 Migration</h3><br>
    <!-- Modal for Edit and Add -->
    <transition name="modal" v-if="showForm">
      <div class="modal" style="display: block">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document" style="width: 600px">
          <div class="modal-content" style="text-align: center">
            <div class="modal-body" style="padding: 40px">
              <Form @submit="saveData" :validation-schema="schema" :initial-values="user"  v-slot="{ errors, isSubmitting, values }">
                <div class="form-group row mb-3">
                  <label for="name" class="col-sm-2 col-form-label">Name</label>
                  <div class="col-sm-10">
                    <Field name="name" id="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" />
                      <div class="invalid-feedback">{{ errors.name }}</div>
                  </div>
                </div>
                <div class="form-group row mb-3">
                  <label for="age" class="col-sm-2 col-form-label">Age</label>
                  <div class="col-sm-10">
                    <Field name="age" as="select" class="form-control" :class="{ 'is-invalid': errors.age }">
                        <option v-for="ageVal in 100" :value="ageVal">{{ageVal}}</option>
                      </Field>
                      <div class="invalid-feedback">{{ errors.age }}</div>
                  </div>
                </div>
                <div class="form-group row mb-3">
                  <label for="name" class="col-sm-2 col-form-label">Email</label>
                  <div class="col-sm-10">
                    <Field name="email" id="email" type="text" class="form-control" :class="{ 'is-invalid': errors.email }" />
                      <div class="invalid-feedback">{{ errors.email }}</div>
                  </div>
                </div>          
                <div class="form-group">
                  <button class="btn btn-primary" :disabled="isSubmitting">
                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                    Save
                  </button>
                  <button class="btn btn-secondary m-1" @click="showForm = false">
                    Close
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </transition>
    </div>
    <!-- Add button -->
    <div style="text-align: left;margin-bottom: 20px;">
      <button @click="addNew" style="background:green;padding:5px 40px;color:#ffffff;cursor: pointer;border-radius:5px;border:1px solid green;">
        Add
      </button>
    </div>
    <!-- Kendo Grid -->
    <div class="col-md-12">
      <Filter
      :fields="fields"
      :value="filter"
      @change="onFilterChange"
      :default-group-filter="defaultGroupFilter"
    >
    </Filter>
      <Grid
        :style="{ height: '450px' }"
        :data-items="onDataBoundRefValue"
        :columns="columns"
        @filterchange="onFilterChange"
        :editable="'inline'"
    :edit-field="'inEdit'"
      >
      </Grid>
    </div>
  </div>
</template>

