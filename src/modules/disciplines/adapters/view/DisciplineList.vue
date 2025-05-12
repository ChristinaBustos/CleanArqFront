<template>
    <div>
        <b-row>
            <b-col sm="12" md="12">
                <h1 class="mt-2 text-secondary">
                    <BookmarkIcon class="icon" size="1x" />
                    Disciplinas
                </h1>
            </b-col>
            <b-col sm="10" md="6" class="d-flex">
                <b-input-group class="my-3 w-50">
                    <b-form-input v-model="search" placeholder="Buscar disciplina..." debounce="600"></b-form-input>
                    <b-input-group-prepend>
                        <span class="input-group-text">
                            <SearchIcon class="icon" size="1x" />
                        </span>
                    </b-input-group-prepend>
                </b-input-group>
                <b-input-group class="my-3 mx-4 w-50">
                    <b-form-select v-model="selectedFilter" :options="filterOptions"></b-form-select>
                </b-input-group>

            </b-col>
            <b-col md="6" class="text-right mt-3">
                <RegisterModal @refresh="getAll" />
            </b-col>
        </b-row>
        <template v-if="disciplines.length > 0">
            <b-row>
                <b-col v-for="discipline in disciplines" :key="discipline.id" sm="12" md="6" lg="4">
                    <CardDisciplines :discipline="discipline" @edit="openUpdateModal" @refresh="getAll" />
                </b-col>
            </b-row>
        </template>
        <template v-else>
            <b-row>
                <b-col cols="12" class="text-center text-secondary my-3">
                    <img src="@/assets/no-questions.svg" class="empty-disciplines">
                    <h3>No se encontraron registros</h3>
                    <span>
                        Parece que no hay disciplinas registradas o
                        No hay coincidencias con tu búsqueda
                    </span>
                </b-col>
            </b-row>
        </template>
        <b-row v-if="disciplines.length > 0">
            <b-col cols="4" class="d-flex align-items-center font-weight-bold">
                Total de registros: {{ totalRows }}
            </b-col>
            <b-col cols="4" class="mb-0">
                <b-pagination pills v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="mt-4"
                    align="center" @change="handlePageChange"></b-pagination>
            </b-col>
            <b-col cols="4" class="d-flex align-items-center justify-content-end font-weight-bold">
                <b-form-group class="mb-0" label="Mostrar" label-for="perPage" label-align-sm="left" label-cols-sm="5"
                    label-cols-lg="5">
                    <b-form-select v-model="perPage" :options="perPageOptions" @change="handlePerPageChange" class="w-auto ml-2">
                    </b-form-select>
                </b-form-group>
            </b-col>

        </b-row>

        <UpdateModal :selectedDiscipline="selectedDiscipline" @refresh="getAll" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CardDisciplines from '../components/CardDisciplines.vue';
import RegisterModal from '../components/RegisterModal.vue';
import { DisciplineCohtroller } from '../disciplines.controller';
import { Discipline } from '../../entities/discipline';
import UpdateModal from '../components/UpdateModal.vue';
import { PaginationDto } from '@/kernel/types';

export default Vue.extend({
    components: {
        CardDisciplines,
        RegisterModal,
        UpdateModal
    },
    data() {
        return {
            search: '',
            currentPage: 1,
            perPage: 6,
            perPageOptions: [6, 12, 30, 60],
            totalRows: 0,
            disciplines: [] as Discipline[],
            selectedDiscipline: null as Discipline | null,
            selectedFilter: 'name',
            filterOptions: [
                { value: 'name', text: 'Nombre' },
                { value: 'category', text: 'Categoría' },
                { value: 'type', text: 'Tipo' }
            ]
        }
    },
    mounted() {
        this.getAll()
    },
    methods: {
        async getAll() {
            this.$store.dispatch("showLoader")
            try {
                const pagination: PaginationDto = {
                    value: this.search,
                    paginationType: {
                        page: this.currentPage - 1,
                        limit: this.perPage,
                        sortBy: 'name',
                        order: 'asc',
                        filter: this.selectedFilter
                    }
                }

                const controller = new DisciplineCohtroller()
                const {result, metadata} = await controller.getAllDisciplines(pagination)

                if (result) {
                    this.disciplines = result
                    this.totalRows = metadata?.total || 0;
                }
            } catch (error) {
                this.$swal.fire({
                    title: 'Error',
                    text: 'Error al traer las disciplinas',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                })
            } finally {
                this.$store.dispatch("hideLoader")
            }
        },

        openUpdateModal(discipline: Discipline) {
            this.selectedDiscipline = discipline
            this.$bvModal.show('update-modal-discipline')
        },

        handlePageChange(page: number) {
            this.currentPage = page
            this.getAll()
        },

        handlePerPageChange() {
            this.currentPage = 1
            this.getAll()
        }
    },
    watch: {
        search(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.currentPage = 1
                this.getAll()
            }
            //this.getAll()
        },
        selectedFilter(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.currentPage = 1
                this.getAll()
            }
        }
    }
});
</script>

<style>
.empty-disciplines {
    width: 300px;
    height: 300px;
}
</style>
