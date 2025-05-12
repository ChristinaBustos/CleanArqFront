export function isTextValid(text: string): boolean {
    return /^[a-zA-Z0-9\s.,'"áéíóúÁÉÍÓÚñÑ]+$/.test(text)
}

export function isMaxSize(file: File): boolean {
    const maxSize = 2 * 1024 * 1024
    return file.size <= maxSize
}

export function isValidFileType(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
    return validTypes.includes(file.type)
}