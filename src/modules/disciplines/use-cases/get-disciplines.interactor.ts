import { UseCase } from "@/kernel/contract";
import { ApiResponse, PaginationDto } from "@/kernel/types";
import { Discipline } from "../entities/discipline";
import { disciplineRepository } from "./ports/disciplines.repository";

export class GetAllDisciplinesInteractor implements UseCase<PaginationDto, ApiResponse<Discipline[]>> {
    constructor(private readonly disciplineRepository: disciplineRepository) {}

    async execute(disciplines: PaginationDto): Promise<ApiResponse<Discipline[]>> {
        return await this.disciplineRepository.getAllDisciplines(disciplines)
    }
}