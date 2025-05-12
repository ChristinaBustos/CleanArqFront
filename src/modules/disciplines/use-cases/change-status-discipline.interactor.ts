import { UseCase } from "@/kernel/contract";
import { ApiResponse } from "@/kernel/types";
import { Discipline } from "../entities/discipline";
import { disciplineRepository } from "./ports/disciplines.repository";
import { ChangeStatusDisciplineDto } from "../entities/change-status-disciplines.dto";

export class ChangesStatusDisciplineInteractor implements UseCase<ChangeStatusDisciplineDto, ApiResponse<Discipline>> {
    constructor(private readonly disciplineRepository: disciplineRepository) {}

    async execute(discipline: ChangeStatusDisciplineDto): Promise<ApiResponse<Discipline>> {
        return await this.disciplineRepository.changeStatusDiscipline(discipline)
    }
}