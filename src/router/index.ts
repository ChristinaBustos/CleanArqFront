import Vue from 'vue';
import VueRouter from 'vue-router';
import adminRouter from './admin-router';
import teacherRouter from './teacher-router';
import studentRouter from './student-router';
import store from '../store';
import { userRoleRedirect } from '@/kernel/utils';

Vue.use(VueRouter);
const DEFAULT_TITLE = 'CODEC';

const router = new VueRouter({
	routes: [
		{
			path: '/',
			redirect: '/login',
		},
		{
			path: '/',
			component: { render: (c: any) => c('router-view') },
			children: [
				{
					path: '/login',
					name: 'login',
					component: () =>
						import('@/modules/auth/adapters/views/Login.vue'),
				},
				{
					path: '/recover',
					name: 'recover',
					component: () =>
						import('@/modules/auth/adapters/views/Recover.vue'),
				},
				{
					path: '/verify-code',
					name: 'verify-code',
					component: () =>
						import('@/modules/auth/adapters/views/VerifyCode.vue'),
				},
				{
					path: '/change-password',
					name: 'change-password',
					component: () =>
						import(
							'@/modules/auth/adapters/views/ChangePassword.vue'
						),
				},
				{
					path: 'student-registration',
					name: 'student-registration',
					component: () =>
						import(
							'@/modules/student-registration/adapters/views/StudentRegistration.vue'
						),
					meta: {
						title: 'Inscripción a talleres'
					}
				},
				{
					path: 'student-selective-registration',
					name: 'student-selective-registration',
					component: () =>
						import('@/modules/student-registration/adapters/views/StudentSelectiveRegistration.vue'),
					meta: {
						title: 'Inscripción a selectivos'
					}
				},
				...adminRouter,
				...studentRouter,
				...teacherRouter,
			],
		},
		{
			path: '*',
			redirect: (to) => {
				// Verificar si el usuario está autenticado
				const isAuthenticated = store.getters['auth/isAuthenticated'];
				if (!isAuthenticated) {
					return { name: 'login' };
				}
				
				// Redirigir según el rol
				const role = store.getters['auth/selectedRole'];
				return userRoleRedirect(role);
			}
		},
	],
});

// Solución para errores de navegación duplicada
// Captura del error NavigationDuplicated
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location: any) {
	return (originalPush.call(this, location) as any).catch((err: any) => {
		if (err.name !== 'NavigationDuplicated') {
			throw err;
		}
		return Promise.resolve(false);
	});
};

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location: any) {
	return (originalReplace.call(this, location) as any).catch((err: any) => {
		if (err.name !== 'NavigationDuplicated') {
			throw err;
		}
		return Promise.resolve(false);
	});
};

router.beforeEach(async (to, from, next) => {
	try {
		// Verificar autenticación en Vuex
		let isAuthenticated = store.getters['auth/isAuthenticated'];

		// Verificar si la ruta requiere autenticación
		const isAuthRoute = to.matched.some(
			(record) => record.meta.requiresAuth
		);

		// Rutas públicas que siempre son accesibles
		const publicRoutes = [
			'login',
			'recover',
			'verify-code',
			'change-password',
			'student-registration',
		];

		// Si estamos intentando acceder a la ruta de login y ya estamos autenticados, redirigir según rol
		if (publicRoutes.includes(to.name as string) && isAuthenticated) {
			const role = store.getters['auth/selectedRole'];
			return next(userRoleRedirect(role));
		}

		// Si la ruta no requiere autenticación, permitir el acceso
		if (!isAuthRoute) {
			return next();
		}

		// Para rutas protegidas, verificar token
		const token = localStorage.getItem('token');

		// Si no hay token, no permitir el acceso a rutas protegidas
		if (!token) {
			store.dispatch('auth/logout');
			return next({ name: 'login' });
		}

		// Si tenemos token pero no estamos autenticados en Vuex, intentar restaurar la sesión
		if (!isAuthenticated) {
			// Intentar restaurar sesión desde el token JWT
			const restored = await store.dispatch('auth/initializeStore');
			if (!restored) {
				return next({ name: 'login' });
			}
			isAuthenticated = store.getters['auth/isAuthenticated'];
		}

		// Si después de intentar restaurar seguimos sin autenticación, ir al login
		if (!isAuthenticated) {
			return next({ name: 'login' });
		}

		// Obtener el rol seleccionado actual
		let selectedRole = store.getters['auth/selectedRole'];

		// Si no hay rol seleccionado, error
		if (!selectedRole) {
			store.dispatch('auth/logout');
			return next({ name: 'login' });
		}

		// Definir rutas permitidas para cada rol (nombres de ruta, no patrones)
		const adminRoutes = [
			'codec',
			'homePage',
			'group',
			'users',
			'questions',
			'discipline',
			'periods',
			'periods-detail',
			'visual-config',
			'workspaces',
			'save-group',
			'group-detail',
			'teacher-evaluation-results',
			'evaluation-detail',
			'reports',
			'edit-group'
		];

		const teacherRoutes = ['codec-vd', 'homePageVd', 'group-list','group-view', 'evaluation-detail', 'evaluation-teacher-results'];

		const studentRoutes = ['codec-student', 'homePageStudent', 'my-groups', 'teacher-evaluation', 'submit-evaluation'];

		// Verificar si el nombre de la ruta está permitido para el rol
		const hasRouteAccess = (allowedRoutes: string[]): boolean => {
			if (!to.name) return false;

			const routeName = to.name.toString();
			const hasAccess = allowedRoutes.includes(routeName);

			return hasAccess;
		};

		// Verificar acceso según rol
		if (selectedRole === 'admin') {
			if (hasRouteAccess(adminRoutes)) {
				return next();
			}
			return next({ name: 'users' });
		} else if (selectedRole === 'teacher') {
			if (hasRouteAccess(teacherRoutes)) {
				return next();
			}
			return next({ name: 'group-list' });
		} else if (selectedRole === 'student') {
			if (hasRouteAccess(studentRoutes)) {
				return next();
			}
			return next({ name: 'my-groups' });
		}

		// Si llega aquí, redirigir según rol
		return next(userRoleRedirect(selectedRole));

	} catch (error) {
		store.dispatch('auth/logout');
		return next({ name: 'login' });
	}
});

router.afterEach((to, from) => {
	Vue.nextTick(() => {
		document.title = to.meta?.title || DEFAULT_TITLE;
	});
});

export default router;
