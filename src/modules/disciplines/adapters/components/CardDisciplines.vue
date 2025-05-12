<template>
	<div class="my-2 ">
		<b-card class="box-shadow">
			<div class="image-container">
				<img v-if="getImageSource(discipline.disciplineImage)" :src="discipline.disciplineImage" class="custom-img" alt="">
				<div v-else class="gray-placeholder">
					<p class="text-secondary">Sin imagen</p>
				</div>
			</div>
			<div class="d-flex align-items-center justify-content-between p-3">
				<div class="d-flex flex-column">
					<b-card-title class="text-secondary mb-1 truncate-title">
						{{ discipline.name }}
					</b-card-title>
					<b-card-text class="text-secondary">
						{{ discipline.category }} - {{ discipline.type }}
					</b-card-text>
				</div>
				<div>
					<b-badge pill :variant="discipline.status ? 'success my-1 py-1' : 'danger my-1 py-1'">
						{{ discipline.status ? 'Activo' : 'Inactivo' }}
					</b-badge>
				</div>
			</div>
			<b-card-text class="px-3 discipline-description text-secondary">
				{{ discipline.description }}
			</b-card-text>
			<div class="d-flex justify-content-end px-3 pb-3">
				<b-button pill :variant="discipline.status ? 'danger m-1' : 'teacher m-1'" size="sm"
					@click="onClickChangeStatus(discipline)">
					{{ discipline.status ? 'Deshabilitar' : 'Habilitar' }}</b-button>
				<b-button pill class="m-1" variant="blue-soft" size="sm"
					@click="$emit('edit', discipline)">Editar</b-button>
			</div>
		</b-card>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { ChangeStatusDisciplineDto } from "../../entities/change-status-disciplines.dto";
import {showAlert, showConfirmation, showErrorToast, showSuccessToast} from "@/kernel/functions";
import { Discipline } from "../../entities/discipline";
import { DisciplineCohtroller } from "../disciplines.controller";
import { TypesResponse } from "@/kernel/types";

export default Vue.extend({
	props: {
		discipline: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			changeStatus: {
				id: this.discipline.id
			} as ChangeStatusDisciplineDto
		}
	},
	methods: {
		onClickChangeStatus(discipline: Discipline) {
			showConfirmation('Cambio de estado', `¿Esta segur@ de ${discipline.status ? 'deshabilitar' : 'habilitar'} la disciplina?`, 'question', () => this.changeStatusDiscipline())
		},

		async changeStatusDiscipline() {
			const disciplineController = new DisciplineCohtroller()

			const response = await disciplineController.changeStatus(this.changeStatus)

			if (response.type === TypesResponse.SUCCESS) {
                showSuccessToast({
                    title: 'Cambio de estado exitoso',
                    text: 'Se ha cambio el estado de la disciplina correctamente',
                    timer: 3000
                })
				this.$emit('refresh')
			} else {
				showErrorToast({ title: 'Error', text: response.text })
			}
		},

		getImageSource(image: string) {
			const base64Pattern = /^data:image\/(png|jpe?g|gif|webp);base64,/
			
			if (base64Pattern.test(image) || image.startsWith('http'))
				return true
		}
	}
})
</script>

<style scoped>
.box-shadow {
	border-radius: 15px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.image-container {
    width: 100%;
    height: 100px; 
    overflow: hidden;
    display: block;
}

.custom-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
	border-radius: 15px 15px 0 0;
}

.card-body {
    padding: 0;
}

.discipline-description {
    min-height: 60px;
    max-height: 60px;
    line-height: 20px;
    overflow: hidden;
    position: relative;
    word-break: break-word;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}

.truncate-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    line-height:  30px;
    max-height: 30px;
    position: relative;
    word-break: break-word;
}

.truncate-title::after {
    content: '...';
    position: absolute;
    bottom: 0;
    right: 0;
    background: linear-gradient(to right, transparent, white 50%);
    padding-left: 20px;
    display: none;
}

.truncate-title:has(+ .truncate-title-content)::after {
    display: block;
}

.gray-placeholder {
	width: 100%;
	height: 100px;
	background-color: #ccc;
	border-radius: 15px 15px 0 0;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
}
</style>