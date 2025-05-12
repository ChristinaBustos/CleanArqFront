<template>
    <div>
        <b-button variant="primary" pill v-b-modal.register-modal class="new-question-button">
            <PlusIcon class="button-icon"/>
            Nueva disciplina
        </b-button>

        <b-modal id="register-modal" title-class="text-secondary" size="lg" no-close-on-backdrop centered title="Registro de Disciplina" scrollable
                 @hidden="resetForm">
            <div>
                <b-form>
                    <b-container>
                        <b-row>
                            <b-col lg="6" md="12" sm="12">
                                <b-form-group id="group-name" label-for="name">
                                    <label for="name" class="required-field text-secondary">Nombre:</label>
                                    <b-form-input v-model="$v.form.name.$model" id="name" type="text"
                                                  placeholder="Ajedrez" required
                                                  :state="$v.form.name.$dirty ? !$v.form.name.$error : null"/>
                                    <b-form-invalid-feedback v-if="$v.form.name.$error">
                                        <span v-if="!$v.form.name.required">El nombre es obligatorio</span>
                                        <span v-else-if="!$v.form.name.maxLength">Debe tener un máximo de 50 caracteres</span>
                                        <span v-else-if="!$v.form.name.valid">Solo se aceptan letras, números, puntos, comas y comillas</span>
                                    </b-form-invalid-feedback>
                                </b-form-group>

                                <b-form-group id="group-category">
                                    <label for="category" class="required-field text-secondary">Categoría:</label>
                                    <vue-multiselect v-model="$v.form.category.$model" id="category"
                                                     :class="{'is-invalid': $v.form.category.$error}"
                                                     :state="$v.form.category.$dirty ? !$v.form.category.$error : null"
                                                     :options="disciplineCategories" :searchable="true"
                                                     :allow-empty="false" placeholder="Selecciona la categoría"
                                                     required>
                                    </vue-multiselect>
                                    <b-form-text v-if="$v.form.category.$error">
                                        <p v-if="!$v.form.category.required" class="text-danger mb-0">La categoría es obligatoria</p>
                                    </b-form-text>
                                </b-form-group>

                                <b-form-group id="group-type">
                                    <label for="type" class="required-field text-secondary">Tipo:</label>
                                    <vue-multiselect v-model="form.type" id="type"
                                                     :class="{'is-invalid': $v.form.type.$error}"
                                                     :state="$v.form.type.$dirty ? !$v.form.type.$error : null"
                                                     :options="disciplineTypes" :searchable="true"
                                                     :allow-empty="false" placeholder="Selecciona el tipo"
                                                     required>
                                    </vue-multiselect>
                                    <b-form-text v-if="$v.form.type.$error">
                                        <p v-if="!$v.form.type.required" class="text-danger mb-0">El tipo es obligatorio</p>
                                    </b-form-text>
                                </b-form-group>

                                <b-form-group id="group-description">
                                    <label for="description" class="required-field text-secondary">Descripción:</label>
                                    <b-form-textarea v-model="$v.form.description.$model" id="description" no-resize
                                                     placeholder="Ingrese la descripción" rows="2" max-rows="2"
                                                     :state="$v.form.description.$dirty ? !$v.form.description.$error : null"/>
                                    <b-form-invalid-feedback v-if="$v.form.description.$error">
                                        <span v-if="!$v.form.description.required">La descripción es obligatoria</span>
                                        <span v-else-if="!$v.form.description.maxLength">No debe exceder los 200 caracteres</span>
                                        <span v-else-if="!$v.form.description.valid">Solo se aceptan letras, números, puntos, comas y comillas</span>
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </b-col>

                            <b-col lg="6" md="12" sm="12">
                                <b-form-group id="group-image">
                                    <label for="disciplineImage" class="required-field text-secondary">Seleccione una Imagen</label>
                                    <b-form-file id="disciplineImage" placeholder="Ningún archivo seleccionado"
                                                 drop-placeholder="Suelta la imagen aquí" browse-text="Seleccionar"
                                                 v-model="$v.form.disciplineImage.$model"
                                                 :state="$v.form.disciplineImage.$dirty ? !$v.form.disciplineImage.$error : null"
                                                 @change="handleImageUpload" accept="jpeg, .jpg, .png" required/>
                                    <b-form-invalid-feedback v-if="$v.form.disciplineImage.$pending">
                                        Validando imagen...
                                    </b-form-invalid-feedback>
                                    <b-form-invalid-feedback v-if="$v.form.disciplineImage.$error">
                                        <span v-if="!$v.form.disciplineImage.required">La imagen es obligatoria</span>
                                        <span v-else-if="!$v.form.disciplineImage.validSize">No debe exceder las 2mb</span>
                                        <span v-else-if="!$v.form.disciplineImage.validFile">Solo se aceptan archivos JPG, JPEG o PNG</span>
                                    </b-form-invalid-feedback>

                                    <!-- Previsualización de imagen -->
                                    <div class="d-flex justify-content-center align-items-center">
                                        <div v-if="imagePreview">
                                            <b-img :src="imagePreview" class="mt-3 img-fluid img-preview"/>
                                        </div>
                                        <div v-else
                                             class="d-flex flex-column justify-content-center align-items-center not-preview mt-3">
                                            <img src="@/assets/Photos_empty.svg" alt="Imagen no seleccionada"/>
                                            <p class="mt-2 text-secondary">Aquí se mostrará la imagen que selecciones</p>
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
                <b-button pill class="bg-primary" @click="onSaveDiscipline" :disabled="$v.$invalid">Guardar</b-button>
                <b-button pill @click="$bvModal.hide('register-modal')">Cancelar</b-button>
            </template>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import {SaveDisciplinesDto} from "../../entities/save-disciplines.dto";
import {DisciplineCohtroller} from "../disciplines.controller";
import {TypesResponse} from "@/kernel/types";
import {showAlert, showConfirmation, showErrorToast, showSuccessToast, showWarningToast} from "@/kernel/functions";
import {Type} from "../../entities/type";
import {Category} from "../../entities/category";
import Multiselect from "vue-multiselect";
import {maxLength, required} from "vuelidate/lib/validators";
import {isMaxSize, isTextValid, isValidFileType} from "@/modules/disciplines/utils/functions";

export default Vue.extend({
    components: {
        'vue-multiselect': Multiselect
    },
    data() {
        return {
            typeSelected: null,
            categorySelected: null,
            imagePreview: '',
            form: {
                name: '',
                description: '',
                type: '',
                category: '',
                disciplineImage: null as File | null
            } as SaveDisciplinesDto,
            disciplineTypes: Object.values(Type),
            disciplineCategories: Object.values(Category),
            $v: undefined as any
        }
    },
    validations: {
        form: {
            name: {required, maxLength: maxLength(50), valid: isTextValid},
            description: {required, maxLength: maxLength(200), valid: isTextValid},
            type: {required},
            category: {required},
            disciplineImage: {
                required,
                validSize: (file: File | null) => file ? isMaxSize(file) : false,
                validFile: (file: File | null) => file ? isValidFileType(file) : false
            }
        }
    },
    methods: {
        async handleImageUpload(event: Event) {
            const input = event.target as HTMLInputElement
            if (!input.files || input.files.length === 0) return

            const file: File = input.files[0]

            this.$v.form.disciplineImage.$reset()

            if (!isMaxSize(file)) {
                this.$v.form.disciplineImage.$touch()
                return
            }

            const reader = new FileReader()
            reader.onload = () => {
                this.imagePreview = reader.result as string
            }

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

        resetForm() {
            this.imagePreview = ''
            this.form = {
                name: '',
                description: '',
                type: '',
                category: '',
                disciplineImage: null
            }
            this.$v.$reset()
        },

        async saveDiscipline() {
            const disciplineController = new DisciplineCohtroller()
            const file: File = this.$v.form.disciplineImage.$model

            const discipline = {
                name: this.form.name,
                description: this.form.description,
                type: this.form.type,
                category: this.form.category,
                disciplineImage: await this.compressImage(file, 0.6)
            } as SaveDisciplinesDto

            const response = await disciplineController.saveDisciplines(discipline)

            if (response.type === TypesResponse.SUCCESS) {
                showSuccessToast({
                    title: 'Disciplina registrada',
                    text: 'La disciplina ha sido registrada exitosamente',
                    timer: 3000
                })
                this.resetForm()
                this.$bvModal.hide('register-modal')
                this.$emit('refresh')
            } else {
                showErrorToast({
                    title: 'Error',
                    text: response.text,
                    timer: 3000
                })
            }
        },

        onSaveDiscipline() {
            this.$v.$touch()

            if (this.$v.$invalid) {
                showWarningToast({
                    title: 'Datos incompletos',
                    text: 'Por favor complete los datos obligatorios',
                    timer: 3000
                })
                return
            }

            showConfirmation('Registro de disciplina', 'Se agregara a la colección de disciplinas', 'question', this.saveDiscipline)
        }
    }
})
</script>

<style>
.img-preview {
    width: 350px;
    height: 275px;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0 13px 27px -5px, rgba(0, 0, 0, 0.3) 0 8px 16px -8px;
}

.not-preview {
    width: 350px;
    height: 275px;
    border: #d2d2d2 dashed 2px
}

.is-invalid {
    border: 1px solid red !important;
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
    border-radius: 4px;
}
</style>