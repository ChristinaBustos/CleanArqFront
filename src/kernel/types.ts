import { SweetAlertIcon } from 'sweetalert2';
export type Entity<Tidentifier extends number | string> = {
	id?: Tidentifier;
};

export enum TypesResponse {
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
	WARNING = 'WARNING',
}

export interface Metadata {
	total: number;
	totalFiltered: number;
	currentPage: number;
	pageSize: number;
	totalPages: number;
}

export interface ApiResponse<T> {
	result: T | null;
	metadata: Metadata | null;
	type: TypesResponse;
	text: string;
}

export type PaginationDto = {
	value?: string;
	paginationType?: {
		filter?: string;
		sortBy?: string;
		order?: string;
		page?: number;
		limit?: number;
	};
};

export enum SubPeriodType {
	INSCRIPCION = 'INSCRIPCION',
	EVALUACION_DOCENTE = 'EVALUACION_DOCENTE',
	LIBERACION = 'LIBERACION',
	INSCRIPCION_EXTRAORDINARIA = 'INSCRIPCION_EXTRAORDINARIA',
	INSCRIPCION_SELECTIVOS = 'INSCRIPCION_SELECTIVOS',
}

export type ToastConfig = {
	icon: SweetAlertIcon;
	title: string;
	text: string;
	onCloseCallback?: () => void;
	timer?: number;
};

export type Person = {
	id: number;
	name: string;
	surname: string;
	gender: string;
	email: string;
	status: boolean;
	createdAt: Date;
};

export type FunctionToastConfig = Omit<ToastConfig, 'icon'>
