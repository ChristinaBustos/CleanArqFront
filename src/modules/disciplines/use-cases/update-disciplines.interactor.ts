import { UseCase } from "@/kernel/contract";
import { UpdateDisciplineDto } from "../entities/update-disciplines.dto";
import { ApiResponse } from "@/kernel/types";
import { Discipline } from "../entities/discipline";
import { disciplineRepository } from "./ports/disciplines.repository";

export class UpdateDisciplinesInteractor implements UseCase<UpdateDisciplineDto, ApiResponse<Discipline>> {
    constructor(private readonly disciplineRepository: disciplineRepository) {}

    async execute(discipline: UpdateDisciplineDto): Promise<ApiResponse<Discipline>> {
        return await this.disciplineRepository.updateDiscipline(discipline)
    }
}