import Vue from 'vue';
import { SweetAlertIcon } from 'sweetalert2';
import Swal from 'sweetalert2';
import './sweet-alert-styles.css';
import { FunctionToastConfig, ToastConfig } from './types';
/**
 * Muestra una alerta básica utilizando SweetAlert2
 * @param title - Título de la alerta
 * @param message - Mensaje a mostrar
 * @param type - Tipo de icono de la alerta (success, error, warning, info, etc)
 */

export function showAlert(title: string, message: string, type: SweetAlertIcon = 'success') {
    Vue.swal({
        title: title,

        text: message,
        icon: type,
    });
}

/**
 * Muestra una alerta sin botón de cancelar
 * @param title - Título de la alerta
 * @param message - Mensaje a mostrar 
 * @param type - Tipo de icono de la alerta (success, error, warning, info, etc)
 */

export function showAlertWithoutCancel(title: string, message: string, type: SweetAlertIcon = 'success') {
    Vue.swal({
        title: title,
        text: message,
        icon: type,
        showCancelButton: false,
    });
}

/**
 * Muestra un diálogo de confirmación con botones de aceptar y cancelar
 * @param title - Título del diálogo
 * @param message - Mensaje a mostrar
 * @param type - Tipo de icono del diálogo (success, error, warning, info, etc)
 * @param callback - Función a ejecutar si se confirma
 * @param cancelCallback - Función opcional a ejecutar si se cancela
 */

export function showConfirmation(title: string, message: string, type: SweetAlertIcon = 'warning', callback: () => void, cancelCallback?: () => void) {
    const appElement = document.getElementById('app');
    Vue.swal({
        title: title,
        text: message,
        icon: type,
        showCancelButton: true,
        showCloseButton: false,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
            if (appElement) {
                appElement.setAttribute('inert', ''); 
            }
        },
        willClose: () => {
            if (appElement) {
                appElement.removeAttribute('inert'); 
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        } else {
            cancelCallback && cancelCallback();
        }
    });
}


/**
 * Muestra un diálogo de confirmación sin botón de cancelar
 * @param title - Título del diálogo
 * @param message - Mensaje a mostrar
 * @param type - Tipo de icono del diálogo (success, error, warning, info, etc) 
 * @param callback - Función a ejecutar si se confirma
 * @param cancelCallback - Función opcional a ejecutar por defecto
 */

export function showConfirmationWithoutCancel(title: string, message: string, type: SweetAlertIcon = 'warning', callback: () => void, cancelCallback: () => void = () => {}) {
    Vue.swal({
        title: title,
        text: message,
        icon: type,
        showCancelButton: false,
        confirmButtonText: 'Aceptar',
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        } else {
            cancelCallback && cancelCallback();
        }
    });
}

/**
 * Muestra un diálogo de confirmación con botones de aceptar y cancelar
 * @param title - Título del diálogo
 * @param message - Mensaje a mostrar
 * @param type - Tipo de icono del diálogo (success, error, warning, info, etc)
 * @param callback - Función asíncrona a ejecutar si se confirma
 * @param cancelCallback - Función asíncrona opcional a ejecutar si se cancela
 */

export function showConfirmationAsync(title: string, message: string, type: SweetAlertIcon = 'warning', callback: () => Promise<void>, cancelCallback?: () => Promise<void>) {
    Vue.swal({
        title: title,
        text: message,
        icon: type,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',

    }).then(async (result) => {
        if (result.isConfirmed) {
            await callback();
        } else {
            cancelCallback && await cancelCallback();
        }
    });
}

/**
 * Muestra un diálogo de confirmación sin botón de cancelar
 * @param title - Título del diálogo
 * @param message - Mensaje a mostrar
 * @param type - Tipo de icono del diálogo (success, error, warning, info, etc)
 * @param callback - Función asíncrona a ejecutar si se confirma
 * @param cancelCallback - Función asíncrona opcional a ejecutar por defecto
 */
export function showConfirmationWithoutCancelAsync(title: string, message: string, type: SweetAlertIcon = 'warning', callback: () => Promise<void>, cancelCallback: () => Promise<void> = async () => {}) {
    Vue.swal({
        title: title,
        text: message,
        icon: type,
        showCancelButton: false,
        confirmButtonText: 'Aceptar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            await callback();
        } else {
            cancelCallback && await cancelCallback();
        }
    });
}



// ------------------------------------------------
// Toast config

const toast = (config : ToastConfig) => {
    const { icon, title, text, onCloseCallback, timer } = config;

    Vue.swal.mixin({
        toast: true,
        position: 'top-end',
        iconColor: 'teacher',
        customClass: {
            popup: 'colored-toast'
        },
        showConfirmButton: false,
        showCancelButton: false,
        timer,
        timerProgressBar: true,
        didClose: () => {
            if(onCloseCallback){
                onCloseCallback();
            }
        }
    }).fire({
        icon,
        title,
        text
    })
}

export const showSuccessToast = ( config : FunctionToastConfig ) => {
    const { title, onCloseCallback, timer, text } = config;
    toast({
        icon: 'success',
        title,
        text: text ? text : '',
        onCloseCallback,
        timer: timer ? timer : 3000
    });
}

export const showErrorToast = ( config : FunctionToastConfig ) => {
    const { title, onCloseCallback, timer, text } = config;
    toast({
        icon: 'error',
        title,
        text: text ? text : '',
        onCloseCallback,
        timer: timer ? timer : 3000
    });
}

export const showWarningToast = ( config : FunctionToastConfig ) => {
    const { title, onCloseCallback, timer, text } = config;
    toast({
        icon: 'warning',
        title,
        text: text ? text : '',
        onCloseCallback,
        timer: timer ? timer : 3000
    });
}

export const showInfoToast = ( config : FunctionToastConfig ) => {
    const { title, onCloseCallback, timer, text } = config;
    toast({
        icon: 'info',
        title,
        text: text ? text : '',
        onCloseCallback,
        timer: timer ? timer : 3000
    });
}