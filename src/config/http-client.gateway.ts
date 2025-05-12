import Vue from 'vue';
import AxiosClient from './axios';
import router from '@/router';
import Api from "@/config/http-client.gateway";
import store from '@/store';
import { AxiosRequestConfig } from 'axios';
import { ApiResponse, TypesResponse } from "@/kernel/types";

const errorMessages: Record<string, { title: string; message: string }> = {
    TOKEN_EXPIRED: {
        title: 'Código expirado',
        message: 'Solicita un nuevo código de recuperación de contraseña',
    },
    USER_NOT_FOUND: {
        title: 'Usuario no encontrado',
        message: 'El usuario no existe',
    },
    USER_INACTIVE: {
        title: 'Usuario inactivo',
        message: 'El usuario no está activo',
    },
    USER_BLOCKED: {
        title: 'Usuario bloqueado',
        message: 'Vuelve a intentarlo más tarde',
    },
    BAD_CREDENTIALS: {
        title: 'Credenciales incorrectas',
        message: 'Usuario y/o contraseña incorrectos',
    },
    SESSION_EXPIRED: {
        title: 'Sesión expirada',
        message: 'Es necesario iniciar sesión nuevamente',
    },
    ACCESS_DENIED: {
        title: 'Acceso denegado',
        message: 'No tienes permisos para acceder a esta ruta',
    },
    SERVER_ERROR: {
        title: 'Error en el servidor',
        message: 'Ha ocurrido un error en el servidor, vuelve a intentarlo más tarde',
    },
    UNEXPECTED_ERROR: {
        title: 'Error inesperado',
        message: 'Ha ocurrido un error inesperado, vuelve a intentarlo más tarde',
    },
    GRADUATED_ERROR: {
        title: 'Egresado',
        message: 'El alumno se encuentra egresado',
    },
    SISA_WRONG_DATA: {
        title: 'Datos incorrectos',
        message: 'Los datos ingresados son incorrectos',
    }
};

AxiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

AxiosClient.interceptors.response.use(
    (response) => {
        return Promise.resolve(response);
    },
    (error) => {
        // Flag para evitar múltiples redirecciones
        const isRedirecting = localStorage.getItem('is_redirecting') === 'true';

        if (error.response) {
            const { status, data } = error.response;

            let errorMessage = Object.values(errorMessages).find(msg => msg.title === data.text);

            if (!errorMessage && data.text) {
                errorMessage = {
                    title: "Error",
                    message: data.text
                }
            }

            if (!errorMessage) {
                errorMessage = errorMessages.UNEXPECTED_ERROR;
            }

            // Manejo de errores de autenticación (401) y autorización (403)
            if (status === 401 || status === 403) {
                if (!isRedirecting) {
                    // Marcar que estamos en proceso de redirección
                    localStorage.setItem('is_redirecting', 'true');
                    
                    // Cerrar sesión usando el store de Vuex
                    store.dispatch('auth/logout');
                    
                    // Mostrar notificación al usuario
                    Vue.swal({
                        title: errorMessage.title || 'Sesión expirada',
                        text: errorMessage.message || 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                        icon: "warning",
                        confirmButtonText: "Aceptar",
                        showCancelButton: false,
                    }).then(() => {
                        // Redireccionar solo después de que el usuario cierre la alerta
                        router.push({ 
                            name: 'login',
                            params: { expired: 'true' } 
                        }).finally(() => {
                            // Quitar la marca de redirección después de completar
                            localStorage.removeItem('is_redirecting');
                        });
                    });
                }
            } else {
                // Para otros errores, mostrar notificación normal
                Vue.swal({
                    title: errorMessage.title,
                    text: errorMessage.message,
                    icon: "warning",
                    confirmButtonText: "Aceptar",
                    showCancelButton: false,
                });
            }

        } else {
            // Error de red o sin respuesta del servidor
            if (!isRedirecting) {
                Vue.swal({
                    title: "Error de conexión",
                    text: "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    showCancelButton: false,
                });
            }
        }
        return Promise.reject(error);
    }
);

export default {
    get(endpoint: string) {
        return AxiosClient.get(endpoint);
    },
    post(endpoint: string, payload: any, config?: AxiosRequestConfig) {
        return AxiosClient.post(endpoint, payload, config);
    },
    postBlob(endpoint: string, payload: any) {
        return AxiosClient.post(endpoint, payload, { responseType: 'blob' });
    },
    put(endpoint: string, payload: any) {
        return AxiosClient.put(endpoint, payload);
    },
    patch(endpoint: string, payload: any) {
        return AxiosClient.patch(endpoint, payload);
    },
}

export async function handleRequest<T, P = undefined>(method: "post" | "put" | "get" | "delete" | "patch",url: string, payload?: P): Promise<ApiResponse<T>> {
    try {
        const { status, data } = await (Api as any)[method](url, payload);
        return {
            result: status === 200 ? data.result : null,
            metadata: status === 200 ? data.metadata : null,
            type: data.type,
            text: data.text
        };
    } catch (error: any) {
        return {
            result: null,
            metadata: null,
            type: TypesResponse.ERROR,
            text: error.response?.data?.text || `Error inesperado en solicitud ${method}`
        };
    }
}

export async function handleRequestBlob<P = undefined>(url: string, payload?: P): Promise<ApiResponse<Blob>> {
    try {
        const response = await Api.postBlob(url, payload);
        return {
            result: response.status === 200 ? response.data : null,
            metadata: null,
            type: TypesResponse.SUCCESS,
            text: 'Archivo generado correctamente'
        };
    } catch (error: any) {
        return {
            result: null,
            metadata: null,
            type: TypesResponse.ERROR,
            text: error.response?.data?.text || 'Error inesperado al descargar el archivo'
        };
    }
}

