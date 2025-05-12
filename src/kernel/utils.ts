import moment from "moment";

export function isValidQuestion(question : string) : boolean {
    return /^(?!.* {2})[¿¡A-Za-zÁÉÍÓÚáéíóúÜüÑñ0-9.,;:?! ]+$/.test(question);
}

export function isValidText(data: string): boolean {
    return /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/.test(data);
}



export const noSpecialChars = (value: string) => /^[a-zA-ZÀ-ÿ\s]*$/.test(value);


export const formatHour = (hour : string) => {
    return moment(hour, "HH:mm").format('HH:mm a');
}

export const format24Hour = (hour : string) => {
    return moment(hour, "HH:mm").format('HH:MM');
}

export const formatRoleName = (roleName: string): string => {
	const roleMap: Record<string, string> = {
		admin: 'Administrador',
		teacher: 'Docente',
		student: 'Estudiante',
	};

	return (
		roleMap[roleName] ||
		roleName.charAt(0).toUpperCase() + roleName.slice(1)
	);
};

export const userRoleRedirect = (role: string) => {
	switch (role) {
		case 'admin':
			return { name: 'users' };
		case 'teacher':
			return { name: 'group-list' };
		case 'student':
			return { name: 'my-groups' };
		default:
			return { name: 'login' };
	}
}
export const validateEnrollment = (enrollment: string) => {
    return /^[a-zA-Z0-9]+$/.test(enrollment);
}


export const validComment = (comment: string) => {
	return /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9.,;:¿?¡!"'()\- ]*$/.test(comment);
}