<template>
    <div>
        <b-row>
            <b-col cols="12" class="text-center text-secondary my-4">
              <img :src="require(`@/assets/${imageName}`)" alt="empty-state" style="width: 300px; height: 300px;"/>
              <h3>{{ title }}</h3>
              <span>
                {{ description }}
              </span>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'NoRecordsComponent',
    props: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        imageName: {
            //only the name of the image and the extension e.j: no-records.svg
            type: String,
            required: true
        }
    }
})
</script>

