<template>
    <div>
        <b-modal id="update-modal-discipline" title-class="text-secondary" size="lg" no-close-on-backdrop centered title="Edición de Disciplina" @hidden="resetForm">
            <div>
                <b-form>
                    <b-container>
                        <b-row>
                            <b-col lg="6" md="12" sm="12">
                                <b-form-group id="group-name" label-for="name">
                                    <label for="name" class="text-secondary">Nombre:</label>
                                    <b-form-input id="name" type="text" :placeholder="disciplineData.name" disabled />
                                </b-form-group>

                                <b-form-group id="group-category" label-for="category">
                                    <label for="category" class="text-secondary">Categoría:</label>
                                    <b-form-input id="category" type="text" :placeholder="disciplineData.category"
                                        disabled />
                                </b-form-group>

                                <b-form-group id="group-type">
                                    <label for="type" class="text-secondary">Tipo:</label>
                                    <vue-multiselect v-model="disciplineData.type" id="type"
                                                     :class="{'is-invalid': $v.disciplineData.type.$error}"
                                                     :state="$v.disciplineData.type.$dirty ? !$v.disciplineData.type.$error : true"
                                                     :options="disciplineTypes" :searchable="true"
                                                     :allow-empty="false" placeholder="Selecciona el tipo"
                                                     required>
                                    </vue-multiselect>
                                    <b-form-text v-if="$v.disciplineData.type.$error">
                                        <p v-if="!$v.disciplineData.type.required" class="text-danger mb-0">El tipo es obligatorio</p>
                                    </b-form-text>
                                </b-form-group>

                                <b-form-group id="group-description">
                                    <label for="description" class="text-secondary">Descripción:</label>
                                    <b-form-textarea v-model="$v.disciplineData.description.$model" id="description" no-resize
                                                     placeholder="Ingrese la descripción" rows="2" max-rows="2"
                                                     :state="$v.disciplineData.description.$dirty ? !$v.disciplineData.description.$error : null"/>
                                    <b-form-invalid-feedback>
                                        <span v-if="!$v.disciplineData.description.maxLength">No debe exceder los 200 caracteres</span>
                                        <span v-else-if="!$v.disciplineData.description.valid">Solo se aceptan letras, números, punto, comas y comillas</span>
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </b-col>

                            <b-col lg="6" md="12" sm="12">
                                <b-form-group id="group-image">
                                    <label for="disciplineImage" class="text-secondary">Seleccione una Imagen</label>
                                    <b-form-file id="disciplineImage" placeholder="Ningún archivo seleccionado"
                                                 drop-placeholder="Suelta la imagen aquí" browse-text="Seleccionar"
                                                 v-model="$v.disciplineData.disciplineImage.$model"
                                                 :state="$v.disciplineData.disciplineImage.$dirty ? !$v.disciplineData.disciplineImage.$error : null"
                                                 @change="handleImageUpload" accept=".jpeg, .jpg, .png"/>
                                    <b-form-invalid-feedback v-if="$v.disciplineData.disciplineImage.$pending">
                                        Validando imagen...
                                    </b-form-invalid-feedback>
                                    <b-form-invalid-feedback v-if="$v.disciplineData.disciplineImage.$error">
                                        <span v-if="!$v.disciplineData.disciplineImage.validSize">No debe de exceder las 2mb</span>
                                        <span v-else-if="!$v.disciplineData.disciplineImage.validFile">Solo se aceptan archivos JPG, JPEG o PNG</span>
                                    </b-form-invalid-feedback>

                                    <!-- Previsualización de imagen -->
                                    <div class="d-flex justify-content-center align-items-center">
                                        <div v-if="imagePreview">
                                            <b-img :src="imagePreview" class="mt-2 img-fluid img-preview" />
                                        </div>
                                        <div v-else
                                            class="d-flex flex-column justify-content-center align-items-center not-preview mt-2">
                                            <img src="@/assets/Photos_empty.svg" />
                                            <p class="mt-2">Aquí se mostrara la imagen que selecciones</p>
                                        </div>
                                    </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-form>
            </div>

            <!-- Footer personalizado -->
            <template #modal-footer>
                <b-button pill class="bg-primary" @click="onUpdateDiscipline">Guardar</b-button>
                <b-button pill @click="$bvModal.hide('update-modal-discipline')">Cancelar</b-button>
            </template>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Multiselect from "vue-multiselect";
import { Type } from "../../entities/type";
import { Discipline } from "../../entities/discipline";
import { UpdateDisciplineDto } from "../../entities/update-disciplines.dto";
import { SaveDisciplinesDto } from "../../entities/save-disciplines.dto";
import { DisciplineCohtroller } from "../disciplines.controller";
import { TypesResponse } from "@/kernel/types";
import {showAlert, showConfirmation, showErrorToast, showSuccessToast, showWarningToast} from "@/kernel/functions";
import {maxLength, required} from "vuelidate/lib/validators";
import {isMaxSize, isTextValid, isValidFileType} from "@/modules/disciplines/utils/functions";

export default Vue.extend({
    components: {
        'vue-multiselect': Multiselect
    },
    props: {
        selectedDiscipline: {
            type: Object as () => Discipline
        }
    },
    data() {
        return {
            disciplineData: {
                name: '',
                type: '',
                category: '',
                description: '',
                disciplineImage: null as File | null
            } as SaveDisciplinesDto,
            typeSelected: null,
            imagePreview: '',
            disciplineTypes: Object.values(Type),
            formUpdate: {
                type: '',
                description: '',
                disciplineImage: null as File | null
            } as UpdateDisciplineDto,
            $v: undefined as any
        }
    },
    validations: {
        disciplineData: {
            description: {maxLength: maxLength(200), valid: isTextValid},
            type: {required},
            disciplineImage: {
                validSize: (file: File | null) => {
                    if (!file) return true
                    return isMaxSize(file)
                },
                validFile: (file: File | null) => {
                    if (!file) return true
                    return isValidFileType(file)
                }
            }
        }
    },
    methods: {
        async handleImageUpload(event: Event) {
            const input = event.target as HTMLInputElement
            if (!input.files || input.files.length === 0) return

            const file: File = input.files[0]

            this.$v.disciplineData.disciplineImage.$reset()

            if (!isMaxSize(file) || !isValidFileType(file)) {
                this.$v.disciplineData.disciplineImage.$touch()
                return
            }

            const reader = new FileReader()
            reader.onload = () => {
                this.imagePreview = reader.result as string
            }

            this.$v.disciplineData.disciplineImage.$model = file;

            this.imagePreview = URL.createObjectURL(file)
        },

        compressImage(file: File, quality: number): Promise<string> {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target?.result as string;

                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");

                        const MAX_WIDTH = 800;
                        const MAX_HEIGHT = 600;
                        let width = img.width;
                        let height = img.height;

                        if (width > height && width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        } else if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        ctx?.drawImage(img, 0, 0, width, height);

                        const compressedBase64 = canvas.toDataURL(file.type, quality);
                        resolve(compressedBase64);
                    };

                    img.onerror = () => reject("Error al cargar la imagen");
                };

                reader.onerror = () => reject("Error al leer la imagen");
            });
        },

        async updateDiscipline() {
            const disciplineController = new DisciplineCohtroller()

            let compressedImage: string | null = null;
            if (this.$v.disciplineData.disciplineImage.$model instanceof File) {
                const file: File = this.$v.disciplineData.disciplineImage.$model;
                compressedImage = await this.compressImage(file, 0.6);
            } else {
                compressedImage = this.imagePreview;
            }

            this.formUpdate = {
                id: this.selectedDiscipline.id,
                type: this.disciplineData.type,
                description: this.disciplineData.description,
                disciplineImage: compressedImage
            }

            const response = await disciplineController.updateDiscipline(this.formUpdate)

            if (response.type === TypesResponse.SUCCESS) {
                showSuccessToast({
                    title: 'Disciplina modificada',
                    text: 'La disciplina ha sido actualizada exitosamente',
                    timer: 3000
                })
                this.resetForm()
                this.$bvModal.hide('update-modal-discipline')
                this.$emit('refresh')
            } else {
                showErrorToast({
                    title: 'Error',
                    text: response.text,
                    timer: 3000
                })
            }
        },

        onUpdateDiscipline() {
            this.$v.$touch()

            if (this.$v.$invalid) {
                showWarningToast({
                    title: 'Hay datos con errores',
                    text: 'Por favor corrige los datos',
                    timer: 3000
                })
                return
            }

            showConfirmation('Actualización de disciplina', 'Se modificará la disciplina seleccionada', 'question', this.updateDiscipline)
        },

        resetForm() {
            this.$v.$reset();
            this.disciplineData = { ...this.selectedDiscipline } as SaveDisciplinesDto;
            this.disciplineData.disciplineImage = null;
            this.imagePreview = this.selectedDiscipline?.disciplineImage || '';
        }
    },
    watch: {
        selectedDiscipline: {
            handler(newVal) {
                if (newVal) {
                    this.disciplineData = { ...newVal } as SaveDisciplinesDto;
                    this.disciplineData.disciplineImage = null;
                    this.imagePreview = newVal.disciplineImage
                }
            },
            immediate: true,
        },
    }
})
</script>

<style>
.is-invalid {
    border: 1px solid red !important;
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
    border-radius: 4px;
}
</style>