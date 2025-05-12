import { Module } from 'vuex';
import { Role } from '@/modules/roles/entities/Role';

interface AuthState {
	token: string | null;
	user: string | null;
	roles: Role[];
	selectedRole: string | null;
	isAuthenticated: boolean;
	idUser: number | null;
}

interface JwtPayload {
	roles: Role[];
	username: string;
	fullName: string;
	sub: string;
	iat: number;
	exp: number;
	idUser: number;
}

export const auth: Module<AuthState, any> = {
	namespaced: true,

	state: () => ({
		token: localStorage.getItem('token') || null,
		user: null,
		roles: [],
		selectedRole: null,
		idUser: null,
		isAuthenticated: !!localStorage.getItem('token'),
	}),

	getters: {
		isAuthenticated(state): boolean {
			return state.isAuthenticated;
		},

		idUser(state): number | null {
			return state.idUser;
		},

		currentUser(state): string | null {
			return state.user;
		},

		selectedRole(state): string | null {
			return state.selectedRole;
		},

		availableRoles(state): any[] {
			return state.roles;
		},

		hasRole:
			(state) =>
			(roleName: string): boolean => {
				return state.selectedRole === roleName;
			},

		userRoles: (state) => state.roles,
		userData: (state) => state.user,
	},

	mutations: {
		SET_TOKEN(state, token) {
			state.token = token;
		},

		SET_ID_USER(state, idUser) {
			state.idUser = idUser;
		},

		SET_USER(state, user) {
			state.user = user;
		},

		SET_ROLES(state, roles) {
			state.roles = roles;
		},

		SET_SELECTED_ROLE(state, role) {
			state.selectedRole = role;
		},

		SET_AUTHENTICATED(state, isAuth) {
			state.isAuthenticated = isAuth;
		},

		LOGOUT(state) {
			state.token = null;
			state.user = null;
			state.roles = [];
			state.selectedRole = null;
			state.isAuthenticated = false;
			state.idUser = null;
		},
	},

	actions: {
		// Acción para cuando el usuario inicia sesión
		login({ commit, dispatch }, { token, user, roles, selectedRole, idUser }) {
			try {
				// Guardar SOLO el token en localStorage para peticiones HTTP
				localStorage.setItem('token', token);

				// Guardar información básica en el estado de Vuex (volátil)
				commit('SET_TOKEN', token);
				commit('SET_ID_USER', idUser);
				commit('SET_USER', user);
				commit('SET_ROLES', roles);
				commit('SET_SELECTED_ROLE', selectedRole);
				commit('SET_AUTHENTICATED', true);

				return true;
			} catch (error) {
				// Limpiar en caso de error
				commit('LOGOUT');
				return false;
			}
		},

		// Configura el rol seleccionado (se llama después de login o al cambiar de rol)
		setSelectedRole({ commit }, role) {
			// Solo guardar en el estado de Vuex (volátil)
			commit('SET_SELECTED_ROLE', role);
		},

		// Nueva acción para restaurar el estado desde el token JWT
		initializeStore({ commit, dispatch }) {
			const token = localStorage.getItem('token');

			if (token) {
				commit('SET_TOKEN', token);

				// Intentar decodificar el token y restaurar el estado
				return dispatch('parseToken')
					.then((payload) => {
						return true;
					})
					.catch((error) => {
						dispatch('logout');
						return false;
					});
			}
			return Promise.resolve(false);
		},

		// Acción para decodificar el token y extraer información
		parseToken({ commit, state }) {
			return new Promise((resolve, reject) => {
				try {
					// Verificar que hay un token para analizar
					const token = state.token;
					if (!token) {
						throw new Error('No hay token para analizar');
					}

					// Decodificar el token JWT
					const parts = token.split('.');
					if (parts.length !== 3) {
						throw new Error('Token JWT inválido');
					}

					// Decodificar la parte del payload (la segunda parte)
					let payload: JwtPayload;
					try {
						const base64Url = parts[1];
						const base64 = base64Url
							.replace(/-/g, '+')
							.replace(/_/g, '/');
						payload = JSON.parse(window.atob(base64));
					} catch (decodeError) {
						throw new Error('Token malformado');
					}

					// Verificar si el token ya expiró
					if (payload.exp && Date.now() >= payload.exp * 1000) {
						throw new Error('Token expirado');
					}

					// Si el token tiene información de usuario y roles, actualizar estado
					if (payload.sub) {
						commit('SET_AUTHENTICATED', true);
						commit('SET_ID_USER', payload.idUser);

						// Si no hay información ya cargada, cargarla del token
						if (!state.user && payload.fullName) {
							commit('SET_USER', payload.fullName);
						}

						if (
							(!state.roles || state.roles.length === 0) &&
							payload.roles
						) {
							commit('SET_ROLES', payload.roles);
							// Si no hay rol seleccionado, elegir el primer
							if (
								!state.selectedRole &&
								payload.roles.length > 0
							) {
								const defaultRole = localStorage.getItem('selectedRole')

								if (defaultRole && payload.roles.find(role => role.name === defaultRole)) {
									commit('SET_SELECTED_ROLE', defaultRole);
								} else {
									localStorage.setItem('selectedRole', payload.roles[0].name);
									commit('SET_SELECTED_ROLE', payload.roles[0].name);
								}

							}
						}
					}

					resolve(payload);
				} catch (error) {
					commit('LOGOUT');
					reject(error);
				}
			});
		},

		logout({ commit }) {
			localStorage.removeItem('token');
			localStorage.removeItem('selectedRole');
			commit('LOGOUT');

			return true;
		},
	},
};
